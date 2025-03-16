import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';

function PrivacyPage() {
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
          Privacy Policy
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
          Welcome to Format Conversion. We respect your privacy and are committed to protecting your personal data. 
          This privacy policy will inform you about how we look after your personal data when you visit our website 
          and tell you about your privacy rights and how the law protects you.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          2. The Data We Collect
        </Typography>
        <Typography variant="body1" paragraph>
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
        </Typography>
        <Typography variant="body1" component="ul" sx={{ pl: 4 }}>
          <li>Identity Data includes first name, last name, username or similar identifier.</li>
          <li>Contact Data includes email address.</li>
          <li>Technical Data includes internet protocol (IP) address, browser type and version, time zone setting and location, 
          browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
          <li>Usage Data includes information about how you use our website and services.</li>
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          3. How We Use Your Data
        </Typography>
        <Typography variant="body1" paragraph>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </Typography>
        <Typography variant="body1" component="ul" sx={{ pl: 4 }}>
          <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
          <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
          <li>Where we need to comply with a legal obligation.</li>
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          4. File Storage and Security
        </Typography>
        <Typography variant="body1" paragraph>
          Files uploaded to our service for conversion or compression are stored temporarily and are automatically deleted after 24 hours. 
          We implement appropriate security measures to protect your files during this period. However, we recommend that you do not upload 
          sensitive or confidential information.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          5. Your Legal Rights
        </Typography>
        <Typography variant="body1" paragraph>
          Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
        </Typography>
        <Typography variant="body1" component="ul" sx={{ pl: 4 }}>
          <li>Request access to your personal data.</li>
          <li>Request correction of your personal data.</li>
          <li>Request erasure of your personal data.</li>
          <li>Object to processing of your personal data.</li>
          <li>Request restriction of processing your personal data.</li>
          <li>Request transfer of your personal data.</li>
          <li>Right to withdraw consent.</li>
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          6. Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions about this privacy policy or our privacy practices, please contact us at:
        </Typography>
        <Typography variant="body1" paragraph>
          Email: privacy@formatconversion.com
        </Typography>
      </Paper>
    </Container>
  );
}

export default PrivacyPage; 