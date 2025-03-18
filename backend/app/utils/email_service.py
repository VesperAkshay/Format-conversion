import os
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileName, FileType, Disposition
import base64
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class EmailService:
    """Service for sending emails using SendGrid."""
    
    def __init__(self):
        self.api_key = os.getenv('SENDGRID_API_KEY')
        self.from_email = os.getenv('SENDGRID_FROM_EMAIL', 'noreply@formatconversion.com')
        
    async def send_file_sharing_email(self, recipient_email, file_path, file_name, sender_message=None):
        """
        Send an email with the converted file as an attachment.
        
        Args:
            recipient_email (str): Email address of the recipient
            file_path (str): Path to the file to be attached
            file_name (str): Name of the file
            sender_message (str, optional): Optional message from the sender
            
        Returns:
            dict: Response from SendGrid API
        """
        try:
            # Check if file exists
            if not Path(file_path).exists():
                logger.error(f"File not found: {file_path}")
                return {"success": False, "message": "File not found"}
            
            # Get file extension for better subject line
            file_extension = file_name.split('.')[-1].upper()
            
            # Create message with improved subject line
            message = Mail(
                from_email=self.from_email,
                to_emails=recipient_email,
                subject=f"Your {file_extension} File is Ready | Format Converter",
                html_content=self._create_email_content(file_name, sender_message)
            )
            
            # Attach file
            with open(file_path, 'rb') as f:
                file_content = f.read()
                
            encoded_file = base64.b64encode(file_content).decode()
            
            attachment = Attachment()
            attachment.file_content = FileContent(encoded_file)
            attachment.file_name = FileName(file_name)
            attachment.file_type = FileType(self._get_mime_type(file_name))
            attachment.disposition = Disposition('attachment')
            
            message.attachment = attachment
            
            # Send email
            sg = SendGridAPIClient(self.api_key)
            response = sg.send(message)
            
            logger.info(f"Email sent to {recipient_email} with status code {response.status_code}")
            
            return {
                "success": response.status_code in [200, 201, 202],
                "status_code": response.status_code,
                "message": "Email sent successfully" if response.status_code in [200, 201, 202] else "Failed to send email"
            }
            
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return {"success": False, "message": str(e)}
    
    def _create_email_content(self, file_name, sender_message=None):
        """Create the HTML content for the email."""
        # Get file extension for icon display
        file_extension = file_name.split('.')[-1].upper()
        
        # Get file icon and color based on file type
        icon_html, icon_color = self._get_file_icon_html(file_extension)
        
        # Get current year for copyright
        current_year = datetime.now().year
        
        content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Format Converter - Shared File</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                * {{
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }}
                
                body {{
                    font-family: 'Inter', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f5f7fa;
                    -webkit-font-smoothing: antialiased;
                }}
                
                .email-wrapper {{
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    margin-top: 20px;
                    margin-bottom: 20px;
                    border: 1px solid #e5e7eb;
                }}
                
                .email-header {{
                    background: linear-gradient(135deg, #3a86ff 0%, #0052cc 100%);
                    padding: 30px 20px;
                    text-align: center;
                }}
                
                .logo {{
                    font-size: 24px;
                    font-weight: 700;
                    color: white;
                    text-decoration: none;
                    letter-spacing: -0.5px;
                }}
                
                .logo-highlight {{
                    color: #f0f4ff;
                }}
                
                .email-body {{
                    padding: 30px 25px;
                }}
                
                .greeting {{
                    font-size: 20px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 15px;
                }}
                
                .message-text {{
                    color: #4b5563;
                    font-size: 16px;
                    margin-bottom: 25px;
                }}
                
                .file-card {{
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 25px;
                    background-color: #f9fafb;
                    display: flex;
                    align-items: center;
                }}
                
                .file-icon {{
                    width: 48px;
                    height: 48px;
                    background-color: {icon_color};
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 15px;
                    color: white;
                    font-size: 14px;
                }}
                
                .file-details {{
                    flex: 1;
                }}
                
                .file-name {{
                    font-weight: 600;
                    color: #111827;
                    font-size: 16px;
                    margin-bottom: 5px;
                    word-break: break-all;
                }}
                
                .file-meta {{
                    font-size: 14px;
                    color: #6b7280;
                }}
                
                .sender-message {{
                    background-color: #f3f4f6;
                    border-left: 4px solid #3a86ff;
                    padding: 15px;
                    border-radius: 4px;
                    margin-bottom: 25px;
                }}
                
                .sender-message-title {{
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 8px;
                    font-size: 15px;
                }}
                
                .sender-message-content {{
                    color: #4b5563;
                    font-size: 15px;
                    white-space: pre-line;
                }}
                
                .divider {{
                    height: 1px;
                    background-color: #e5e7eb;
                    margin: 25px 0;
                }}
                
                .email-footer {{
                    padding: 20px 25px;
                    background-color: #f9fafb;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                }}
                
                .footer-text {{
                    font-size: 13px;
                    color: #6b7280;
                    margin-bottom: 10px;
                }}
                
                .copyright {{
                    font-size: 12px;
                    color: #9ca3af;
                }}
                
                @media only screen and (max-width: 600px) {{
                    .email-wrapper {{
                        width: 100%;
                        border-radius: 0;
                        margin-top: 0;
                        margin-bottom: 0;
                    }}
                    
                    .email-body {{
                        padding: 20px 15px;
                    }}
                }}
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <div class="email-header">
                    <div class="logo">Format <span class="logo-highlight">Converter</span></div>
                </div>
                
                <div class="email-body">
                    <h1 class="greeting">File Shared With You</h1>
                    
                    <p class="message-text">
                        Someone has shared a converted file with you using Format Converter.
                        The file is attached to this email for your convenience.
                    </p>
                    
                    <div class="file-card">
                        <div class="file-icon">
                            {icon_html}
                        </div>
                        <div class="file-details">
                            <div class="file-name">{file_name}</div>
                            <div class="file-meta">Converted file • Click attachment to download</div>
                        </div>
                    </div>
                    
                    {f'''
                    <div class="sender-message">
                        <div class="sender-message-title">Message from sender:</div>
                        <div class="sender-message-content">{sender_message}</div>
                    </div>
                    ''' if sender_message else ''}
                    
                    <div class="divider"></div>
                    
                    <p class="message-text">
                        Thank you for using Format Converter! If you need to convert files yourself,
                        visit our website to access our free conversion tools.
                    </p>
                </div>
                
                <div class="email-footer">
                    <p class="footer-text">
                        This is an automated message. Please do not reply to this email.
                    </p>
                    <p class="copyright">
                        &copy; {current_year} Format Converter. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        return content
    
    def _get_file_icon_html(self, file_extension):
        """
        Generate HTML for file icon based on file type.
        
        Args:
            file_extension (str): File extension (e.g., 'PDF', 'DOCX')
            
        Returns:
            tuple: (icon_html, icon_color)
        """
        # Default icon and color
        icon_html = file_extension
        icon_color = "#3a86ff"  # Default blue
        
        # Map file extensions to colors and icons
        file_types = {
            # Documents
            'PDF': ("#f05252", "PDF"),
            'DOC': ("#3b82f6", "DOC"),
            'DOCX': ("#3b82f6", "DOCX"),
            'TXT': ("#6b7280", "TXT"),
            'RTF': ("#8b5cf6", "RTF"),
            'ODT': ("#3b82f6", "ODT"),
            'PAGES': ("#3b82f6", "PAGES"),
            
            # Spreadsheets
            'XLS': ("#10b981", "XLS"),
            'XLSX': ("#10b981", "XLSX"),
            'CSV': ("#10b981", "CSV"),
            'ODS': ("#10b981", "ODS"),
            'NUMBERS': ("#10b981", "NUM"),
            
            # Presentations
            'PPT': ("#f97316", "PPT"),
            'PPTX': ("#f97316", "PPTX"),
            'ODP': ("#f97316", "ODP"),
            'KEY': ("#f97316", "KEY"),
            
            # Images
            'JPG': ("#8b5cf6", "IMG"),
            'JPEG': ("#8b5cf6", "IMG"),
            'PNG': ("#8b5cf6", "IMG"),
            'GIF': ("#8b5cf6", "GIF"),
            'SVG': ("#8b5cf6", "SVG"),
            'WEBP': ("#8b5cf6", "IMG"),
            'TIFF': ("#8b5cf6", "IMG"),
            'BMP': ("#8b5cf6", "IMG"),
            
            # Audio
            'MP3': ("#f59e0b", "MP3"),
            'WAV': ("#f59e0b", "WAV"),
            'OGG': ("#f59e0b", "OGG"),
            'AAC': ("#f59e0b", "AAC"),
            'FLAC': ("#f59e0b", "FLAC"),
            
            # Video
            'MP4': ("#ef4444", "MP4"),
            'AVI': ("#ef4444", "AVI"),
            'MOV': ("#ef4444", "MOV"),
            'WMV': ("#ef4444", "WMV"),
            'MKV': ("#ef4444", "MKV"),
            'WEBM': ("#ef4444", "WEBM"),
            
            # Archives
            'ZIP': ("#6b7280", "ZIP"),
            'RAR': ("#6b7280", "RAR"),
            '7Z': ("#6b7280", "7Z"),
            'TAR': ("#6b7280", "TAR"),
            'GZ': ("#6b7280", "GZ"),
            
            # Code
            'HTML': ("#0ea5e9", "HTML"),
            'CSS': ("#0ea5e9", "CSS"),
            'JS': ("#0ea5e9", "JS"),
            'JSON': ("#0ea5e9", "JSON"),
            'XML': ("#0ea5e9", "XML"),
            'PY': ("#0ea5e9", "PY"),
            'JAVA': ("#0ea5e9", "JAVA"),
            'PHP': ("#0ea5e9", "PHP"),
        }
        
        if file_extension in file_types:
            icon_color, icon_html = file_types[file_extension]
        
        return icon_html, icon_color
    
    def _get_mime_type(self, file_name):
        """Get the MIME type based on file extension."""
        extension = file_name.split('.')[-1].lower()
        mime_types = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'txt': 'text/plain',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'mp3': 'audio/mpeg',
            'wav': 'audio/wav',
            'mp4': 'video/mp4',
            'avi': 'video/x-msvideo',
            'zip': 'application/zip',
            'tar': 'application/x-tar',
            'gz': 'application/gzip',
            '7z': 'application/x-7z-compressed',
        }
        
        return mime_types.get(extension, 'application/octet-stream')

# Create a singleton instance
email_service = EmailService() 