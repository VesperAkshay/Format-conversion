import os
import hashlib
import aiofiles
import asyncio
import time
from typing import Dict, List, Optional, Tuple, Any
from functools import lru_cache
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

# Import all converters
from app.convertors.text.text_converter import TextConverter
from app.convertors.document.document_converter import DocumentConverter
from app.convertors.image.image_converter import ImageConverter
from app.convertors.audio.audio_converter import AudioConverter
from app.convertors.video.video_converter import VideoConverter
from app.convertors.compressed.compressed_converter import CompressedConverter

class ConversionHandler:
    """
    Handler for managing all file conversion operations.
    Acts as a facade for the different converter implementations.
    """
    
    def __init__(self):
        """Initialize all converters"""
        self.converters = {
            "text": TextConverter(),
            "document": DocumentConverter(),
            "image": ImageConverter(),
            "audio": AudioConverter(),
            "video": VideoConverter(),
            "compressed": CompressedConverter()
        }
        
        # Create output directory if it doesn't exist
        os.makedirs("outputs", exist_ok=True)
        
        # Initialize cache
        self._cache = {}
        self._max_cache_size = 100  # Maximum number of cached conversions
        
        # Create a semaphore to limit concurrent conversions
        self._semaphore = asyncio.Semaphore(10)  # Allow up to 10 concurrent conversions
    
    async def convert_file(
        self, 
        file_path: str, 
        target_format: str, 
        conversion_type: str,
        output_filename: Optional[str] = None
    ) -> str:
        """
        Convert a file to the specified format using the appropriate converter.
        
        Args:
            file_path: Path to the file to convert
            target_format: Format to convert to
            conversion_type: Type of conversion (text, document, image, etc.)
            output_filename: Optional custom filename for the output file
            
        Returns:
            Path to the converted file
        
        Raises:
            ValueError: If the conversion type is not supported
            Exception: If the conversion fails
        """
        # Use a semaphore to limit concurrent conversions
        async with self._semaphore:
            start_time = time.time()
            
            if conversion_type not in self.converters:
                raise ValueError(f"Unsupported conversion type: {conversion_type}")
            
            # Generate cache key
            cache_key = await self._generate_cache_key(file_path, target_format, conversion_type)
            
            # Check if result is in cache
            cached_result = self._get_cached_result(cache_key)
            if cached_result:
                print(f"Cache hit for {os.path.basename(file_path)} -> {target_format}")
                return cached_result
            
            print(f"Converting {os.path.basename(file_path)} to {target_format} ({conversion_type})")
            
            # Special case handling for text to PDF conversion
            # This can be handled by either the text converter or document converter
            input_format = os.path.splitext(file_path)[1][1:].lower()
            if conversion_type == "text" and target_format == "pdf":
                # Use document converter for PDF output
                converter = self.converters["document"]
            else:
                converter = self.converters[conversion_type]
            
            # Perform the conversion
            output_path = await converter.convert(
                file_path=file_path,
                target_format=target_format,
                output_filename=output_filename
            )
            
            # Cache the result
            self._cache_result(cache_key, output_path)
            
            end_time = time.time()
            print(f"Conversion of {os.path.basename(file_path)} completed in {end_time - start_time:.2f} seconds")
            
            return output_path
    
    def get_supported_formats(self) -> Dict[str, Dict[str, List[str]]]:
        """
        Get a dictionary of supported input and output formats for each conversion type.
        
        Returns:
            Dictionary with conversion types as keys and dictionaries of input/output formats as values
        """
        supported_formats = {}
        
        for conversion_type, converter in self.converters.items():
            supported_formats[conversion_type] = {
                "input_formats": converter.get_supported_input_formats(),
                "output_formats": converter.get_supported_output_formats()
            }
        
        return supported_formats
        
    async def _generate_cache_key(self, file_path: str, target_format: str, conversion_type: str) -> str:
        """Generate a unique cache key based on file content and conversion parameters"""
        # Read file content for hashing
        async with aiofiles.open(file_path, "rb") as f:
            # Read first 1MB of file for hash to avoid reading large files entirely
            content = await f.read(1024 * 1024)
            
        # Create hash from file content and conversion parameters
        hash_obj = hashlib.md5()
        hash_obj.update(content)
        hash_obj.update(target_format.encode())
        hash_obj.update(conversion_type.encode())
        
        return hash_obj.hexdigest()
        
    def _get_cached_result(self, cache_key: str) -> Optional[str]:
        """Get cached conversion result if available"""
        return self._cache.get(cache_key)
        
    def _cache_result(self, cache_key: str, output_path: str) -> None:
        """Cache conversion result"""
        # Implement LRU cache behavior manually
        if len(self._cache) >= self._max_cache_size:
            # Remove oldest item (first key)
            oldest_key = next(iter(self._cache))
            del self._cache[oldest_key]
            
        self._cache[cache_key] = output_path 