import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Tabs, 
  Tab, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CompressIcon from '@mui/icons-material/Compress';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

function ApiPage() {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // API endpoint categories
  const apiCategories = [
    { label: 'Conversion', icon: <SwapHorizIcon /> },
    { label: 'Compression', icon: <CompressIcon /> },
    { label: 'File Management', icon: <CloudDownloadIcon /> },
    { label: 'Authentication', icon: <CodeIcon /> }
  ];

  // API endpoints for each category
  const apiEndpoints = {
    0: [ // Conversion
      {
        method: 'GET',
        endpoint: '/api/convert/supported-formats',
        description: 'Get supported formats for all conversion types',
        parameters: [],
        response: {
          type: 'Object',
          description: 'Object containing supported formats for each conversion type',
          example: `{
  "text": ["txt", "md", "html", "xml", "json", "csv", "yaml"],
  "document": ["pdf", "docx", "txt", "html", "md"],
  "image": ["jpg", "png", "gif", "bmp", "tiff", "webp", "svg"],
  "audio": ["mp3", "wav", "ogg", "flac", "aac"],
  "video": ["mp4", "avi", "mkv", "mov", "webm", "gif"],
  "compressed": ["zip", "tar", "gz", "7z"]
}`
        }
      },
      {
        method: 'POST',
        endpoint: '/api/convert/file',
        description: 'Convert a file to the specified format',
        parameters: [
          { name: 'file', type: 'File', required: true, description: 'The file to convert' },
          { name: 'target_format', type: 'string', required: true, description: 'The format to convert to' },
          { name: 'conversion_type', type: 'string', required: true, description: 'The type of conversion (text, document, image, audio, video, compressed)' }
        ],
        response: {
          type: 'Object',
          description: 'Object containing information about the converted file',
          example: `{
  "success": true,
  "message": "File converted successfully",
  "file_path": "outputs/2023/03/10/document_a1b2c3d4_5e6f7g8h.pdf",
  "download_url": "/outputs/2023/03/10/document_a1b2c3d4_5e6f7g8h.pdf"
}`
        }
      },
      {
        method: 'POST',
        endpoint: '/api/convert/file/async',
        description: 'Convert a file asynchronously and return a task ID',
        parameters: [
          { name: 'file', type: 'File', required: true, description: 'The file to convert' },
          { name: 'target_format', type: 'string', required: true, description: 'The format to convert to' },
          { name: 'conversion_type', type: 'string', required: true, description: 'The type of conversion (text, document, image, audio, video, compressed)' }
        ],
        response: {
          type: 'Object',
          description: 'Object containing the task ID',
          example: `{
  "success": true,
  "message": "Conversion task submitted",
  "task_id": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
  "status_url": "/api/convert/status/a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6"
}`
        }
      },
      {
        method: 'GET',
        endpoint: '/api/convert/status/{task_id}',
        description: 'Get the status of a conversion task',
        parameters: [
          { name: 'task_id', type: 'string', required: true, description: 'The ID of the task to check' }
        ],
        response: {
          type: 'Object',
          description: 'Object containing the task status',
          example: `{
  "status": "success",
  "message": "Task completed successfully",
  "file_path": "outputs/2023/03/10/document_a1b2c3d4_5e6f7g8h.pdf",
  "download_url": "/outputs/2023/03/10/document_a1b2c3d4_5e6f7g8h.pdf"
}`
        }
      }
    ],
    1: [ // Compression
      {
        method: 'GET',
        endpoint: '/api/compress/supported-formats',
        description: 'Get supported formats for all compression types',
        parameters: [],
        response: {
          type: 'Object',
          description: 'Object containing supported formats for each compression type',
          example: `{
  "text": ["txt", "md", "html", "xml", "json", "csv", "yaml"],
  "document": ["pdf", "docx", "pptx", "xlsx"],
  "image": ["jpg", "png", "webp", "tiff", "gif"],
  "audio": ["mp3", "wav", "ogg", "flac", "aac"],
  "video": ["mp4", "avi", "mkv", "mov", "webm"]
}`
        }
      },
      {
        method: 'GET',
        endpoint: '/api/compress/compression-options',
        description: 'Get compression options for all compression types',
        parameters: [],
        response: {
          type: 'Object',
          description: 'Object containing compression options for each compression type',
          example: `{
  "image": {
    "resize_percentage": {
      "type": "integer",
      "min": 10,
      "max": 100,
      "default": 100,
      "description": "Percentage to resize the image (10-100)"
    },
    "maintain_aspect_ratio": {
      "type": "boolean",
      "default": true,
      "description": "Maintain the aspect ratio when resizing"
    }
  }
}`
        }
      },
      {
        method: 'POST',
        endpoint: '/api/compress/file',
        description: 'Compress a file with the specified compression type and level',
        parameters: [
          { name: 'file', type: 'File', required: true, description: 'The file to compress' },
          { name: 'compression_type', type: 'string', required: true, description: 'The type of compression (text, image, video, audio, document)' },
          { name: 'compression_level', type: 'integer', required: false, description: 'Level of compression (1-10, where 10 is maximum compression)' },
          { name: 'options', type: 'string (JSON)', required: false, description: 'Additional compression options as a JSON string' }
        ],
        response: {
          type: 'Object',
          description: 'Object containing information about the compressed file',
          example: `{
  "success": true,
  "message": "File compressed successfully",
  "file_path": "outputs/2023/03/10/image_a1b2c3d4_5e6f7g8h.jpg",
  "download_url": "/outputs/2023/03/10/image_a1b2c3d4_5e6f7g8h.jpg"
}`
        }
      }
    ],
    2: [ // File Management
      {
        method: 'GET',
        endpoint: '/api/files/list',
        description: 'List files for the current user',
        parameters: [
          { name: 'type', type: 'string', required: false, description: 'Filter by file type (conversion, compression)' },
          { name: 'page', type: 'integer', required: false, description: 'Page number for pagination' },
          { name: 'limit', type: 'integer', required: false, description: 'Number of files per page' }
        ],
        response: {
          type: 'Object',
          description: 'Object containing the list of files',
          example: `{
  "files": [
    {
      "id": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
      "name": "document.pdf",
      "type": "conversion",
      "created_at": "2023-03-10T10:00:00Z",
      "size": 1024000,
      "download_url": "/outputs/2023/03/10/document_a1b2c3d4_5e6f7g8h.pdf"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}`
        }
      },
      {
        method: 'POST',
        endpoint: '/api/files/share',
        description: 'Share a file via email',
        parameters: [
          { name: 'filename', type: 'string', required: true, description: 'The name of the file to share' },
          { name: 'recipient_email', type: 'string', required: true, description: 'The email address of the recipient' },
          { name: 'message', type: 'string', required: false, description: 'Optional message to include in the email' }
        ],
        response: {
          type: 'Object',
          description: 'Object containing information about the sharing result',
          example: `{
  "success": true,
  "message": "File shared successfully"
}`
        }
      },
      {
        method: 'DELETE',
        endpoint: '/api/files/{file_id}',
        description: 'Delete a file',
        parameters: [
          { name: 'file_id', type: 'string', required: true, description: 'The ID of the file to delete' }
        ],
        response: {
          type: 'Object',
          description: 'Object containing information about the deletion result',
          example: `{
  "success": true,
  "message": "File deleted successfully"
}`
        }
      }
    ],
    3: [ // Authentication
      {
        method: 'POST',
        endpoint: '/api/auth/register',
        description: 'Register a new user',
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'User email address' },
          { name: 'password', type: 'string', required: true, description: 'User password' },
          { name: 'name', type: 'string', required: false, description: 'User display name' }
        ],
        response: {
          type: 'Object',
          description: 'Object containing user information and token',
          example: `{
  "user": {
    "id": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`
        }
      },
      {
        method: 'POST',
        endpoint: '/api/auth/login',
        description: 'Log in a user',
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'User email address' },
          { name: 'password', type: 'string', required: true, description: 'User password' }
        ],
        response: {
          type: 'Object',
          description: 'Object containing user information and token',
          example: `{
  "user": {
    "id": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`
        }
      },
      {
        method: 'POST',
        endpoint: '/api/auth/logout',
        description: 'Log out a user',
        parameters: [],
        response: {
          type: 'Object',
          description: 'Object containing logout result',
          example: `{
  "success": true,
  "message": "Logged out successfully"
}`
        }
      },
      {
        method: 'POST',
        endpoint: '/api/auth/reset-password',
        description: 'Request a password reset',
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'User email address' }
        ],
        response: {
          type: 'Object',
          description: 'Object containing reset password result',
          example: `{
  "success": true,
  "message": "Password reset email sent"
}`
        }
      }
    ]
  };

  // Render a table of parameters for an endpoint
  const renderParameters = (parameters) => {
    if (parameters.length === 0) {
      return <Typography variant="body2" color="text.secondary">No parameters required</Typography>;
    }

    return (
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle2">Parameter</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Type</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Required</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Description</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parameters.map((param, index) => (
              <TableRow key={index}>
                <TableCell>{param.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={param.type} 
                    size="small" 
                    sx={{ 
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 127, 255, 0.1)' : 'rgba(0, 127, 255, 0.1)',
                      color: 'primary.main',
                      fontWeight: 500,
                      fontSize: '0.7rem'
                    }} 
                  />
                </TableCell>
                <TableCell>{param.required ? 'Yes' : 'No'}</TableCell>
                <TableCell>{param.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Render an endpoint card
  const renderEndpoint = (endpoint, index) => {
    return (
      <Accordion key={index} sx={{ mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            '& .MuiAccordionSummary-content': {
              alignItems: 'center'
            }
          }}
        >
          <Chip 
            label={endpoint.method} 
            size="small" 
            sx={{ 
              mr: 2,
              bgcolor: endpoint.method === 'GET' 
                ? 'rgba(0, 200, 83, 0.1)' 
                : endpoint.method === 'POST'
                ? 'rgba(33, 150, 243, 0.1)'
                : endpoint.method === 'DELETE'
                ? 'rgba(244, 67, 54, 0.1)'
                : 'rgba(156, 39, 176, 0.1)',
              color: endpoint.method === 'GET' 
                ? 'success.main' 
                : endpoint.method === 'POST'
                ? 'primary.main'
                : endpoint.method === 'DELETE'
                ? 'error.main'
                : 'secondary.main',
              fontWeight: 600,
              fontSize: '0.7rem'
            }} 
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
            {endpoint.endpoint}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            {endpoint.description}
          </Typography>
          
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Parameters
          </Typography>
          {renderParameters(endpoint.parameters)}
          
          <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
            Response
          </Typography>
          <Typography variant="body2" paragraph>
            {endpoint.response.description}
          </Typography>
          
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              overflowX: 'auto'
            }}
          >
            <pre style={{ margin: 0 }}>{endpoint.response.example}</pre>
          </Paper>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 2
          }}
        >
          API Documentation
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          This documentation provides information about the Format Conversion API endpoints, parameters, and responses.
          Use these endpoints to integrate file conversion and compression capabilities into your applications.
        </Typography>

        <Paper sx={{ mt: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Base URL
          </Typography>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)',
              fontFamily: 'monospace',
              borderRadius: 1
            }}
          >
            <Typography variant="body1">
              https://api.formatconversion.com
            </Typography>
          </Paper>

          <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
            Authentication
          </Typography>
          <Typography variant="body2" paragraph>
            All API requests require authentication using a Bearer token. Include the token in the Authorization header:
          </Typography>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)',
              fontFamily: 'monospace',
              borderRadius: 1
            }}
          >
            <Typography variant="body1">
              Authorization: Bearer YOUR_API_TOKEN
            </Typography>
          </Paper>
        </Paper>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minWidth: 120,
                fontWeight: 500
              }
            }}
          >
            {apiCategories.map((category, index) => (
              <Tab 
                key={index} 
                label={category.label} 
                icon={category.icon} 
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          {apiEndpoints[tabValue]?.map((endpoint, index) => renderEndpoint(endpoint, index))}
        </Box>
      </Box>
    </Container>
  );
}

export default ApiPage; 