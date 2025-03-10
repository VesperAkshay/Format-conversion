import os
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileName, FileType, Disposition
import base64
from dotenv import load_dotenv
from pathlib import Path

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
            
            # Create message
            message = Mail(
                from_email=self.from_email,
                to_emails=recipient_email,
                subject=f"Shared File: {file_name}",
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
        content = f"""
        <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #3a86ff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px; }}
                    .file-info {{ background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 15px 0; }}
                    .message {{ background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 15px 0; font-style: italic; }}
                    .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #6c757d; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>File Shared With You</h1>
                    </div>
                    <div class="content">
                        <p>Someone has shared a file with you using Format Converter.</p>
                        
                        <div class="file-info">
                            <p><strong>File Name:</strong> {file_name}</p>
                        </div>
                        
                        {f'<div class="message"><p><strong>Message:</strong> {sender_message}</p></div>' if sender_message else ''}
                        
                        <p>The file is attached to this email. You can download it directly.</p>
                        
                        <p>Thank you for using Format Converter!</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from Format Converter. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
        </html>
        """
        return content
    
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