import os
import asyncio
import subprocess
from typing import List, Optional
import aiofiles
from concurrent.futures import ThreadPoolExecutor

from app.utils.base_converter import BaseConverter

class VideoConverter(BaseConverter):
    """
    Converter for video file formats.
    Supports conversions between various video formats like mp4, avi, mkv, etc.
    """
    
    def __init__(self):
        super().__init__()
        
        # Define supported formats
        self._input_formats = ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm", "m4v", "3gp"]
        self._output_formats = ["mp4", "avi", "mkv", "mov", "webm", "gif"]
    
    async def convert(
        self, 
        file_path: str, 
        target_format: str,
        output_filename: Optional[str] = None
    ) -> str:
        """
        Convert a video file to the specified format.
        
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
        
        # Try to use moviepy for conversion
        try:
            if target_format == "gif":
                await self._convert_to_gif(file_path, output_path)
            else:
                # Run the video conversion in a thread pool to avoid blocking
                with ThreadPoolExecutor() as executor:
                    await asyncio.get_event_loop().run_in_executor(
                        executor, self._convert_with_moviepy, file_path, output_path, target_format
                    )
        except Exception as e:
            # Fallback to ffmpeg if moviepy fails
            try:
                await self._convert_with_ffmpeg(file_path, output_path, target_format)
            except Exception as ffmpeg_error:
                raise Exception(f"Video conversion failed: {str(e)}. FFmpeg fallback also failed: {str(ffmpeg_error)}")
        
        return output_path
    
    def get_supported_input_formats(self) -> List[str]:
        """Get a list of supported input formats"""
        return self._input_formats
    
    def get_supported_output_formats(self) -> List[str]:
        """Get a list of supported output formats"""
        return self._output_formats
    
    # Helper methods
    
    async def _convert_with_moviepy(self, file_path: str, output_path: str, target_format: str) -> None:
        """Convert video using moviepy (efficient non-blocking implementation)"""
        from moviepy.editor import VideoFileClip
        
        # Optimize conversion parameters based on format
        codec = None
        if target_format == "mp4":
            codec = "libx264"
        elif target_format == "webm":
            codec = "libvpx"
        
        # Load and convert the video
        with VideoFileClip(file_path) as clip:
            clip.write_videofile(
                output_path,
                codec=codec,
                threads=4,  # Use multiple threads for encoding
                preset='medium',  # Balance between speed and quality
                audio_codec='aac' if target_format == 'mp4' else 'libvorbis'
            )
            
    async def _convert_to_gif(self, input_path: str, output_path: str) -> None:
        """Convert video to GIF using moviepy"""
        try:
            from moviepy.editor import VideoFileClip
            
            # Load the video file
            video = VideoFileClip(input_path)
            
            # Resize the video to reduce file size (optional)
            # video = video.resize(width=480)
            
            # Convert to GIF
            video.write_gif(output_path, fps=10)
            
            # Close the video file
            video.close()
        
        except ImportError:
            raise Exception("moviepy library is required for video to GIF conversion")
    
    async def _convert_with_ffmpeg(self, file_path: str, output_path: str, target_format: str) -> None:
        """Convert video using ffmpeg directly (optimized version)"""
        # Optimize ffmpeg parameters based on format
        extra_args = []
        if target_format == "mp4":
            extra_args = ["-c:v", "libx264", "-preset", "medium", "-crf", "23", "-c:a", "aac", "-b:a", "128k"]
        elif target_format == "webm":
            extra_args = ["-c:v", "libvpx", "-crf", "10", "-b:v", "1M", "-c:a", "libvorbis"]
        elif target_format == "avi":
            extra_args = ["-c:v", "mpeg4", "-q:v", "6", "-c:a", "libmp3lame", "-q:a", "4"]
            
        command = [
            "ffmpeg",
            "-i", file_path,
            "-y",  # Overwrite output file if it exists
            *extra_args,
            output_path
        ]
        
        process = await asyncio.create_subprocess_exec(
            *command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        await process.communicate() 