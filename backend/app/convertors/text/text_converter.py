import os
import asyncio
from typing import List, Optional
import aiofiles
import hashlib
from functools import lru_cache

from app.utils.base_converter import BaseConverter

class TextConverter(BaseConverter):
    """
    Converter for text file formats.
    Supports conversions between various text formats like txt, md, html, etc.
    """
    
    def __init__(self):
        super().__init__()
        
        # Define supported formats
        self._input_formats = ["txt", "md", "html", "xml", "json", "csv", "yaml", "yml"]
        self._output_formats = ["txt", "md", "html", "xml", "json", "csv", "yaml", "yml", "pdf"]
    
    async def convert(
        self, 
        file_path: str, 
        target_format: str,
        output_filename: Optional[str] = None
    ) -> str:
        """
        Convert a text file to the specified format.
        
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
        
        # Read the input file asynchronously
        async with aiofiles.open(file_path, "r", encoding="utf-8") as f:
            content = await f.read()
        
        # Check cache before conversion
        cache_key = self._generate_cache_key(content, target_format)
        cached_result = self._get_cached_result(cache_key)
        if cached_result:
            return cached_result
        
        # Perform the conversion based on input and output formats
        converted_content = self._perform_conversion(content, input_format, target_format)
        
        # Write the output file asynchronously
        async with aiofiles.open(output_path, "w", encoding="utf-8") as f:
            await f.write(converted_content)
        
        # Cache the result
        self._cache_result(cache_key, output_path)
        
        return output_path
    
    def get_supported_input_formats(self) -> List[str]:
        """Get a list of supported input formats"""
        return self._input_formats
    
    def get_supported_output_formats(self) -> List[str]:
        """Get a list of supported output formats"""
        return self._output_formats
    
    # Conversion methods
    
    def _txt_to_html(self, content: str) -> str:
        """Convert plain text to HTML"""
        # Use a more efficient approach to replace newlines and wrap in HTML structure
        html_content = content.replace("\n", "<br>\n")
        return f"""<!DOCTYPE html>
<html>
<head>
    <title>Converted Text</title>
</head>
<body>
    <p>{html_content}</p>
</body>
</html>"""
    
    def _md_to_html(self, content: str) -> str:
        """Convert Markdown to HTML"""
        try:
            import mistune  # Consider using mistune for better performance
            markdown = mistune.create_markdown()
            return markdown(content)
        except ImportError:
            # Fallback to basic conversion if mistune package is not available
            return self._txt_to_html(content)
    
    def _md_to_txt(self, content: str) -> str:
        """Convert Markdown to plain text"""
        # Simple markdown to text conversion (remove markdown syntax)
        # This is a basic implementation and doesn't handle all markdown features
        import re
        
        # Remove headers
        content = re.sub(r'^#+\s+', '', content, flags=re.MULTILINE)
        
        # Remove bold/italic
        content = re.sub(r'\*\*(.*?)\*\*', r'\1', content)
        content = re.sub(r'\*(.*?)\*', r'\1', content)
        content = re.sub(r'__(.*?)__', r'\1', content)
        content = re.sub(r'_(.*?)_', r'\1', content)
        
        # Remove links
        content = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', content)
        
        # Remove images
        content = re.sub(r'!\[(.*?)\]\(.*?\)', r'\1', content)
        
        # Remove blockquotes
        content = re.sub(r'^>\s+', '', content, flags=re.MULTILINE)
        
        return content
    
    def _html_to_txt(self, content: str) -> str:
        """Convert HTML to plain text"""
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(content, 'html.parser')
            return soup.get_text()
        except ImportError:
            # Fallback to basic conversion if BeautifulSoup is not available
            import re
            # Remove HTML tags
            text = re.sub(r'<[^>]*>', '', content)
            # Replace HTML entities
            text = text.replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&')
            return text
    
    def _html_to_md(self, content: str) -> str:
        """Convert HTML to Markdown"""
        try:
            import html2text
            h = html2text.HTML2Text()
            h.ignore_links = False
            return h.handle(content)
        except ImportError:
            # Fallback to basic conversion if html2text is not available
            return self._html_to_txt(content)
    
    def _csv_to_json(self, content: str) -> str:
        """Convert CSV to JSON"""
        import csv
        import json
        import io
        
        result = []
        csv_file = io.StringIO(content)
        csv_reader = csv.DictReader(csv_file)
        
        for row in csv_reader:
            result.append(dict(row))
        
        return json.dumps(result, indent=4)
    
    def _json_to_csv(self, content: str) -> str:
        """Convert JSON to CSV"""
        import json
        import csv
        import io
        
        data = json.loads(content)
        output = io.StringIO()
        
        if isinstance(data, list) and len(data) > 0:
            # Get field names from the first item
            fieldnames = data[0].keys()
            
            writer = csv.DictWriter(output, fieldnames=fieldnames)
            writer.writeheader()
            
            for item in data:
                writer.writerow(item)
        
        return output.getvalue()
    
    def _json_to_yaml(self, content: str) -> str:
        """Convert JSON to YAML"""
        import json
        import yaml
        
        data = json.loads(content)
        return yaml.dump(data, default_flow_style=False)
    
    def _yaml_to_json(self, content: str) -> str:
        """Convert YAML to JSON"""
        import yaml
        import json
        
        data = yaml.safe_load(content)
        return json.dumps(data, indent=4)
    
    def _xml_to_json(self, content: str) -> str:
        """Convert XML to JSON"""
        import xmltodict
        import json
        
        data = xmltodict.parse(content)
        return json.dumps(data, indent=4)
    
    def _json_to_xml(self, content: str) -> str:
        """Convert JSON to XML"""
        import json
        import dicttoxml
        from xml.dom.minidom import parseString
        
        # Parse JSON
        json_data = json.loads(content)
        
        # Convert to XML
        xml_data = dicttoxml.dicttoxml(json_data)
        
        # Pretty print XML
        dom = parseString(xml_data)
        return dom.toprettyxml()
    
    async def _convert_to_pdf(self, content: str, output_path: str) -> str:
        """Convert text content to PDF"""
        try:
            from reportlab.pdfgen import canvas
            from reportlab.lib.pagesizes import letter
            from reportlab.lib.styles import getSampleStyleSheet
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
            from reportlab.lib.units import inch
            import html
            
            # Create a PDF document
            doc = SimpleDocTemplate(
                output_path,
                pagesize=letter,
                rightMargin=72,
                leftMargin=72,
                topMargin=72,
                bottomMargin=72
            )
            
            # Define styles
            styles = getSampleStyleSheet()
            normal_style = styles['Normal']
            
            # Process the text content
            content_elements = []
            
            # Split text into paragraphs
            paragraphs = content.split('\n\n')
            
            for paragraph in paragraphs:
                if paragraph.strip():
                    # Replace single newlines with spaces within paragraphs
                    paragraph = paragraph.replace('\n', ' ')
                    # Escape any HTML-like characters to prevent rendering issues
                    paragraph = html.escape(paragraph)
                    p = Paragraph(paragraph, normal_style)
                    content_elements.append(p)
                    content_elements.append(Spacer(1, 0.2 * inch))
            
            # Build the PDF
            doc.build(content_elements)
            
            return output_path
        except Exception as e:
            raise Exception(f"Error in text to PDF conversion: {str(e)}")

    def _generate_cache_key(self, content: str, target_format: str) -> str:
        # Generate a unique cache key based on content and target format
        return hashlib.md5((content + target_format).encode()).hexdigest()

    @lru_cache(maxsize=128)
    def _get_cached_result(self, cache_key: str) -> Optional[str]:
        # Retrieve cached result if available
        return None  # Placeholder for actual cache retrieval logic

    def _cache_result(self, cache_key: str, output_path: str):
        # Cache the conversion result
        pass  # Placeholder for actual cache storage logic

    def _perform_conversion(self, content: str, input_format: str, target_format: str) -> str:
        # Perform the conversion based on input and output formats
        # This is a placeholder for the actual conversion logic
        return content  # Replace with actual conversion logic 