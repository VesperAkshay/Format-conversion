from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks, Request
from fastapi.responses import FileResponse
import os
import uuid
import shutil
import asyncio
from typing import Optional, List, Dict, Any, Callable
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor, Future
import aiofiles
import time
import hashlib
from pydantic import BaseModel, EmailStr

from app.utils.conversion_handler import ConversionHandler
from app.utils.email_service import email_service
from app.tasks import convert_file_task, cleanup_old_files

router = APIRouter(
    prefix="/api/convert",
    tags=["conversion"],
)

# Initialize the conversion handler
conversion_handler = ConversionHandler()

# In-memory cache for conversion results
conversion_cache: Dict[str, str] = {}

# Track active conversions to prevent duplicates
active_conversions: Dict[str, Future] = {}

# Define the email sharing request model
class ShareFileRequest(BaseModel):
    filename: str
    recipient_email: EmailStr
    message: Optional[str] = None

@router.post("/file")
async def convert_file(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    target_format: str = Form(...),
    conversion_type: str = Form(...),
):
    """
    Convert a file to the specified format.
    
    Args:
        file: The file to convert
        target_format: The format to convert to (e.g., 'pdf', 'docx', 'jpg')
        conversion_type: The type of conversion ('text', 'document', 'image', 'audio', 'video', 'compressed')
    
    Returns:
        A JSON response with the path to the converted file
    """
    # Generate a unique filename to avoid collisions
    original_filename = file.filename
    filename_without_ext = os.path.splitext(original_filename)[0]
    unique_id = str(uuid.uuid4())
    
    # Save the uploaded file
    upload_folder = os.path.join("uploads", conversion_type)
    os.makedirs(upload_folder, exist_ok=True)
    
    file_location = os.path.join(upload_folder, f"{filename_without_ext}_{unique_id}{os.path.splitext(original_filename)[1]}")
    
    # Generate a cache key for this conversion
    file_content = await file.read(1024 * 1024)  # Read first MB for hash
    await file.seek(0)  # Reset file position
    
    hash_obj = hashlib.md5()
    hash_obj.update(file_content)
    hash_obj.update(target_format.encode())
    hash_obj.update(conversion_type.encode())
    cache_key = hash_obj.hexdigest()
    
    # Check Redis cache
    redis_client = request.app.state.redis
    cached_result = redis_client.get(f"conversion:{cache_key}")
    
    if cached_result:
        cached_path = cached_result.decode('utf-8')
        if os.path.exists(cached_path):
            return {
                "success": True,
                "message": "File converted successfully (cached)",
                "file_path": cached_path,
                "download_url": f"/outputs/{os.path.basename(cached_path)}"
            }
    
    # Save the uploaded file asynchronously
    async with aiofiles.open(file_location, "wb") as buffer:
        # Use chunks to handle large files efficiently
        chunk_size = 1024 * 1024  # 1MB chunks
        while True:
            chunk = await file.read(chunk_size)
            if not chunk:
                break
            await buffer.write(chunk)
    
    try:
        # Submit the conversion task to Celery
        task = convert_file_task.delay(
            file_path=file_location,
            target_format=target_format,
            conversion_type=conversion_type,
            output_filename=f"{filename_without_ext}_{unique_id}"
        )
        
        # Wait for the task to complete (with a timeout)
        output_path = task.get(timeout=300)  # 5 minutes timeout
        
        # Cache the result in Redis
        redis_client.setex(
            f"conversion:{cache_key}",
            3600 * 24,  # 24 hours expiration
            output_path
        )
        
        # Schedule file cleanup after response is sent
        background_tasks.add_task(cleanup_files, file_location, output_path, delay=3600)  # Clean up after 1 hour
        
        return {
            "success": True,
            "message": "File converted successfully",
            "file_path": output_path,
            "download_url": f"/outputs/{os.path.basename(output_path)}"
        }
    
    except Exception as e:
        # Clean up the uploaded file if conversion fails
        if os.path.exists(file_location):
            os.remove(file_location)
        
        raise HTTPException(
            status_code=500,
            detail=f"Conversion failed: {str(e)}"
        )

@router.post("/file/async")
async def convert_file_async(
    request: Request,
    file: UploadFile = File(...),
    target_format: str = Form(...),
    conversion_type: str = Form(...),
):
    """
    Convert a file asynchronously and return a task ID.
    
    Args:
        file: The file to convert
        target_format: The format to convert to (e.g., 'pdf', 'docx', 'jpg')
        conversion_type: The type of conversion ('text', 'document', 'image', 'audio', 'video', 'compressed')
    
    Returns:
        A JSON response with the task ID
    """
    # Generate a unique filename to avoid collisions
    original_filename = file.filename
    filename_without_ext = os.path.splitext(original_filename)[0]
    unique_id = str(uuid.uuid4())
    
    # Save the uploaded file
    upload_folder = os.path.join("uploads", conversion_type)
    os.makedirs(upload_folder, exist_ok=True)
    
    file_location = os.path.join(upload_folder, f"{filename_without_ext}_{unique_id}{os.path.splitext(original_filename)[1]}")
    
    # Save the uploaded file asynchronously
    async with aiofiles.open(file_location, "wb") as buffer:
        # Use chunks to handle large files efficiently
        chunk_size = 1024 * 1024  # 1MB chunks
        while True:
            chunk = await file.read(chunk_size)
            if not chunk:
                break
            await buffer.write(chunk)
    
    try:
        # Submit the conversion task to Celery
        task = convert_file_task.delay(
            file_path=file_location,
            target_format=target_format,
            conversion_type=conversion_type,
            output_filename=f"{filename_without_ext}_{unique_id}"
        )
        
        return {
            "success": True,
            "message": "Conversion task submitted",
            "task_id": task.id,
            "status_url": f"/api/convert/status/{task.id}"
        }
    
    except Exception as e:
        # Clean up the uploaded file if task submission fails
        if os.path.exists(file_location):
            os.remove(file_location)
        
        raise HTTPException(
            status_code=500,
            detail=f"Failed to submit conversion task: {str(e)}"
        )

@router.get("/status/{task_id}")
async def get_task_status(request: Request, task_id: str):
    """
    Get the status of a conversion task.
    
    Args:
        task_id: The ID of the task to check
    
    Returns:
        A JSON response with the task status
    """
    try:
        # Get the task result from Celery
        task = convert_file_task.AsyncResult(task_id)
        
        if task.state == 'PENDING':
            response = {
                'status': 'pending',
                'message': 'Task is pending'
            }
        elif task.state == 'STARTED':
            response = {
                'status': 'started',
                'message': 'Task has started'
            }
        elif task.state == 'SUCCESS':
            output_path = task.result
            response = {
                'status': 'success',
                'message': 'Task completed successfully',
                'file_path': output_path,
                'download_url': f"/outputs/{os.path.basename(output_path)}"
            }
        elif task.state == 'FAILURE':
            response = {
                'status': 'failure',
                'message': str(task.result)
            }
        else:
            response = {
                'status': task.state,
                'message': 'Unknown state'
            }
        
        return response
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get task status: {str(e)}"
        )

@router.get("/download/{filename}")
async def download_file(filename: str):
    """
    Download a converted file.
    
    Args:
        filename: The name of the file to download
    
    Returns:
        The file as a response
    """
    file_path = os.path.join("outputs", filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream"
    )

@router.get("/supported-formats")
async def get_supported_formats():
    """
    Get a list of supported conversion formats.
    
    Returns:
        A JSON response with supported formats for each conversion type
    """
    return conversion_handler.get_supported_formats()

@router.post("/share")
async def share_file_via_email(request: ShareFileRequest):
    """
    Share a converted file via email using SendGrid.
    
    Args:
        request: ShareFileRequest containing filename, recipient email, and optional message
        
    Returns:
        dict: Response indicating success or failure
    """
    try:
        # Construct the file path
        file_path = os.path.join("outputs", request.filename)
        
        # Check if file exists
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        # Send email with file attachment
        result = await email_service.send_file_sharing_email(
            recipient_email=request.recipient_email,
            file_path=file_path,
            file_name=request.filename,
            sender_message=request.message
        )
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["message"])
        
        return {
            "success": True,
            "message": "File shared successfully",
            "details": result
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to share file: {str(e)}")

async def cleanup_files(file_path: str, output_path: str, delay: int = 3600):
    """
    Clean up temporary files after a delay.
    
    Args:
        file_path: Path to the uploaded file
        output_path: Path to the converted file
        delay: Delay in seconds before cleanup (default: 1 hour)
    """
    import asyncio
    
    await asyncio.sleep(delay)
    
    # Remove the files if they exist
    if os.path.exists(file_path):
        os.remove(file_path)
    
    if os.path.exists(output_path):
        os.remove(output_path) 