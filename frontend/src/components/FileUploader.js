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
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function FileUploader({ conversionType, supportedFormats, onConvert }) {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
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

  return (
    <Box sx={{ mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Convert {conversionType} Files
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 3,
            mb: 3,
            width: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.05)',
            },
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          {isDragActive ? (
            <Typography>Drop the file here...</Typography>
          ) : (
            <Typography>Drag and drop a file here, or click to select a file</Typography>
          )}
          {file && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
          )}
          {file && !isValidFileType(file) && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Invalid file type. Supported formats: {supportedFormats?.input_formats?.join(', ')}
            </Typography>
          )}
        </Box>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="target-format-label">Target Format</InputLabel>
          <Select
            labelId="target-format-label"
            id="target-format"
            value={targetFormat}
            label="Target Format"
            onChange={handleFormatChange}
            disabled={!file || loading}
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
          color="primary"
          onClick={handleSubmit}
          disabled={!file || !targetFormat || loading || !isValidFileType(file)}
          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
          sx={{ minWidth: 150 }}
        >
          {loading ? 'Converting...' : 'Convert'}
        </Button>
      </Paper>
    </Box>
  );
}

export default FileUploader; 