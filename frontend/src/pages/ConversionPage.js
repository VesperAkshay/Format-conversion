import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileUploader from '../components/FileUploader';
import ConversionResult from '../components/ConversionResult';
import { getSupportedFormats, convertFile } from '../services/api';

function ConversionPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [supportedFormats, setSupportedFormats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conversionResult, setConversionResult] = useState(null);
  const [converting, setConverting] = useState(false);
  const [conversionError, setConversionError] = useState('');

  // Format the conversion type for display
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

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
      
      const result = await convertFile(file, targetFormat, type);
      setConversionResult(result);
    } catch (err) {
      setConversionError(err.message || 'An error occurred during conversion');
      console.error('Conversion error:', err);
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Back to Home
      </Button>
      
      <Box sx={{ mt: 2, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {formattedType} Conversion
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Convert your {type} files to different formats. Supported input formats: 
          {supportedFormats?.input_formats?.join(', ')}
        </Typography>
      </Box>

      {error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      ) : (
        <>
          {!conversionResult && (
            <FileUploader
              conversionType={formattedType}
              supportedFormats={supportedFormats}
              onConvert={handleConvert}
            />
          )}
          
          <ConversionResult
            result={conversionResult}
            loading={converting}
            error={conversionError}
          />
        </>
      )}
    </Container>
  );
}

export default ConversionPage; 