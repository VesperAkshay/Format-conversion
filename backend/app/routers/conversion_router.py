from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
import os
import uuid
import shutil
from typing import Optional, List

from app.utils.conversion_handler import ConversionHandler

router = APIRouter(
    prefix="/api/convert",
    tags=["conversion"],
)

# Initialize the conversion handler
conversion_handler = ConversionHandler()

@router.post("/file")
async def convert_file(
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
    
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Process the conversion
        output_path = await conversion_handler.convert_file(
            file_path=file_location,
            target_format=target_format,
            conversion_type=conversion_type,
            output_filename=f"{filename_without_ext}_{unique_id}"
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