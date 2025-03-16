import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';

function TermsPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 2
          }}
        >
          Terms of Service
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Last updated: March 10, 2023
        </Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          1. Introduction
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to Format Conversion. These terms and conditions outline the rules and regulations for the use of our website and services.
        </Typography>
        <Typography variant="body1" paragraph>
          By accessing this website, we assume you accept these terms and conditions. Do not continue to use Format Conversion if you do not agree to take all of the terms and conditions stated on this page.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          2. License to Use
        </Typography>
        <Typography variant="body1" paragraph>
          Unless otherwise stated, Format Conversion and/or its licensors own the intellectual property rights for all material on Format Conversion. All intellectual property rights are reserved.
        </Typography>
        <Typography variant="body1" paragraph>
          You may view and/or print pages from the website for your own personal use subject to restrictions set in these terms and conditions.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          3. Restrictions
        </Typography>
        <Typography variant="body1" paragraph>
          You are specifically restricted from all of the following:
        </Typography>
        <Typography variant="body1" component="ul" sx={{ pl: 4 }}>
          <li>Publishing any website material in any other media</li>
          <li>Selling, sublicensing and/or otherwise commercializing any website material</li>
          <li>Publicly performing and/or showing any website material</li>
          <li>Using this website in any way that is or may be damaging to this website</li>
          <li>Using this website in any way that impacts user access to this website</li>
          <li>Using this website contrary to applicable laws and regulations, or in any way may cause harm to the website, or to any person or business entity</li>
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          4. File Conversion and Compression
        </Typography>
        <Typography variant="body1" paragraph>
          Our service allows you to convert and compress files between various formats. By using our service, you agree to the following:
        </Typography>
        <Typography variant="body1" component="ul" sx={{ pl: 4 }}>
          <li>You will not upload any files that contain illegal, harmful, or inappropriate content</li>
          <li>You will not upload files that infringe on the intellectual property rights of others</li>
          <li>You understand that files uploaded to our service are temporarily stored and will be automatically deleted after 24 hours</li>
          <li>You acknowledge that the quality of converted or compressed files may vary depending on the original file and the target format</li>
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          5. Limitation of Liability
        </Typography>
        <Typography variant="body1" paragraph>
          In no event shall Format Conversion, nor any of its officers, directors, and employees, be liable for anything arising out of or in any way connected with your use of this website, whether such liability is under contract, tort or otherwise.
        </Typography>
        <Typography variant="body1" paragraph>
          Format Conversion shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          6. Changes to Terms
        </Typography>
        <Typography variant="body1" paragraph>
          Format Conversion reserves the right to modify these terms from time to time at our sole discretion. Therefore, you should review these pages periodically. When we change the Terms in a material manner, we will notify you that material changes have been made to the Terms. Your continued use of the Website or our service after any such change constitutes your acceptance of the new Terms.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          7. Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions about these Terms, please contact us at:
        </Typography>
        <Typography variant="body1" paragraph>
          Email: terms@formatconversion.com
        </Typography>
      </Paper>
    </Container>
  );
}

export default TermsPage; 