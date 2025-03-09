import os
import time
import shutil
import asyncio
from datetime import datetime, timedelta
from celery.utils.log import get_task_logger

from app.celery_worker import celery
from app.utils.conversion_handler import ConversionHandler

# Initialize logger
logger = get_task_logger(__name__)

# Initialize conversion handler
conversion_handler = ConversionHandler()

@celery.task(name="convert_file_task")
def convert_file_task(file_path, target_format, conversion_type, output_filename=None):
    """
    Celery task to convert a file to the specified format.
    
    Args:
        file_path: Path to the file to convert
        target_format: Format to convert to
        conversion_type: Type of conversion
        output_filename: Optional custom filename for the output file
        
    Returns:
        Path to the converted file
    """
    logger.info(f"Starting conversion of {os.path.basename(file_path)} to {target_format}")
    start_time = time.time()
    
    # Run the conversion in an event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        # Perform the conversion
        output_path = loop.run_until_complete(
            conversion_handler.convert_file(
                file_path=file_path,
                target_format=target_format,
                conversion_type=conversion_type,
                output_filename=output_filename
            )
        )
        
        end_time = time.time()
        logger.info(f"Conversion completed in {end_time - start_time:.2f} seconds")
        
        return output_path
    except Exception as e:
        logger.error(f"Conversion failed: {str(e)}")
        raise
    finally:
        loop.close()

@celery.task(name="cleanup_old_files")
def cleanup_old_files(max_age_hours=24):
    """
    Celery task to clean up old files from uploads and outputs directories.
    
    Args:
        max_age_hours: Maximum age of files in hours before they are deleted
    """
    logger.info(f"Starting cleanup of files older than {max_age_hours} hours")
    
    # Calculate cutoff time
    cutoff_time = datetime.now() - timedelta(hours=max_age_hours)
    
    # Clean up uploads directory
    cleanup_directory("uploads", cutoff_time)
    
    # Clean up outputs directory
    cleanup_directory("outputs", cutoff_time)
    
    logger.info("Cleanup completed")

def cleanup_directory(directory, cutoff_time):
    """
    Clean up files in a directory that are older than the cutoff time.
    
    Args:
        directory: Directory to clean up
        cutoff_time: Cutoff time for file deletion
    """
    if not os.path.exists(directory):
        return
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            
            # Get file modification time
            file_mtime = datetime.fromtimestamp(os.path.getmtime(file_path))
            
            # Delete file if it's older than the cutoff time
            if file_mtime < cutoff_time:
                try:
                    os.remove(file_path)
                    logger.info(f"Deleted old file: {file_path}")
                except Exception as e:
                    logger.error(f"Failed to delete file {file_path}: {str(e)}")
        
        # Delete empty directories
        for dir in dirs:
            dir_path = os.path.join(root, dir)
            if not os.listdir(dir_path):
                try:
                    os.rmdir(dir_path)
                    logger.info(f"Deleted empty directory: {dir_path}")
                except Exception as e:
                    logger.error(f"Failed to delete directory {dir_path}: {str(e)}") 