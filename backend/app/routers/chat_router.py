from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from app.services.groq_service import GroqService
import logging

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
        return response
    except Exception as e:
        logger.exception(f"Exception during chat completion: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate chat response: {str(e)}"
        )

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