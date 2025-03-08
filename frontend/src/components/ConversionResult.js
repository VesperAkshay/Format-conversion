import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Link,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function ConversionResult({ result, loading, error }) {
  if (loading) {
    return (
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Converting your file...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This may take a moment depending on the file size and conversion type.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Please try again or contact support if the issue persists.
        </Typography>
      </Box>
    );
  }

  if (!result) {
    return null;
  }

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
        <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h5" component="h2" gutterBottom>
          Conversion Successful!
        </Typography>
        
        <Divider sx={{ width: '100%', my: 2 }} />
        
        <Box sx={{ width: '100%', mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            File Details:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>File Path:</strong> {result.file_path}
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          component={Link}
          href={result.download_url}
          download
          sx={{ minWidth: 200 }}
        >
          Download Converted File
        </Button>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Your converted file will be available for download for the next hour.
          After that, it will be automatically deleted from our servers.
        </Typography>
      </Paper>
    </Box>
  );
}

export default ConversionResult; 