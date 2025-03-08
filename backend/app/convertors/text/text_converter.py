import os
import asyncio
from typing import List, Optional

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
        self._output_formats = ["txt", "md", "html", "xml", "json", "csv", "yaml", "yml"]
    
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
        
        # Read the input file
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Perform the conversion based on input and output formats
        if input_format == "txt" and target_format == "html":
            converted_content = self._txt_to_html(content)
        elif input_format == "txt" and target_format == "md":
            converted_content = content  # Simple text can be used as markdown
        elif input_format == "md" and target_format == "html":
            converted_content = self._md_to_html(content)
        elif input_format == "md" and target_format == "txt":
            converted_content = self._md_to_txt(content)
        elif input_format == "html" and target_format == "txt":
            converted_content = self._html_to_txt(content)
        elif input_format == "html" and target_format == "md":
            converted_content = self._html_to_md(content)
        elif input_format == "csv" and target_format == "json":
            converted_content = self._csv_to_json(content)
        elif input_format == "json" and target_format == "csv":
            converted_content = self._json_to_csv(content)
        elif input_format == "json" and target_format == "yaml":
            converted_content = self._json_to_yaml(content)
        elif input_format == "yaml" and target_format == "json":
            converted_content = self._yaml_to_json(content)
        elif input_format == "xml" and target_format == "json":
            converted_content = self._xml_to_json(content)
        elif input_format == "json" and target_format == "xml":
            converted_content = self._json_to_xml(content)
        else:
            # For simple format conversions, just copy the content
            converted_content = content
        
        # Write the output file
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(converted_content)
        
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
        # Replace newlines with <br> tags and wrap in HTML structure
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
            import markdown
            return markdown.markdown(content)
        except ImportError:
            # Fallback to basic conversion if markdown package is not available
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
        
        data = json.loads(content)
        xml = dicttoxml.dicttoxml(data)
        dom = parseString(xml)
        return dom.toprettyxml() 