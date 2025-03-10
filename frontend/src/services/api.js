import axios from 'axios';

const API_URL = '/api/convert';

/**
 * Get supported formats for all conversion types
 * @returns {Promise<Object>} Object containing supported formats for each conversion type
 */
export const getSupportedFormats = async () => {
  try {
    const response = await axios.get(`${API_URL}/supported-formats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching supported formats:', error);
    throw new Error('Failed to fetch supported formats');
  }
};

/**
 * Convert a file to the specified format
 * @param {File} file - The file to convert
 * @param {string} targetFormat - The format to convert to
 * @param {string} conversionType - The type of conversion (text, document, image, audio, video, compressed)
 * @returns {Promise<Object>} Object containing information about the converted file
 */
export const convertFile = async (file, targetFormat, conversionType) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_format', targetFormat);
    formData.append('conversion_type', conversionType);

    const response = await axios.post(`${API_URL}/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error converting file:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.detail || 'File conversion failed';
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up the conversion request');
    }
  }
};

/**
 * Download a converted file
 * @param {string} filename - The name of the file to download
 * @returns {string} The URL to download the file
 */
export const getDownloadUrl = (filename) => {
  return `${API_URL}/download/${filename}`;
};

/**
 * Share a file via email
 * @param {string} filename - The name of the file to share
 * @param {string} recipientEmail - The email address of the recipient
 * @param {string} message - Optional message to include in the email
 * @returns {Promise<Object>} Object containing information about the sharing result
 */
export const shareFile = async (filename, recipientEmail, message = '') => {
  try {
    const response = await axios.post(`${API_URL}/share`, {
      filename,
      recipient_email: recipientEmail,
      message
    });

    return response.data;
  } catch (error) {
    console.error('Error sharing file:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.detail || 'Failed to share file';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('Error setting up the share request');
    }
  }
}; 