from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, BackgroundTasks, Request
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from app.services.groq_service import GroqService
import logging
import re
import json
import os

# Import conversion related modules
from app.routers.conversion_router import convert_file as conversion_endpoint
from app.utils.file_manager import FileManager
from app.tasks import convert_file_task, cleanup_old_files

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/chat",
    tags=["chat"],
    responses={404: {"description": "Not found"}},
)

# Initialize the Groq service
try:
    groq_service = GroqService()
    logger.info("GroqService initialized successfully")
except Exception as e:
    logger.error(f"Error initializing GroqService: {str(e)}")
    # Create a placeholder service that will raise exceptions when used
    groq_service = None

# Initialize file manager
file_manager = FileManager()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1024
    model: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    id: Optional[str] = None
    model: Optional[str] = None
    usage: Optional[Dict[str, int]] = None
    error: Optional[str] = None
    action: Optional[Dict[str, Any]] = None

class ConversionRequest(BaseModel):
    conversion_type: str
    target_format: str
    file_url: Optional[str] = None
    file_path: Optional[str] = None
    user_message: str
    chat_history: List[Dict[str, str]]

class ConversionResponse(BaseModel):
    success: bool
    message: str
    file_path: Optional[str] = None
    download_url: Optional[str] = None
    error: Optional[str] = None

# Function to detect conversion intent from user message
def detect_conversion_intent(message: str) -> Optional[Dict[str, str]]:
    """
    Detect if the user message contains a conversion intent.
    Returns a dictionary with conversion_type and target_format if detected.
    """
    # Example patterns to detect conversion requests
    patterns = [
        # Convert X to Y format
        r"(?:convert|change)\s+(?:this|my|the)?\s*(?P<source_format>\w+)?\s*(?:file)?\s*(?:to|into)\s+(?P<target_format>\w+)",
        # I want to convert X to Y
        r"(?:I want to|I'd like to|Can you|Please|Help me)\s+(?:convert|change)\s+(?:this|my|the)?\s*(?P<source_format>\w+)?\s*(?:file)?\s*(?:to|into)\s+(?P<target_format>\w+)",
    ]
    
    # Conversion type mappings
    format_to_type = {
        # Text formats
        "txt": "text", "md": "text", "markdown": "text", "html": "text", 
        "xml": "text", "json": "text", "csv": "text", "yaml": "text",
        
        # Document formats
        "pdf": "document", "docx": "document", "doc": "document", 
        "odt": "document", "rtf": "document",
        
        # Image formats
        "jpg": "image", "jpeg": "image", "png": "image", "gif": "image", 
        "bmp": "image", "tiff": "image", "webp": "image", "svg": "image",
        
        # Audio formats
        "mp3": "audio", "wav": "audio", "ogg": "audio", "flac": "audio", 
        "aac": "audio", "m4a": "audio",
        
        # Video formats
        "mp4": "video", "avi": "video", "mkv": "video", "mov": "video", 
        "webm": "video",
        
        # Compressed formats
        "zip": "compressed", "tar": "compressed", "gz": "compressed", 
        "7z": "compressed", "rar": "compressed"
    }
    
    for pattern in patterns:
        match = re.search(pattern, message, re.IGNORECASE)
        if match:
            # Extract source and target formats
            target_format = match.group("target_format").lower() if match.group("target_format") else None
            
            if target_format:
                # Determine conversion type from the target format
                conversion_type = format_to_type.get(target_format, None)
                if conversion_type:
                    return {
                        "conversion_type": conversion_type,
                        "target_format": target_format
                    }
    
    return None

@router.post("/completions", response_model=ChatResponse)
async def chat_completion(chat_request: ChatRequest):
    """
    Generate a response using the Groq AI chat model
    """
    if groq_service is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Chat service is currently unavailable. Please try again later."
        )

    # Convert the Pydantic models to dictionaries
    messages = [
        {"role": message.role, "content": message.content}
        for message in chat_request.messages
    ]
    
    # Check if the last user message contains a conversion intent
    last_user_message = None
    for message in reversed(messages):
        if message["role"] == "user":
            last_user_message = message["content"]
            break
    
    # Initialize action as None
    action = None
    
    # If there's a user message, check for conversion intent
    if last_user_message:
        conversion_intent = detect_conversion_intent(last_user_message)
        if conversion_intent:
            # Add information about detected conversion in the action field
            action = {
                "type": "conversion_intent",
                "data": conversion_intent
            }
    
    # Override the model if specified
    model_to_use = chat_request.model
    if model_to_use and model_to_use in groq_service.get_supported_models():
        groq_service.model = model_to_use
    
    try:
        logger.info(f"Sending chat request with {len(messages)} messages")
        response = await groq_service.generate_chat_response(
            messages=messages,
            temperature=chat_request.temperature,
            max_tokens=chat_request.max_tokens
        )
        
        if "error" in response:
            logger.error(f"Error from GroqService: {response['error']}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=response["error"]
            )
        
        logger.info("Successfully generated chat response")
        
        # Add action to the response if we detected a conversion intent
        if action:
            response["action"] = action
        
        return response
    except Exception as e:
        logger.exception(f"Exception during chat completion: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate chat response: {str(e)}"
        )

@router.post("/convert", response_model=ConversionResponse)
async def chat_convert_file(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    conversion_type: str = Form(...),
    target_format: str = Form(...),
    user_message: str = Form(...)
):
    """
    Endpoint to handle file conversions triggered from the chat interface
    """
    try:
        # Get the output path for the converted file
        # We'll handle the Depends differently than the main conversion endpoint
        # This fixes the "Object of type Depends is not JSON serializable" error
        
        # Save the uploaded file using the file manager
        file_path, file_hash, unique_id = await file_manager.save_uploaded_file(
            file=file,
            conversion_type=conversion_type,
            user_id=None  # Use None instead of Depends(get_user_id)
        )
        
        output_filename = os.path.basename(file.filename)
        
        # Submit the conversion task to Celery
        task = convert_file_task.delay(
            file_path=file_path,
            target_format=target_format,
            conversion_type=conversion_type,
            output_filename=output_filename,
            file_hash=file_hash,
            unique_id=unique_id,
            user_id=None
        )
        
        # Wait for the task to complete (with a timeout)
        output_path = task.get(timeout=300)  # 5 minutes timeout
        
        # Schedule file cleanup after response is sent
        background_tasks.add_task(cleanup_old_files, file_path, output_path, delay=3600)  # Clean up after 1 hour
        
        # Get the download URL
        download_url = file_manager.get_file_url(output_path)
        
        # Prepare the response for the chat interface
        logger.info(f"Chat-triggered conversion completed successfully: {output_path}")
        return {
            "success": True,
            "message": "File converted successfully",
            "file_path": output_path,
            "download_url": download_url
        }
    except HTTPException as e:
        # Re-raise HTTP exceptions
        logger.error(f"HTTP Exception in chat conversion: {e.detail}")
        raise
    except Exception as e:
        # Handle other exceptions
        logger.exception(f"Error in chat conversion: {str(e)}")
        return {
            "success": False,
            "message": "Conversion failed",
            "error": str(e)
        }

@router.get("/models")
async def get_supported_models():
    """
    Get a list of supported Groq AI models
    """
    if groq_service is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Chat service is currently unavailable. Please try again later."
        )
        
    try:
        return {"models": groq_service.get_supported_models()}
    except Exception as e:
        logger.exception(f"Exception getting models: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get supported models: {str(e)}"
        ) 