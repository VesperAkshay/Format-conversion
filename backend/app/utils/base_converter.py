import os
from abc import ABC, abstractmethod
from typing import List, Optional

class BaseConverter(ABC):
    """
    Abstract base class for all file converters.
    Defines the common interface that all converters must implement.
    """
    
    def __init__(self):
        """Initialize the converter"""
        # Create output directory if it doesn't exist
        os.makedirs("outputs", exist_ok=True)
    
    @abstractmethod
    async def convert(
        self, 
        file_path: str, 
        target_format: str,
        output_filename: Optional[str] = None
    ) -> str:
        """
        Convert a file to the specified format.
        
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
        pass
    
    @abstractmethod
    def get_supported_input_formats(self) -> List[str]:
        """
        Get a list of supported input formats.
        
        Returns:
            List of supported input format extensions (without the dot)
        """
        pass
    
    @abstractmethod
    def get_supported_output_formats(self) -> List[str]:
        """
        Get a list of supported output formats.
        
        Returns:
            List of supported output format extensions (without the dot)
        """
        pass
    
    def _get_file_extension(self, file_path: str) -> str:
        """
        Get the extension of a file (without the dot).
        
        Args:
            file_path: Path to the file
            
        Returns:
            File extension (without the dot)
        """
        return os.path.splitext(file_path)[1][1:].lower()
    
    def _generate_output_path(
        self, 
        input_path: str, 
        target_format: str,
        output_filename: Optional[str] = None
    ) -> str:
        """
        Generate the output file path.
        
        Args:
            input_path: Path to the input file
            target_format: Target format extension (without the dot)
            output_filename: Optional custom filename for the output file
            
        Returns:
            Path to the output file
        """
        if output_filename:
            # Check if output_filename already contains a directory path
            if os.path.dirname(output_filename):
                # If it has a directory component, use it as is
                output_dir = os.path.dirname(output_filename)
                base_name = os.path.basename(output_filename)
                
                # Create the directory if it doesn't exist
                os.makedirs(output_dir, exist_ok=True)
                
                # Return the full path with the target format extension
                return os.path.join(output_dir, f"{base_name}.{target_format}")
            else:
                # If it's just a filename, use it with the default outputs directory
                base_name = output_filename
        else:
            # Use the input filename if no output filename is provided
            base_name = os.path.splitext(os.path.basename(input_path))[0]
        
        # Return the path in the outputs directory
        return os.path.join("outputs", f"{base_name}.{target_format}")
    
    def _validate_formats(self, input_format: str, target_format: str) -> None:
        """
        Validate that the input and target formats are supported.
        
        Args:
            input_format: Input file format
            target_format: Target file format
            
        Raises:
            ValueError: If the input format or target format is not supported
        """
        if input_format not in self.get_supported_input_formats():
            raise ValueError(f"Unsupported input format: {input_format}")
        
        if target_format not in self.get_supported_output_formats():
            raise ValueError(f"Unsupported output format: {target_format}")
        
        if input_format == target_format:
            raise ValueError(f"Input and output formats are the same: {input_format}") 