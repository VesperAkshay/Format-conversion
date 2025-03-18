from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks, Request, Depends
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
from datetime import datetime

from app.utils.conversion_handler import ConversionHandler
from app.utils.file_manager import FileManager
from app.utils.email_service import email_service
from app.tasks import convert_file_task, cleanup_old_files

router = APIRouter(
    prefix="/api/convert",
    tags=["conversion"],
)

# Initialize the conversion handler
conversion_handler = ConversionHandler()

# Initialize the file manager
file_manager = FileManager()

# In-memory cache for conversion results
conversion_cache: Dict[str, str] = {}

# Track active conversions to prevent duplicates
active_conversions: Dict[str, Future] = {}

# Define the email sharing request model
class ShareFileRequest(BaseModel):
    filename: str
    recipient_email: EmailStr
    message: Optional[str] = None

# Optional dependency for user ID (can be expanded with actual auth)
async def get_user_id(request: Request) -> Optional[str]:
    """Get the user ID from the request, if available"""
    # This is a placeholder - in a real app, you'd get this from auth
    return request.headers.get("X-User-ID")

@router.post("/file")
async def convert_file(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    target_format: str = Form(...),
    conversion_type: str = Form(...),
    user_id: Optional[str] = Depends(get_user_id),
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
    try:
        # Save the uploaded file using the file manager
        file_path, file_hash, unique_id = await file_manager.save_uploaded_file(
            file=file,
            conversion_type=conversion_type,
            user_id=user_id
        )
        
        # Generate a cache key for this conversion
        cache_key = f"{file_hash}:{target_format}:{conversion_type}"
        
        # Check Redis cache
        redis_client = request.app.state.redis
        cached_result = redis_client.get(f"conversion:{cache_key}")
        
        if cached_result:
            cached_path = cached_result.decode('utf-8')
            if os.path.exists(cached_path):
                download_url = file_manager.get_file_url(cached_path)
                return {
                    "success": True,
                    "message": "File converted successfully (cached)",
                    "file_path": cached_path,
                    "download_url": download_url
                }
        
        # Get the output path for the converted file
        output_filename = os.path.basename(file.filename)
        
        # Submit the conversion task to Celery
        task = convert_file_task.delay(
            file_path=file_path,
            target_format=target_format,
            conversion_type=conversion_type,
            output_filename=output_filename,
            file_hash=file_hash,
            unique_id=unique_id,
            user_id=user_id
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
        background_tasks.add_task(cleanup_files, file_path, output_path, delay=3600)  # Clean up after 1 hour
        
        # Get the download URL
        download_url = file_manager.get_file_url(output_path)
        
        return {
            "success": True,
            "message": "File converted successfully",
            "file_path": output_path,
            "download_url": download_url
        }
    
    except Exception as e:
        # Clean up the uploaded file if conversion fails
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
        
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
    user_id: Optional[str] = Depends(get_user_id),
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
    try:
        # Save the uploaded file using the file manager
        file_path, file_hash, unique_id = await file_manager.save_uploaded_file(
            file=file,
            conversion_type=conversion_type,
            user_id=user_id
        )
        
        # Get the output filename
        output_filename = os.path.basename(file.filename)
        
        # Submit the conversion task to Celery
        task = convert_file_task.delay(
            file_path=file_path,
            target_format=target_format,
            conversion_type=conversion_type,
            output_filename=output_filename,
            file_hash=file_hash,
            unique_id=unique_id,
            user_id=user_id
        )
        
        return {
            "success": True,
            "message": "Conversion task submitted",
            "task_id": task.id,
            "status_url": f"/api/convert/status/{task.id}"
        }
    
    except Exception as e:
        # Clean up the uploaded file if task submission fails
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
        
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
    # First check in outputs directory
    output_path = os.path.join("outputs", filename)
    if os.path.exists(output_path):
        return FileResponse(output_path, filename=filename)
    
    # Then check in uploads directory
    upload_path = os.path.join("uploads", filename)
    if os.path.exists(upload_path):
        return FileResponse(upload_path, filename=filename)
    
    # If file not found, raise 404
    raise HTTPException(
        status_code=404,
        detail=f"File not found: {filename}"
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
        # Extract the filename from the path if it contains slashes
        filename = request.filename.split('/')[-1]
        
        # First try to find the file directly in the outputs directory
        file_path = os.path.join("outputs", filename)
        
        # If file doesn't exist, try to search for it in subdirectories
        if not os.path.exists(file_path):
            # Get current date for directory structure
            today = datetime.now()
            year_month_day = f"{today.year}/{today.month:02d}/{today.day:02d}"
            
            # Try date-based directory structure
            date_based_path = os.path.join("outputs", year_month_day, filename)
            if os.path.exists(date_based_path):
                file_path = date_based_path
            else:
                # Try to find the file in any subdirectory of outputs
                for root, dirs, files in os.walk("outputs"):
                    if filename in files:
                        file_path = os.path.join(root, filename)
                        break
        
        # Check if file exists after all attempts
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"File not found: {filename}")
        
        # Send email with file attachment
        result = await email_service.send_file_sharing_email(
            recipient_email=request.recipient_email,
            file_path=file_path,
            file_name=filename,
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
    Clean up files after a delay.
    
    Args:
        file_path: Path to the input file
        output_path: Path to the output file
        delay: Delay in seconds before cleaning up
    """
    await asyncio.sleep(delay)
    
    # Remove the input file if it exists
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception:
            pass
    
    # Remove the output file if it exists
    if os.path.exists(output_path):
        try:
            os.remove(output_path)
        except Exception:
            pass 