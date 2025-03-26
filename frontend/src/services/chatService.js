import axios from 'axios';

const CHAT_API_URL = '/api/chat';

/**
 * Send a chat message to the Groq AI API
 * @param {Array} messages - Array of message objects with role and content
 * @param {Object} options - Additional options like temperature and max_tokens
 * @returns {Promise<Object>} Object containing the chat response
 */
export const sendChatMessage = async (messages, options = {}) => {
  try {
    const response = await axios.post(`${CHAT_API_URL}/completions`, {
      messages,
      ...options
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.detail || 'Failed to get AI response';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('Error setting up the chat request');
    }
  }
};

/**
 * Get a list of supported chat models
 * @returns {Promise<Array>} Array of supported model names
 */
export const getSupportedChatModels = async () => {
  try {
    const response = await axios.get(`${CHAT_API_URL}/models`);
    return response.data.models;
  } catch (error) {
    console.error('Error fetching supported chat models:', error);
    throw new Error('Failed to fetch supported chat models');
  }
}; 