import os
import zipfile
import tarfile
import shutil
import tempfile
import asyncio
from typing import List, Optional

from app.utils.base_converter import BaseConverter

class CompressedConverter(BaseConverter):
    """
    Converter for compressed file formats.
    Supports conversions between various compressed formats like zip, tar, gz, etc.
    """
    
    def __init__(self):
        super().__init__()
        
        # Define supported formats
        self._input_formats = ["zip", "tar", "gz", "bz2", "xz", "7z", "rar"]
        self._output_formats = ["zip", "tar", "gz", "bz2", "xz", "7z"]
    
    async def convert(
        self, 
        file_path: str, 
        target_format: str,
        output_filename: Optional[str] = None
    ) -> str:
        """
        Convert a compressed file to the specified format.
        
        Args:
            file_path: Path to the file to convert
            target_format: Format to convert to
            output_filename: Optional custom filename for the output file
            
        Returns:
            Path to the converted file
        
        Raises:
            ValueError: If the input format or target format is not supported
            Exception: If the conversion fails
        """
        input_format = self._get_file_extension(file_path)
        self._validate_formats(input_format, target_format)
        
        output_path = self._generate_output_path(file_path, target_format, output_filename)
        
        # Create a temporary directory to extract files
        with tempfile.TemporaryDirectory() as temp_dir:
            # Extract the input file
            extract_dir = os.path.join(temp_dir, "extracted")
            os.makedirs(extract_dir, exist_ok=True)
            
            await self._extract_archive(file_path, extract_dir, input_format)
            
            # Create the output archive
            await self._create_archive(extract_dir, output_path, target_format)
        
        return output_path
    
    def get_supported_input_formats(self) -> List[str]:
        """Get a list of supported input formats"""
        return self._input_formats
    
    def get_supported_output_formats(self) -> List[str]:
        """Get a list of supported output formats"""
        return self._output_formats
    
    # Helper methods
    
    async def _extract_archive(self, archive_path: str, extract_dir: str, archive_format: str) -> None:
        """Extract an archive to a directory"""
        if archive_format == "zip":
            with zipfile.ZipFile(archive_path, 'r') as zip_ref:
                zip_ref.extractall(extract_dir)
        
        elif archive_format in ["tar", "gz", "bz2", "xz"]:
            # Handle tar and compressed tar formats
            mode = "r"
            if archive_format == "gz":
                mode = "r:gz"
            elif archive_format == "bz2":
                mode = "r:bz2"
            elif archive_format == "xz":
                mode = "r:xz"
            
            with tarfile.open(archive_path, mode) as tar_ref:
                tar_ref.extractall(extract_dir)
        
        elif archive_format == "7z":
            try:
                import py7zr
                
                with py7zr.SevenZipFile(archive_path, mode='r') as z:
                    z.extractall(extract_dir)
            
            except ImportError:
                raise Exception("py7zr library is required for 7z extraction")
        
        elif archive_format == "rar":
            try:
                import rarfile
                
                with rarfile.RarFile(archive_path) as rf:
                    rf.extractall(extract_dir)
            
            except ImportError:
                raise Exception("rarfile library is required for RAR extraction")
        
        else:
            raise ValueError(f"Unsupported archive format for extraction: {archive_format}")
    
    async def _create_archive(self, source_dir: str, archive_path: str, archive_format: str) -> None:
        """Create an archive from a directory"""
        if archive_format == "zip":
            with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as zip_ref:
                for root, _, files in os.walk(source_dir):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arcname = os.path.relpath(file_path, source_dir)
                        zip_ref.write(file_path, arcname)
        
        elif archive_format == "tar":
            with tarfile.open(archive_path, "w") as tar_ref:
                for root, _, files in os.walk(source_dir):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arcname = os.path.relpath(file_path, source_dir)
                        tar_ref.add(file_path, arcname=arcname)
        
        elif archive_format == "gz":
            with tarfile.open(archive_path, "w:gz") as tar_ref:
                for root, _, files in os.walk(source_dir):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arcname = os.path.relpath(file_path, source_dir)
                        tar_ref.add(file_path, arcname=arcname)
        
        elif archive_format == "bz2":
            with tarfile.open(archive_path, "w:bz2") as tar_ref:
                for root, _, files in os.walk(source_dir):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arcname = os.path.relpath(file_path, source_dir)
                        tar_ref.add(file_path, arcname=arcname)
        
        elif archive_format == "xz":
            with tarfile.open(archive_path, "w:xz") as tar_ref:
                for root, _, files in os.walk(source_dir):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arcname = os.path.relpath(file_path, source_dir)
                        tar_ref.add(file_path, arcname=arcname)
        
        elif archive_format == "7z":
            try:
                import py7zr
                
                with py7zr.SevenZipFile(archive_path, 'w') as z:
                    for root, _, files in os.walk(source_dir):
                        for file in files:
                            file_path = os.path.join(root, file)
                            arcname = os.path.relpath(file_path, source_dir)
                            z.write(file_path, arcname)
            
            except ImportError:
                raise Exception("py7zr library is required for 7z creation")
        
        else:
            raise ValueError(f"Unsupported archive format for creation: {archive_format}") 