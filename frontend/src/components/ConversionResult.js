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
  Stack,
  Chip,
  useTheme,
  alpha,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import { useNavigate } from 'react-router-dom';

function ConversionResult({ result, loading, error, typeColor }) {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const handleCopyLink = () => {
    if (result?.download_url) {
      navigator.clipboard.writeText(window.location.origin + result.download_url);
    }
  };
  
  const handleNewConversion = () => {
    // Refresh the page to start a new conversion
    window.location.reload();
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', py: 6 }}>
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            mb: 3
          }}
        >
          <CircularProgress 
            size={80} 
            thickness={4} 
            sx={{ 
              color: typeColor || 'primary.main',
            }} 
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              component="div"
              sx={{ fontWeight: 600, fontSize: '1rem' }}
            >
              {/* This would ideally show actual progress */}
              ...
            </Typography>
          </Box>
        </Box>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
          Converting your file...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center', maxWidth: 400 }}>
          This may take a moment depending on the file size and conversion type.
          Please don't close this window.
        </Typography>
        <LinearProgress 
          sx={{ 
            width: '100%', 
            maxWidth: 400,
            borderRadius: 1,
            height: 6,
            bgcolor: alpha(typeColor || theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              bgcolor: typeColor || undefined,
            }
          }} 
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%', py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              alignItems: 'center'
            }
          }}
        >
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please try again or contact support if the issue persists.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ReplayIcon />}
          onClick={handleNewConversion}
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
          Try Again
        </Button>
      </Box>
    );
  }

  if (!result) {
    return null;
  }

  // Extract filename from path
  const fileName = result.file_path.split('/').pop();
  const fileExtension = fileName.split('.').pop().toUpperCase();
  
  // Get file size if available
  const fileSize = result.file_size ? `${(result.file_size / 1024 / 1024).toFixed(2)} MB` : 'Ready to download';

  return (
    <Box sx={{ width: '100%', py: 2 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 4
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: alpha('#10b981', 0.1),
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>
          Conversion Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Your file has been successfully converted and is ready for download.
        </Typography>
      </Box>
      
      <Card 
        elevation={0} 
        sx={{ 
          mb: 4, 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            File Details
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            alignItems="center"
            sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: alpha(typeColor || theme.palette.primary.main, 0.05),
              mb: 3
            }}
          >
            <Box 
              sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: 2, 
                bgcolor: alpha(typeColor || theme.palette.primary.main, 0.1),
                color: typeColor || theme.palette.primary.main,
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
                {fileName}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip 
                  label={fileExtension} 
                  size="small" 
                  sx={{ 
                    bgcolor: alpha(typeColor || theme.palette.primary.main, 0.1),
                    color: typeColor || theme.palette.primary.main,
                    fontWeight: 500,
                    fontSize: '0.7rem'
                  }} 
                />
                <Typography variant="body2" color="text.secondary">
                  {fileSize}
                </Typography>
              </Stack>
            </Box>
          </Stack>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2}
            sx={{ width: '100%' }}
          >
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              component={Link}
              href={result.download_url}
              download
              sx={{ 
                py: 1.5,
                px: 3,
                borderRadius: 2,
                flexGrow: 1,
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
              Download File
            </Button>
            
            <Stack direction="row" spacing={1}>
              <Tooltip title="Copy download link">
                <IconButton 
                  onClick={handleCopyLink}
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 1.5
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Share file">
                <IconButton 
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 1.5
                  }}
                >
                  <ShareIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Your converted file will be available for download for the next 24 hours.
          After that, it will be automatically deleted from our servers.
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<ReplayIcon />}
          onClick={handleNewConversion}
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
          Convert Another File
        </Button>
      </Box>
    </Box>
  );
}

export default ConversionResult; 