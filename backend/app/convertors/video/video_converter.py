import os
import asyncio
import subprocess
from typing import List, Optional

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
                await self._convert_with_moviepy(file_path, output_path, target_format)
        except Exception as e:
            # Fallback to direct ffmpeg if moviepy fails
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
    
    async def _convert_with_moviepy(self, input_path: str, output_path: str, target_format: str) -> None:
        """Convert video using moviepy"""
        try:
            from moviepy.editor import VideoFileClip
            
            # Load the video file
            video = VideoFileClip(input_path)
            
            # Set export parameters based on target format
            if target_format == "mp4":
                video.write_videofile(output_path, codec="libx264", audio_codec="aac")
            elif target_format == "webm":
                video.write_videofile(output_path, codec="libvpx", audio_codec="libvorbis")
            elif target_format == "avi":
                video.write_videofile(output_path, codec="rawvideo", audio_codec="pcm_s16le")
            elif target_format == "mov":
                video.write_videofile(output_path, codec="libx264", audio_codec="aac")
            elif target_format == "mkv":
                video.write_videofile(output_path, codec="libx264", audio_codec="libvorbis")
            else:
                # Default settings
                video.write_videofile(output_path)
            
            # Close the video file
            video.close()
        
        except ImportError:
            raise Exception("moviepy library is required for video conversion")
    
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
    
    async def _convert_with_ffmpeg(self, input_path: str, output_path: str, target_format: str) -> None:
        """Convert video using ffmpeg directly"""
        try:
            # Set ffmpeg parameters based on target format
            ffmpeg_params = ["-i", input_path, "-y"]
            
            if target_format == "mp4":
                ffmpeg_params.extend(["-c:v", "libx264", "-c:a", "aac", "-strict", "experimental"])
            elif target_format == "webm":
                ffmpeg_params.extend(["-c:v", "libvpx", "-c:a", "libvorbis"])
            elif target_format == "avi":
                ffmpeg_params.extend(["-c:v", "rawvideo", "-c:a", "pcm_s16le"])
            elif target_format == "mov":
                ffmpeg_params.extend(["-c:v", "libx264", "-c:a", "aac", "-strict", "experimental"])
            elif target_format == "mkv":
                ffmpeg_params.extend(["-c:v", "libx264", "-c:a", "libvorbis"])
            elif target_format == "gif":
                ffmpeg_params.extend([
                    "-vf", "fps=10,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse"
                ])
            
            ffmpeg_params.append(output_path)
            
            # Run ffmpeg command
            process = await asyncio.create_subprocess_exec(
                "ffmpeg",
                *ffmpeg_params,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                raise Exception(f"FFmpeg error: {stderr.decode()}")
        
        except (FileNotFoundError, subprocess.SubprocessError):
            raise Exception("FFmpeg is required for video conversion") 