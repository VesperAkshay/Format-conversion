import os
import groq
from dotenv import load_dotenv
from typing import List, Dict, Optional, Any

# Load environment variables
load_dotenv()

# Get the Groq API key from environment variables
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class GroqService:
    """Service for interacting with the Groq API for chat completions"""
    
    def __init__(self):
        """Initialize the Groq client with API key"""
        if not GROQ_API_KEY:
            raise ValueError("Groq API key not found. Please set the GROQ_API_KEY environment variable.")
        
        # Create client without any additional parameters to avoid compatibility issues
        self.client = groq.Client(api_key=GROQ_API_KEY)
        self.model = "llama-3.3-70b-versatile"  # Using the requested model
    
    async def generate_chat_response(self, 
                               messages: List[Dict[str, str]], 
                               temperature: float = 0.7,
                               max_tokens: int = 1024) -> Dict[str, Any]:
        """
        Generate a response using the Groq chat completion API
        
        Args:
            messages: List of message dictionaries with 'role' and 'content' keys
            temperature: Controls randomness of the output (0.0 to 1.0)
            max_tokens: Maximum number of tokens to generate
            
        Returns:
            Response from the Groq API
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            return {
                "response": response.choices[0].message.content,
                "id": response.id,
                "model": response.model,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            }
        except Exception as e:
            # Log the error and return an error response
            print(f"Error generating chat response: {str(e)}")
            return {
                "error": str(e)
            }
    
    def get_supported_models(self) -> List[str]:
        """Return a list of supported Groq models"""
        return [
            "llama-3.3-70b-versatile",
            "llama3-70b-8192",
            "llama3-8b-8192",
            "mixtral-8x7b-32768",
            "gemma-7b-it"
        ] 