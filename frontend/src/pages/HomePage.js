import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
  Paper,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import VideocamIcon from '@mui/icons-material/Videocam';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import HighQualityIcon from '@mui/icons-material/HighQuality';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../contexts/AuthContext';

const conversionTypes = [
  {
    title: 'Text Conversion',
    description: 'Convert between TXT, MD, HTML, XML, JSON, CSV, YAML, and more.',
    icon: <TextFieldsIcon sx={{ fontSize: 40 }} />,
    path: '/convert/text',
    color: '#3a86ff',
    formats: ['TXT', 'MD', 'HTML', 'XML', 'JSON', 'CSV', 'YAML']
  },
  {
    title: 'Document Conversion',
    description: 'Convert between PDF, DOCX, TXT, HTML, MD, and more.',
    icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
    path: '/convert/document',
    color: '#ff006e',
    formats: ['PDF', 'DOCX', 'TXT', 'HTML', 'MD']
  },
  {
    title: 'Image Conversion',
    description: 'Convert between JPG, PNG, GIF, BMP, TIFF, WEBP, SVG, and more.',
    icon: <ImageIcon sx={{ fontSize: 40 }} />,
    path: '/convert/image',
    color: '#8338ec',
    formats: ['JPG', 'PNG', 'GIF', 'BMP', 'TIFF', 'WEBP', 'SVG']
  },
  {
    title: 'Audio Conversion',
    description: 'Convert between MP3, WAV, OGG, FLAC, AAC, and more.',
    icon: <AudiotrackIcon sx={{ fontSize: 40 }} />,
    path: '/convert/audio',
    color: '#fb5607',
    formats: ['MP3', 'WAV', 'OGG', 'FLAC', 'AAC']
  },
  {
    title: 'Video Conversion',
    description: 'Convert between MP4, AVI, MKV, MOV, WEBM, GIF, and more.',
    icon: <VideocamIcon sx={{ fontSize: 40 }} />,
    path: '/convert/video',
    color: '#ffbe0b',
    formats: ['MP4', 'AVI', 'MKV', 'MOV', 'WEBM', 'GIF']
  },
  {
    title: 'Compressed File Conversion',
    description: 'Convert between ZIP, TAR, GZ, 7Z, and more.',
    icon: <FolderZipIcon sx={{ fontSize: 40 }} />,
    path: '/convert/compressed',
    color: '#06d6a0',
    formats: ['ZIP', 'TAR', 'GZ', '7Z']
  },
];

const features = [
  {
    title: 'Fast Processing',
    description: 'Our optimized algorithms ensure quick conversions without compromising quality.',
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    color: '#3a86ff'
  },
  {
    title: 'Secure & Private',
    description: 'Your files are automatically deleted after conversion, ensuring your privacy.',
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    color: '#ff006e'
  },
  {
    title: 'High Quality Results',
    description: 'We use the best libraries and tools to maintain the highest possible quality.',
    icon: <HighQualityIcon sx={{ fontSize: 40 }} />,
    color: '#8338ec'
  }
];

function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentUser } = useAuth();

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    background: 'linear-gradient(90deg, #3a86ff 0%, #ff006e 100%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                  }}
                >
                  Convert Any File Format
                </Typography>
                <Typography 
                  variant="h5" 
                  color="text.secondary" 
                  paragraph
                  sx={{ 
                    mb: 4,
                    fontWeight: 500,
                    maxWidth: '90%'
                  }}
                >
                  Fast, secure, and high-quality file format conversion for all your needs
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button 
                    variant="contained" 
                    size="large"
                    component={RouterLink}
                    to={currentUser ? "/convert/document" : "/login"}
                    sx={{ 
                      py: 1.5, 
                      px: 4,
                      borderRadius: '50px',
                      fontWeight: 600,
                      boxShadow: '0 4px 14px 0 rgba(58, 134, 255, 0.3)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(58, 134, 255, 0.4)',
                      }
                    }}
                  >
                    {currentUser ? "Start Converting" : "Sign In to Convert"}
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    component={RouterLink}
                    to="/about"
                    sx={{ 
                      py: 1.5, 
                      px: 4,
                      borderRadius: '50px',
                      fontWeight: 600,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                      }
                    }}
                  >
                    Learn More
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                sx={{ 
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '140%',
                    height: '140%',
                    top: '-20%',
                    left: '-20%',
                    background: 'radial-gradient(circle, rgba(58, 134, 255, 0.1) 0%, rgba(58, 134, 255, 0) 70%)',
                    zIndex: 0
                  }
                }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: 'white',
                    transform: 'perspective(1500px) rotateY(-15deg) rotateX(5deg)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    zIndex: 1,
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%)',
                      zIndex: 2
                    }
                  }}
                >
                  <Stack spacing={2}>
                    {conversionTypes.slice(0, 3).map((type, index) => (
                      <Paper
                        key={index}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: `${type.color}20`,
                            color: type.color,
                            width: 48,
                            height: 48
                          }}
                        >
                          {type.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {type.title}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                            {type.formats.slice(0, 3).map((format, i) => (
                              <Chip
                                key={i}
                                label={format}
                                size="small"
                                sx={{ 
                                  bgcolor: `${type.color}10`,
                                  color: type.color,
                                  fontWeight: 500,
                                  fontSize: '0.7rem'
                                }}
                              />
                            ))}
                            <Chip
                              label="+ more"
                              size="small"
                              sx={{ 
                                bgcolor: 'grey.100',
                                color: 'text.secondary',
                                fontWeight: 500,
                                fontSize: '0.7rem'
                              }}
                            />
                          </Stack>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Conversion Types Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Conversion Types
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ 
              maxWidth: 700,
              mx: 'auto',
              mb: 2
            }}
          >
            Choose from our wide range of file format conversion options
          </Typography>
          <Divider sx={{ width: 80, mx: 'auto', my: 3, borderColor: 'primary.main', borderWidth: 2 }} />
        </Box>

        <Grid container spacing={3}>
          {conversionTypes.map((type, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: `${type.color}20`,
                      color: type.color,
                      width: 56,
                      height: 56
                    }}
                  >
                    {type.icon}
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    component="h3"
                    sx={{ fontWeight: 600 }}
                  >
                    {type.title}
                  </Typography>
                </Box>
                <Divider />
                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {type.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Supported Formats:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {type.formats.map((format, i) => (
                        <Chip
                          key={i}
                          label={format}
                          size="small"
                          sx={{ 
                            bgcolor: `${type.color}10`,
                            color: type.color,
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            my: 0.5
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to={type.path}
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                      py: 1,
                      bgcolor: type.color,
                      '&:hover': {
                        bgcolor: type.color,
                        filter: 'brightness(0.9)'
                      }
                    }}
                  >
                    Convert Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ 
        bgcolor: 'background.paper', 
        py: { xs: 6, md: 10 },
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Why Choose Our Format Converter?
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="text.secondary"
              sx={{ 
                maxWidth: 700,
                mx: 'auto',
                mb: 2
              }}
            >
              Our format conversion tool is designed to be fast, reliable, and easy to use
            </Typography>
            <Divider sx={{ width: 80, mx: 'auto', my: 3, borderColor: 'primary.main', borderWidth: 2 }} />
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                      borderColor: feature.color,
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: `${feature.color}20`,
                      color: feature.color,
                      width: 64,
                      height: 64,
                      mb: 2
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="contained" 
              size="large"
              component={RouterLink}
              to={currentUser ? "/convert/document" : "/login"}
              sx={{ 
                py: 1.5, 
                px: 4,
                borderRadius: '50px',
                fontWeight: 600,
                boxShadow: '0 4px 14px 0 rgba(58, 134, 255, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(58, 134, 255, 0.4)',
                }
              }}
            >
              {currentUser ? "Start Converting Now" : "Sign In to Get Started"}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage; 