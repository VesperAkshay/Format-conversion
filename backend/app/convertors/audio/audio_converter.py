import os
import asyncio
import subprocess
from typing import List, Optional
import aiofiles

from app.utils.base_converter import BaseConverter

class AudioConverter(BaseConverter):
    """
    Converter for audio file formats.
    Supports conversions between various audio formats like mp3, wav, ogg, etc.
    """
    
    def __init__(self):
        super().__init__()
        
        # Define supported formats
        self._input_formats = ["mp3", "wav", "ogg", "flac", "aac", "m4a", "wma", "aiff"]
        self._output_formats = ["mp3", "wav", "ogg", "flac", "aac", "m4a"]
    
    async def convert(
        self, 
        file_path: str, 
        target_format: str,
        output_filename: Optional[str] = None
    ) -> str:
        """
        Convert an audio file to the specified format.
        
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
        
        # Try to use pydub for conversion (which uses ffmpeg under the hood)
        try:
            await self._convert_with_pydub(file_path, output_path, target_format)
        except Exception as e:
            # Fallback to direct ffmpeg if pydub fails
            try:
                await self._convert_with_ffmpeg(file_path, output_path, target_format)
            except Exception as ffmpeg_error:
                raise Exception(f"Audio conversion failed: {str(e)}. FFmpeg fallback also failed: {str(ffmpeg_error)}")
        
        return output_path
    
    def get_supported_input_formats(self) -> List[str]:
        """Get a list of supported input formats"""
        return self._input_formats
    
    def get_supported_output_formats(self) -> List[str]:
        """Get a list of supported output formats"""
        return self._output_formats
    
    # Helper methods
    
    async def _convert_with_pydub(self, file_path: str, output_path: str, target_format: str):
        """Convert audio using pydub and ffmpeg"""
        from pydub import AudioSegment
        
        # Load the audio file
        audio = AudioSegment.from_file(file_path)
        
        # Export the audio file to the target format
        async with aiofiles.open(output_path, "wb") as f:
            audio.export(f, format=target_format)
    
    async def _convert_with_ffmpeg(self, file_path: str, output_path: str, target_format: str):
        """Convert audio using ffmpeg directly"""
        command = [
            "ffmpeg",
            "-i", file_path,
            output_path
        ]
        process = await asyncio.create_subprocess_exec(*command)
        await process.communicate() 