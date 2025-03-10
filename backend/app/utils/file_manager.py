import os
import uuid
import hashlib
from datetime import datetime
from typing import Optional, Tuple, Dict, Any
import shutil
import aiofiles
from fastapi import UploadFile

class FileManager:
    """
    Manages file storage with a structured directory system and unique identifiers.
    Implements date-based directories, user-based directories, and file deduplication.
    """
    
    def __init__(self, base_upload_dir: str = "uploads", base_output_dir: str = "outputs"):
        """Initialize the file manager with base directories"""
        self.base_upload_dir = base_upload_dir
        self.base_output_dir = base_output_dir
        
        # Ensure base directories exist
        os.makedirs(self.base_upload_dir, exist_ok=True)
        os.makedirs(self.base_output_dir, exist_ok=True)
        
        # Cache for file hashes to enable deduplication
        self.file_hash_cache: Dict[str, str] = {}
    
    async def save_uploaded_file(
        self, 
        file: UploadFile, 
        conversion_type: str,
        user_id: Optional[str] = None
    ) -> Tuple[str, str, str]:
        """
        Save an uploaded file using a structured directory system.
        
        Args:
            file: The uploaded file
            conversion_type: Type of conversion (used for categorization)
            user_id: Optional user ID for user-based directories
            
        Returns:
            Tuple of (file_path, file_hash, unique_id)
        """
        # Generate a unique ID
        unique_id = str(uuid.uuid4())
        
        # Create date-based directory structure
        today = datetime.now()
        year_month_day = f"{today.year}/{today.month:02d}/{today.day:02d}"
        
        # Determine the directory path
        if user_id:
            # User-based + date-based directory
            dir_path = os.path.join(
                self.base_upload_dir,
                conversion_type,
                f"user_{user_id}",
                year_month_day
            )
        else:
            # Just date-based directory
            dir_path = os.path.join(
                self.base_upload_dir,
                conversion_type,
                year_month_day
            )
        
        # Create the directory if it doesn't exist
        os.makedirs(dir_path, exist_ok=True)
        
        # Get original filename and extension
        original_filename = file.filename
        filename_without_ext, file_ext = os.path.splitext(original_filename)
        
        # Calculate file hash for deduplication
        file_content = await file.read(1024 * 1024)  # Read first MB for hash
        await file.seek(0)  # Reset file position
        
        hash_obj = hashlib.md5()
        hash_obj.update(file_content)
        file_hash = hash_obj.hexdigest()
        
        # Check if we already have this file
        if file_hash in self.file_hash_cache:
            # Return the existing file path
            return self.file_hash_cache[file_hash], file_hash, unique_id
        
        # Create a new filename with hash and UUID
        new_filename = f"{filename_without_ext}_{file_hash[:8]}_{unique_id[:8]}{file_ext}"
        file_path = os.path.join(dir_path, new_filename)
        
        # Save the file
        async with aiofiles.open(file_path, "wb") as buffer:
            # Use chunks to handle large files efficiently
            chunk_size = 1024 * 1024  # 1MB chunks
            while True:
                chunk = await file.read(chunk_size)
                if not chunk:
                    break
                await buffer.write(chunk)
        
        # Cache the file hash
        self.file_hash_cache[file_hash] = file_path
        
        return file_path, file_hash, unique_id
    
    def get_output_path(
        self,
        original_filename: str,
        target_format: str,
        file_hash: str,
        unique_id: str,
        user_id: Optional[str] = None
    ) -> str:
        """
        Generate an output path for a converted file.
        
        Args:
            original_filename: Original filename
            target_format: Target format for the conversion
            file_hash: Hash of the original file
            unique_id: Unique ID for the conversion
            user_id: Optional user ID
            
        Returns:
            Path to the output file
        """
        # Create date-based directory structure
        today = datetime.now()
        year_month_day = f"{today.year}/{today.month:02d}/{today.day:02d}"
        
        # Determine the directory path
        if user_id:
            # User-based + date-based directory
            dir_path = os.path.join(
                self.base_output_dir,
                f"user_{user_id}",
                year_month_day
            )
        else:
            # Just date-based directory
            dir_path = os.path.join(
                self.base_output_dir,
                year_month_day
            )
        
        # Create the directory if it doesn't exist
        os.makedirs(dir_path, exist_ok=True)
        
        # Get filename without extension
        filename_without_ext = os.path.splitext(original_filename)[0]
        
        # Create a new filename with hash and UUID
        new_filename = f"{filename_without_ext}_{file_hash[:8]}_{unique_id[:8]}.{target_format}"
        
        return os.path.join(dir_path, new_filename)
    
    def move_file(self, source_path: str, target_path: str) -> str:
        """
        Move a file from source to target path.
        
        Args:
            source_path: Source file path
            target_path: Target file path
            
        Returns:
            Target file path
        """
        # Create target directory if it doesn't exist
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        
        # Move the file
        shutil.move(source_path, target_path)
        
        return target_path
    
    def get_file_url(self, file_path: str) -> str:
        """
        Get a URL for a file.
        
        Args:
            file_path: Path to the file
            
        Returns:
            URL for the file
        """
        if file_path.startswith(self.base_upload_dir):
            # Upload file
            relative_path = os.path.relpath(file_path, self.base_upload_dir)
            return f"/uploads/{relative_path}"
        elif file_path.startswith(self.base_output_dir):
            # Output file
            relative_path = os.path.relpath(file_path, self.base_output_dir)
            return f"/outputs/{relative_path}"
        else:
            # Unknown file
            return f"/file/{os.path.basename(file_path)}" 