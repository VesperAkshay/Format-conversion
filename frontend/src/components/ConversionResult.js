import React, { useState } from 'react';
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
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { shareFile } from '../services/api';

function ConversionResult({ result, loading, error, typeColor }) {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State for share dialog
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sharing, setSharing] = useState(false);
  
  // State for notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const handleCopyLink = () => {
    if (result?.download_url) {
      navigator.clipboard.writeText(window.location.origin + result.download_url);
      showNotification('Link copied to clipboard', 'success');
    }
  };
  
  const handleNewConversion = () => {
    // Refresh the page to start a new conversion
    window.location.reload();
  };
  
  const handleShareDialogOpen = () => {
    setShareDialogOpen(true);
  };
  
  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
    setRecipientEmail('');
    setShareMessage('');
    setEmailError('');
  };
  
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  const handleShareFile = async () => {
    // Validate email
    if (!recipientEmail) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(recipientEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setEmailError('');
    setSharing(true);
    
    try {
      // Extract filename from path
      const fileName = result.file_path.split('/').pop();
      
      // Call API to share file
      const response = await shareFile(fileName, recipientEmail, shareMessage);
      
      // Show success notification
      showNotification('File shared successfully', 'success');
      
      // Close dialog
      handleShareDialogClose();
    } catch (error) {
      console.error('Error sharing file:', error);
      showNotification(error.message || 'Failed to share file', 'error');
    } finally {
      setSharing(false);
    }
  };
  
  const showNotification = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
              
              <Tooltip title="Share file via email">
                <IconButton 
                  onClick={handleShareDialogOpen}
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
      
      {/* Share Dialog */}
      <Dialog 
        open={shareDialogOpen} 
        onClose={handleShareDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <EmailIcon color="primary" />
            <Typography variant="h6" component="div" fontWeight={600}>
              Share File via Email
            </Typography>
          </Stack>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleShareDialogClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" paragraph>
            Share the converted file "{fileName}" with someone via email.
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            id="recipient-email"
            label="Recipient Email"
            type="email"
            fullWidth
            variant="outlined"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
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
          />
          
          <TextField
            margin="dense"
            id="share-message"
            label="Message (Optional)"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={shareMessage}
            onChange={(e) => setShareMessage(e.target.value)}
            placeholder="Add a personal message to include in the email..."
            sx={{
              '& .MuiOutlinedInput-root': {
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
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleShareDialogClose}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              borderWidth: 1.5,
              px: 3,
              '&:hover': {
                borderWidth: 1.5,
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleShareFile}
            variant="contained"
            disabled={sharing}
            startIcon={sharing ? <CircularProgress size={20} /> : <EmailIcon />}
            sx={{ 
              borderRadius: 2,
              px: 3,
              boxShadow: '0 4px 14px 0 rgba(58, 134, 255, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(58, 134, 255, 0.3)',
              }
            }}
          >
            {sharing ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ConversionResult; 