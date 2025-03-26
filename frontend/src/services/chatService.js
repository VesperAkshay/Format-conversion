import axios from 'axios';

// Constants for API URLs
const CHAT_API_URL = '/api/chat';

/**
 * Send a chat message to the Groq AI API
 * @param {Array} messages - Array of message objects with role and content
 * @param {Object} options - Options for the chat completion
 * @returns {Promise<Object>} The response from the API
 */
export const sendChatMessage = async (messages, options = {}) => {
  try {
    const response = await axios.post(`${CHAT_API_URL}/completions`, {
      messages,
      ...options
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in chat request:', error);
    
    if (error.response) {
      // The server responded with a status other than 200
      const errorMessage = error.response.data?.detail || 'An error occurred with the chat service';
      throw new Error(errorMessage);
    } else if (error.request) {
      // No response was received
      throw new Error('No response received from the chat service. Please try again later.');
    } else {
      // Error in setting up the request
      throw new Error('Error setting up the chat request');
    }
  }
};

/**
 * Convert a file through the chat interface
 * @param {File} file - The file to convert
 * @param {string} conversionType - The type of conversion (text, document, image, audio, video, compressed)
 * @param {string} targetFormat - The format to convert to
 * @param {string} userMessage - The user message that triggered the conversion
 * @returns {Promise<Object>} Object containing information about the converted file
 */
export const convertFileFromChat = async (file, conversionType, targetFormat, userMessage) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversion_type', conversionType);
    formData.append('target_format', targetFormat);
    formData.append('user_message', userMessage);
    
    // Add a longer timeout for large files
    const response = await axios.post(`${CHAT_API_URL}/convert`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes timeout
    });
    
    // Check if the response contains an error even if status is 200
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Conversion failed');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error converting file from chat:', error);
    
    // Create a more descriptive error message
    let errorMessage = 'File conversion failed';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = `Server error (${error.response.status})`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'The conversion request timed out. The file might be too large or the server is busy.';
      } else {
        errorMessage = 'No response from server. Please check your connection.';
      }
    } else if (error.message) {
      // Error with a message property
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Get a list of supported chat models from the Groq API
 * @returns {Promise<Array>} Array of supported chat models
 */
export const getSupportedChatModels = async () => {
  try {
    const response = await axios.get(`${CHAT_API_URL}/models`);
    return response.data.models || [];
  } catch (error) {
    console.error('Error fetching chat models:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.detail || 'Failed to fetch chat models';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('Error setting up the request for chat models');
    }
  }
}; 