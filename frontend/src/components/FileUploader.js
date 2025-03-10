import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function FileUploader({ conversionType, supportedFormats, onConvert, typeColor }) {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    noClick: file !== null, // Disable click when a file is already selected
  });

  const handleFormatChange = (event) => {
    setTargetFormat(event.target.value);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file to convert');
      return;
    }

    if (!targetFormat) {
      setError('Please select a target format');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onConvert(file, targetFormat);
    } catch (err) {
      setError(err.message || 'An error occurred during conversion');
    } finally {
      setLoading(false);
    }
  };

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const isValidFileType = (file) => {
    if (!file) return true;
    const extension = getFileExtension(file.name);
    return supportedFormats?.input_formats?.includes(extension) || false;
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setTargetFormat('');
  };

  const getFileIcon = (fileName) => {
    const extension = getFileExtension(fileName);
    
    // Return different colors based on file type
    switch (extension) {
      case 'pdf':
        return { color: '#f40f02' };
      case 'doc':
      case 'docx':
        return { color: '#295396' };
      case 'xls':
      case 'xlsx':
        return { color: '#1f7244' };
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return { color: '#8338ec' };
      case 'mp3':
      case 'wav':
        return { color: '#fb5607' };
      case 'mp4':
      case 'avi':
        return { color: '#ffbe0b' };
      default:
        return { color: typeColor || theme.palette.primary.main };
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            width: '100%', 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              alignItems: 'center'
            }
          }}
        >
          {error}
        </Alert>
      )}

      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? typeColor || 'primary.main' : 'divider',
          borderRadius: 3,
          p: 4,
          mb: 3,
          width: '100%',
          textAlign: 'center',
          cursor: file ? 'default' : 'pointer',
          backgroundColor: isDragActive 
            ? alpha(typeColor || theme.palette.primary.main, 0.08)
            : file 
              ? alpha(typeColor || theme.palette.primary.main, 0.04)
              : 'transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: file 
              ? alpha(typeColor || theme.palette.primary.main, 0.04)
              : alpha(typeColor || theme.palette.primary.main, 0.08),
            borderColor: file ? 'divider' : typeColor || 'primary.main',
          },
        }}
      >
        <input {...getInputProps()} />
        
        {!file ? (
          <Box>
            <Box 
              sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                bgcolor: alpha(typeColor || theme.palette.primary.main, 0.1),
                color: typeColor || 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 40 }} />
            </Box>
            
            {isDragActive ? (
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Drop the file here...
              </Typography>
            ) : (
              <>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Drag & Drop your {conversionType.toLowerCase()} file
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  or click to browse files
                </Typography>
                
                <Button
                  variant="outlined"
                  startIcon={<FileUploadIcon />}
                  sx={{ 
                    borderRadius: 2,
                    borderWidth: 1.5,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      borderWidth: 1.5,
                    }
                  }}
                >
                  Select File
                </Button>
              </>
            )}
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Supported formats:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                {supportedFormats?.input_formats?.map((format) => (
                  <Chip 
                    key={format} 
                    label={format.toUpperCase()} 
                    size="small" 
                    sx={{ 
                      bgcolor: alpha(typeColor || theme.palette.primary.main, 0.1),
                      color: typeColor || 'primary.main',
                      fontWeight: 500,
                      fontSize: '0.7rem'
                    }} 
                  />
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              alignItems="center"
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                position: 'relative'
              }}
            >
              <Box 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2, 
                  bgcolor: alpha(getFileIcon(file.name).color, 0.1),
                  color: getFileIcon(file.name).color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <InsertDriveFileOutlinedIcon />
              </Box>
              
              <Box sx={{ textAlign: 'left', flexGrow: 1, minWidth: 0 }}>
                <Typography 
                  variant="subtitle1" 
                  fontWeight={600} 
                  sx={{ 
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {file.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {getFileExtension(file.name).toUpperCase()}
                </Typography>
              </Box>
              
              <Tooltip title="Remove file">
                <IconButton 
                  size="small" 
                  onClick={handleRemoveFile}
                  sx={{ 
                    position: { xs: 'absolute', sm: 'static' }, 
                    top: 8, 
                    right: 8,
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'error.main',
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            
            {!isValidFileType(file) && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    alignItems: 'center'
                  }
                }}
              >
                Invalid file type. Please select a file with one of the supported formats.
              </Alert>
            )}
            
            <Button
              variant="text"
              size="small"
              onClick={open}
              sx={{ mt: 2 }}
            >
              Choose a different file
            </Button>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Select Target Format
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { xs: 'stretch', sm: 'flex-end' } }}>
        <FormControl 
          fullWidth 
          sx={{ 
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': {
                borderWidth: 1.5,
              },
              '&:hover fieldset': {
                borderWidth: 1.5,
              },
              '&.Mui-focused fieldset': {
                borderWidth: 1.5,
              },
            },
          }}
        >
          <InputLabel id="target-format-label">Target Format</InputLabel>
          <Select
            labelId="target-format-label"
            id="target-format"
            value={targetFormat}
            label="Target Format"
            onChange={handleFormatChange}
            disabled={!file || loading || !isValidFileType(file)}
            endAdornment={
              <Tooltip title="Select the format you want to convert your file to">
                <IconButton 
                  size="small" 
                  sx={{ mr: 2, visibility: 'visible' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            }
          >
            {supportedFormats?.output_formats?.map((format) => (
              <MenuItem key={format} value={format}>
                {format.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!file || !targetFormat || loading || !isValidFileType(file)}
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
          sx={{ 
            py: 1.5,
            px: 3,
            borderRadius: 2,
            minWidth: { xs: '100%', sm: 180 },
            bgcolor: typeColor || undefined,
            '&:hover': {
              bgcolor: typeColor ? alpha(typeColor, 0.8) : undefined,
            },
            boxShadow: '0 4px 14px 0 rgba(58, 134, 255, 0.2)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(58, 134, 255, 0.3)',
            }
          }}
        >
          {loading ? 'Converting...' : 'Convert Now'}
        </Button>
      </Box>
      
      {loading && (
        <LinearProgress 
          sx={{ 
            mt: 3, 
            borderRadius: 1,
            height: 6,
            bgcolor: alpha(typeColor || theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              bgcolor: typeColor || undefined,
            }
          }} 
        />
      )}
    </Box>
  );
}

export default FileUploader; 