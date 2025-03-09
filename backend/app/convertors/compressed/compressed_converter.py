import os
import zipfile
import tarfile
import shutil
import tempfile
import asyncio
from typing import List, Optional
import aiofiles
from concurrent.futures import ThreadPoolExecutor

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
            try:
                # Run the extraction in a thread pool to avoid blocking
                with ThreadPoolExecutor() as executor:
                    await asyncio.get_event_loop().run_in_executor(
                        executor, self._extract_archive, file_path, temp_dir, input_format
                    )
                
                # Create the output archive
                with ThreadPoolExecutor() as executor:
                    await asyncio.get_event_loop().run_in_executor(
                        executor, self._create_archive, temp_dir, output_path, target_format
                    )
                
                return output_path
            except Exception as e:
                raise Exception(f"Compression conversion failed: {str(e)}")
    
    def get_supported_input_formats(self) -> List[str]:
        """Get a list of supported input formats"""
        return self._input_formats
    
    def get_supported_output_formats(self) -> List[str]:
        """Get a list of supported output formats"""
        return self._output_formats
    
    # Helper methods
    
    def _extract_archive(self, file_path: str, extract_dir: str, format: str) -> None:
        """Extract an archive to a directory (efficient non-blocking implementation)"""
        if format == "zip":
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                zip_ref.extractall(extract_dir)
        elif format in ["tar", "gz", "bz2", "xz"]:
            mode = "r"
            if format == "gz":
                mode = "r:gz"
            elif format == "bz2":
                mode = "r:bz2"
            elif format == "xz":
                mode = "r:xz"
                
            with tarfile.open(file_path, mode) as tar_ref:
                tar_ref.extractall(extract_dir)
        elif format in ["7z", "rar"]:
            # Use py7zr for 7z files
            if format == "7z":
                import py7zr
                with py7zr.SevenZipFile(file_path, mode='r') as z:
                    z.extractall(extract_dir)
            # Use unrar for rar files
            elif format == "rar":
                import rarfile
                with rarfile.RarFile(file_path) as rf:
                    rf.extractall(extract_dir)
                    
    def _create_archive(self, source_dir: str, output_path: str, format: str) -> None:
        """Create an archive from a directory (efficient non-blocking implementation)"""
        if format == "zip":
            with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zip_ref:
                for root, _, files in os.walk(source_dir):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arcname = os.path.relpath(file_path, source_dir)
                        zip_ref.write(file_path, arcname)
        elif format in ["tar", "gz", "bz2", "xz"]:
            mode = "w"
            if format == "gz":
                mode = "w:gz"
            elif format == "bz2":
                mode = "w:bz2"
            elif format == "xz":
                mode = "w:xz"
                
            with tarfile.open(output_path, mode) as tar_ref:
                tar_ref.add(source_dir, arcname="")
        elif format == "7z":
            import py7zr
            with py7zr.SevenZipFile(output_path, mode='w') as z:
                z.writeall(source_dir, arcname="") 