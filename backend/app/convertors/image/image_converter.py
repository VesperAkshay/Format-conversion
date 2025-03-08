import os
import asyncio
from typing import List, Optional

from app.utils.base_converter import BaseConverter

class ImageConverter(BaseConverter):
    """
    Converter for image file formats.
    Supports conversions between various image formats like jpg, png, webp, etc.
    """
    
    def __init__(self):
        super().__init__()
        
        # Define supported formats
        self._input_formats = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp", "svg", "ico", "heic"]
        self._output_formats = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp", "ico", "pdf"]
    
    async def convert(
        self, 
        file_path: str, 
        target_format: str,
        output_filename: Optional[str] = None
    ) -> str:
        """
        Convert an image file to the specified format.
        
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
        
        # Normalize jpeg/jpg
        if input_format == "jpeg":
            input_format = "jpg"
        if target_format == "jpeg":
            target_format = "jpg"
        
        self._validate_formats(input_format, target_format)
        
        output_path = self._generate_output_path(file_path, target_format, output_filename)
        
        # Use Pillow for most image conversions
        try:
            from PIL import Image
            import io
            
            # Special handling for SVG to raster formats
            if input_format == "svg":
                await self._convert_svg_to_raster(file_path, output_path, target_format)
                return output_path
            
            # Special handling for HEIC format
            if input_format == "heic":
                await self._convert_heic(file_path, output_path, target_format)
                return output_path
            
            # Special handling for PDF output
            if target_format == "pdf":
                await self._convert_to_pdf(file_path, output_path)
                return output_path
            
            # Standard image conversion with Pillow
            with Image.open(file_path) as img:
                # Convert to RGB if saving as JPG (removes alpha channel)
                if target_format == "jpg" and img.mode in ("RGBA", "LA"):
                    background = Image.new("RGB", img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[3])  # 3 is the alpha channel
                    background.save(output_path, quality=95)
                else:
                    # For animated GIFs, preserve animation if possible
                    if input_format == "gif" and target_format == "gif":
                        img.save(output_path, save_all=True)
                    else:
                        img.save(output_path)
            
            return output_path
        
        except ImportError:
            raise Exception("Pillow library is required for image conversion")
        except Exception as e:
            raise Exception(f"Image conversion failed: {str(e)}")
    
    def get_supported_input_formats(self) -> List[str]:
        """Get a list of supported input formats"""
        return self._input_formats
    
    def get_supported_output_formats(self) -> List[str]:
        """Get a list of supported output formats"""
        return self._output_formats
    
    # Helper methods
    
    async def _convert_svg_to_raster(self, input_path: str, output_path: str, target_format: str) -> None:
        """Convert SVG to a raster format"""
        try:
            import cairosvg
            
            if target_format == "png":
                cairosvg.svg2png(url=input_path, write_to=output_path)
            elif target_format == "pdf":
                cairosvg.svg2pdf(url=input_path, write_to=output_path)
            else:
                # For other formats, convert to PNG first, then use Pillow
                temp_png = output_path.replace(f".{target_format}", ".png")
                cairosvg.svg2png(url=input_path, write_to=temp_png)
                
                from PIL import Image
                with Image.open(temp_png) as img:
                    img.save(output_path)
                
                # Clean up temporary file
                if os.path.exists(temp_png):
                    os.remove(temp_png)
        
        except ImportError:
            # Fallback using Inkscape if available
            try:
                import subprocess
                
                # Check if Inkscape is installed
                subprocess.run(["inkscape", "--version"], check=True, capture_output=True)
                
                # Use Inkscape for conversion
                subprocess.run([
                    "inkscape",
                    "--export-filename", output_path,
                    input_path
                ], check=True)
            
            except (ImportError, subprocess.SubprocessError):
                raise Exception("CairoSVG or Inkscape is required for SVG conversion")
    
    async def _convert_heic(self, input_path: str, output_path: str, target_format: str) -> None:
        """Convert HEIC to other formats"""
        try:
            # Try to use pyheif if available
            import pyheif  # type: ignore
            from PIL import Image
            
            # Read HEIC file
            heif_file = pyheif.read(input_path)
            
            # Convert to PIL Image
            image = Image.frombytes(
                heif_file.mode, 
                heif_file.size, 
                heif_file.data,
                "raw",
                heif_file.mode,
                heif_file.stride,
            )
            
            # Save to target format
            image.save(output_path)
        
        except ImportError:
            # Fallback to using external tools or alternative methods
            try:
                # Try using PIL's built-in HEIC support (if available in newer versions)
                from PIL import Image
                img = Image.open(input_path)
                img.save(output_path)
            except Exception:
                # If all else fails, try using ffmpeg
                try:
                    import subprocess
                    import os
                    
                    # Run ffmpeg command to convert HEIC to target format
                    subprocess.run([
                        "ffmpeg",
                        "-i", input_path,
                        "-y",  # Overwrite output file if it exists
                        output_path
                    ], check=True)
                    
                    if not os.path.exists(output_path):
                        raise Exception("FFmpeg conversion failed")
                        
                except (subprocess.SubprocessError, FileNotFoundError):
                    raise Exception("HEIC conversion requires pyheif, newer PIL version, or FFmpeg")
    
    async def _convert_to_pdf(self, input_path: str, output_path: str) -> None:
        """Convert image to PDF"""
        try:
            from PIL import Image
            from reportlab.pdfgen import canvas
            from reportlab.lib.pagesizes import letter
            
            # Open the image
            img = Image.open(input_path)
            
            # Get image dimensions
            width, height = img.size
            
            # Create a new PDF with ReportLab
            c = canvas.Canvas(output_path, pagesize=letter)
            
            # Calculate scaling to fit on the page
            page_width, page_height = letter
            scale = min(page_width / width, page_height / height) * 0.9
            
            # Calculate position to center the image
            x = (page_width - width * scale) / 2
            y = (page_height - height * scale) / 2
            
            # Draw the image on the PDF
            c.drawImage(input_path, x, y, width=width*scale, height=height*scale)
            
            # Save the PDF
            c.save()
        
        except ImportError:
            raise Exception("Pillow and reportlab libraries are required for image to PDF conversion") 