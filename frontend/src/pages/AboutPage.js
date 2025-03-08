import React from 'react';
import { Container, Typography, Box, Paper, Grid, Divider } from '@mui/material';

function AboutPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About Format Conversion App
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            Our mission is to provide a simple, fast, and reliable way to convert files between
            different formats. We believe that file conversion should be accessible to everyone,
            regardless of technical expertise.
          </Typography>
          <Typography variant="body1" paragraph>
            We've built this application using modern technologies to ensure the best possible
            user experience and conversion quality.
          </Typography>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Supported Conversion Types
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Text Conversion
              </Typography>
              <Typography variant="body2">
                Convert between TXT, MD, HTML, XML, JSON, CSV, YAML, and more.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Document Conversion
              </Typography>
              <Typography variant="body2">
                Convert between PDF, DOCX, TXT, HTML, MD, and more.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Image Conversion
              </Typography>
              <Typography variant="body2">
                Convert between JPG, PNG, GIF, BMP, TIFF, WEBP, SVG, and more.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Audio Conversion
              </Typography>
              <Typography variant="body2">
                Convert between MP3, WAV, OGG, FLAC, AAC, and more.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Video Conversion
              </Typography>
              <Typography variant="body2">
                Convert between MP4, AVI, MKV, MOV, WEBM, GIF, and more.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Compressed File Conversion
              </Typography>
              <Typography variant="body2">
                Convert between ZIP, TAR, GZ, 7Z, and more.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Technology Stack
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Frontend
              </Typography>
              <ul>
                <li>
                  <Typography variant="body2">React.js</Typography>
                </li>
                <li>
                  <Typography variant="body2">Material-UI</Typography>
                </li>
                <li>
                  <Typography variant="body2">React Router</Typography>
                </li>
                <li>
                  <Typography variant="body2">Axios</Typography>
                </li>
              </ul>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Backend
              </Typography>
              <ul>
                <li>
                  <Typography variant="body2">FastAPI (Python)</Typography>
                </li>
                <li>
                  <Typography variant="body2">Uvicorn ASGI Server</Typography>
                </li>
                <li>
                  <Typography variant="body2">Various conversion libraries</Typography>
                </li>
                <li>
                  <Typography variant="body2">Asynchronous processing</Typography>
                </li>
              </ul>
            </Grid>
          </Grid>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Privacy & Security
          </Typography>
          <Typography variant="body1" paragraph>
            We take your privacy and security seriously. All uploaded files are automatically
            deleted from our servers after one hour. We do not store any personal information
            about your files or conversions.
          </Typography>
          <Typography variant="body1">
            The conversion process happens entirely on our secure servers, and your files are
            never shared with third parties.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default AboutPage; 