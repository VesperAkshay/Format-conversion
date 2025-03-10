import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  CircularProgress, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  Chip,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import FileUploader from '../components/FileUploader';
import ConversionResult from '../components/ConversionResult';
import { getSupportedFormats, convertFile } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Define conversion type descriptions
const conversionTypeInfo = {
  text: { 
    color: '#3a86ff', 
    description: 'Convert between various text formats like TXT, MD, HTML, XML, JSON, CSV, and more.' 
  },
  document: { 
    color: '#ff006e', 
    description: 'Convert between document formats like PDF, DOCX, TXT, HTML, MD, and more.' 
  },
  image: { 
    color: '#8338ec', 
    description: 'Convert between image formats like JPG, PNG, GIF, BMP, TIFF, WEBP, SVG, and more.' 
  },
  audio: { 
    color: '#fb5607', 
    description: 'Convert between audio formats like MP3, WAV, OGG, FLAC, AAC, and more.' 
  },
  video: { 
    color: '#ffbe0b', 
    description: 'Convert between video formats like MP4, AVI, MKV, MOV, WEBM, GIF, and more.' 
  },
  compressed: { 
    color: '#06d6a0', 
    description: 'Convert between compressed file formats like ZIP, TAR, GZ, 7Z, and more.' 
  },
};

function ConversionPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [supportedFormats, setSupportedFormats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conversionResult, setConversionResult] = useState(null);
  const [converting, setConverting] = useState(false);
  const [conversionError, setConversionError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Format the conversion type for display
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
  const typeColor = conversionTypeInfo[type]?.color || theme.palette.primary.main;
  const typeDescription = conversionTypeInfo[type]?.description || '';

  // Steps for the conversion process
  const steps = ['Upload File', 'Configure Conversion', 'Download Result'];

  useEffect(() => {
    // Validate conversion type
    const validTypes = ['text', 'document', 'image', 'audio', 'video', 'compressed'];
    if (!validTypes.includes(type)) {
      navigate('/');
      return;
    }

    // Fetch supported formats for this conversion type
    const fetchFormats = async () => {
      try {
        setLoading(true);
        const formats = await getSupportedFormats();
        if (formats && formats[type]) {
          setSupportedFormats(formats[type]);
        } else {
          setError('Could not retrieve supported formats for this conversion type.');
        }
      } catch (err) {
        setError('Failed to load supported formats. Please try again later.');
        console.error('Error fetching formats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormats();
  }, [type, navigate]);

  const handleConvert = async (file, targetFormat) => {
    try {
      setConverting(true);
      setConversionError('');
      setActiveStep(1);
      
      const result = await convertFile(file, targetFormat, type);
      setConversionResult(result);
      setActiveStep(2);
    } catch (err) {
      setConversionError(err.message || 'An error occurred during conversion');
      console.error('Conversion error:', err);
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            mt: 8, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh'
          }}
        >
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            Loading conversion options...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Breadcrumbs navigation */}
      <Breadcrumbs 
        aria-label="breadcrumb" 
        sx={{ 
          mt: 3, 
          mb: 2,
          '& .MuiBreadcrumbs-ol': {
            alignItems: 'center',
          }
        }}
      >
        <Link 
          underline="hover" 
          color="inherit" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            '&:hover': {
              color: 'primary.main',
            }
          }}
          onClick={() => navigate('/')}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Home
        </Link>
        <Typography 
          color="text.primary" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 500
          }}
        >
          {formattedType} Conversion
        </Typography>
      </Breadcrumbs>
      
      {/* Page header */}
      <Box 
        sx={{ 
          mt: 3, 
          mb: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            background: `linear-gradient(90deg, ${typeColor} 0%, ${theme.palette.primary.main} 100%)`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          {formattedType} Conversion
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ 
            maxWidth: 700,
            mb: 4
          }}
        >
          {typeDescription}
        </Typography>

        {/* Stepper */}
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{ 
            width: '100%', 
            maxWidth: 700,
            mb: 4,
            '& .MuiStepLabel-label': {
              mt: 1,
              fontWeight: 500,
            },
            '& .MuiStepLabel-iconContainer': {
              '& .Mui-active': {
                color: typeColor,
              },
              '& .Mui-completed': {
                color: typeColor,
              },
            }
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel 
                StepIconProps={{
                  icon: index === 0 ? <CloudUploadIcon /> : 
                        index === 1 ? <SettingsIcon /> : 
                        <CheckCircleIcon />
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Main content */}
      <Grid container spacing={4}>
        {/* Left side - Conversion area */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
              minHeight: 400,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {error ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center'
                }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    width: '100%', 
                    mb: 3,
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Alert>
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
                  sx={{ 
                    mt: 2,
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    boxShadow: '0 4px 14px 0 rgba(58, 134, 255, 0.2)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(58, 134, 255, 0.3)',
                    }
                  }}
                >
                  Return to Home
                </Button>
              </Box>
            ) : (
              <>
                {!conversionResult && (
                  <FileUploader
                    conversionType={formattedType}
                    supportedFormats={supportedFormats}
                    onConvert={handleConvert}
                    typeColor={typeColor}
                  />
                )}
                
                <ConversionResult
                  result={conversionResult}
                  loading={converting}
                  error={conversionError}
                  typeColor={typeColor}
                />
              </>
            )}
          </Paper>
        </Grid>

        {/* Right side - Info and tips */}
        <Grid 
          item 
          md={4} 
          sx={{ 
            display: { xs: 'none', md: 'block' } 
          }}
        >
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              mb: 3
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Supported Formats
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Input Formats:
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {supportedFormats?.input_formats?.map((format) => (
                <Chip 
                  key={format} 
                  label={format} 
                  size="small" 
                  sx={{ 
                    bgcolor: `${typeColor}10`,
                    color: typeColor,
                    fontWeight: 500,
                  }} 
                />
              ))}
            </Box>
            
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Output Formats:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {supportedFormats?.output_formats?.map((format) => (
                <Chip 
                  key={format} 
                  label={format} 
                  size="small" 
                  sx={{ 
                    bgcolor: `${typeColor}10`,
                    color: typeColor,
                    fontWeight: 500,
                  }} 
                />
              ))}
            </Box>
          </Paper>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Conversion Tips
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box component="ul" sx={{ pl: 2, mt: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Make sure your file is not corrupted before uploading.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                For best results, use high-quality source files.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Some conversions may result in quality loss due to format limitations.
              </Typography>
              <Typography component="li" variant="body2">
                {currentUser ? 
                  "Your conversion history is saved in your profile." : 
                  "Sign in to save your conversion history."}
              </Typography>
            </Box>
            
            {!currentUser && (
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/login')}
                sx={{ 
                  mt: 3,
                  borderRadius: 2,
                  borderWidth: 1.5,
                  py: 1,
                  '&:hover': {
                    borderWidth: 1.5,
                  }
                }}
              >
                Sign In
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ConversionPage; 