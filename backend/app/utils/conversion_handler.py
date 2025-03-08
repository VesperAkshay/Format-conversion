import os
from typing import Dict, List, Optional

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
        if conversion_type not in self.converters:
            raise ValueError(f"Unsupported conversion type: {conversion_type}")
        
        converter = self.converters[conversion_type]
        
        # Perform the conversion
        output_path = await converter.convert(
            file_path=file_path,
            target_format=target_format,
            output_filename=output_filename
        )
        
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