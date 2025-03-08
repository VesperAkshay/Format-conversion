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
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import VideocamIcon from '@mui/icons-material/Videocam';
import FolderZipIcon from '@mui/icons-material/FolderZip';

const conversionTypes = [
  {
    title: 'Text Conversion',
    description: 'Convert between TXT, MD, HTML, XML, JSON, CSV, YAML, and more.',
    icon: <TextFieldsIcon sx={{ fontSize: 60 }} />,
    path: '/convert/text',
  },
  {
    title: 'Document Conversion',
    description: 'Convert between PDF, DOCX, TXT, HTML, MD, and more.',
    icon: <DescriptionIcon sx={{ fontSize: 60 }} />,
    path: '/convert/document',
  },
  {
    title: 'Image Conversion',
    description: 'Convert between JPG, PNG, GIF, BMP, TIFF, WEBP, SVG, and more.',
    icon: <ImageIcon sx={{ fontSize: 60 }} />,
    path: '/convert/image',
  },
  {
    title: 'Audio Conversion',
    description: 'Convert between MP3, WAV, OGG, FLAC, AAC, and more.',
    icon: <AudiotrackIcon sx={{ fontSize: 60 }} />,
    path: '/convert/audio',
  },
  {
    title: 'Video Conversion',
    description: 'Convert between MP4, AVI, MKV, MOV, WEBM, GIF, and more.',
    icon: <VideocamIcon sx={{ fontSize: 60 }} />,
    path: '/convert/video',
  },
  {
    title: 'Compressed File Conversion',
    description: 'Convert between ZIP, TAR, GZ, 7Z, and more.',
    icon: <FolderZipIcon sx={{ fontSize: 60 }} />,
    path: '/convert/compressed',
  },
];

function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Format Conversion App
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Convert your files between various formats with ease
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {conversionTypes.map((type) => (
          <Grid item xs={12} sm={6} md={4} key={type.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  color: 'primary.main',
                }}
              >
                {type.icon}
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {type.title}
                </Typography>
                <Typography>{type.description}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  component={RouterLink}
                  to={type.path}
                  fullWidth
                >
                  Convert Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Why Choose Our Format Converter?
        </Typography>
        <Typography variant="body1" paragraph>
          Our format conversion tool is designed to be fast, reliable, and easy to use.
          We support a wide range of file formats and provide high-quality conversions.
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2, textAlign: 'left' }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Easy to Use
            </Typography>
            <Typography variant="body2">
              Simply upload your file, select the target format, and click convert.
              No technical knowledge required.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Fast & Secure
            </Typography>
            <Typography variant="body2">
              All conversions are processed quickly on our servers.
              Your files are automatically deleted after conversion.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              High Quality
            </Typography>
            <Typography variant="body2">
              We use the best libraries and tools to ensure your converted files
              maintain the highest possible quality.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default HomePage; 