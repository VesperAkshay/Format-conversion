import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  Grid, 
  Stack,
  Divider,
  IconButton
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const footerLinks = [
  {
    title: 'Conversion',
    links: [
      { name: 'Text', path: '/convert/text' },
      { name: 'Document', path: '/convert/document' },
      { name: 'Image', path: '/convert/image' },
      { name: 'Audio', path: '/convert/audio' },
      { name: 'Video', path: '/convert/video' },
      { name: 'Compressed', path: '/convert/compressed' },
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About', path: '/about' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Contact', path: '/contact' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Help Center', path: '/help' },
      { name: 'Blog', path: '/blog' },
      { name: 'API', path: '/api' },
      { name: 'Feedback', path: '/feedback' },
    ]
  }
];

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5
                }}
              >
                <SwapHorizIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Format Converter
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 300 }}>
              Fast, secure, and high-quality file format conversion for all your needs. Convert between various formats with ease.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton aria-label="GitHub" size="small" sx={{ color: 'text.secondary' }}>
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="Twitter" size="small" sx={{ color: 'text.secondary' }}>
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="LinkedIn" size="small" sx={{ color: 'text.secondary' }}>
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Footer links */}
          {footerLinks.map((section, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary" gutterBottom>
                {section.title}
              </Typography>
              <Stack spacing={1.5}>
                {section.links.map((link, i) => (
                  <Link
                    key={i}
                    component={RouterLink}
                    to={link.path}
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                      }
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}

          {/* Newsletter */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={600} color="text.primary" gutterBottom>
              Stay Updated
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Subscribe to our newsletter for the latest updates and features.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', sm: 'flex-start' } }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, sm: 0 } }}>
            © {new Date().getFullYear()} Format Conversion App. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link component={RouterLink} to="/privacy" color="text.secondary" variant="body2" sx={{ textDecoration: 'none' }}>
              Privacy
            </Link>
            <Link component={RouterLink} to="/terms" color="text.secondary" variant="body2" sx={{ textDecoration: 'none' }}>
              Terms
            </Link>
            <Link component={RouterLink} to="/cookies" color="text.secondary" variant="body2" sx={{ textDecoration: 'none' }}>
              Cookies
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 