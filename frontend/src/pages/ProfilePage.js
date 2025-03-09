import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Alert,
  CircularProgress,
  Divider,
  Grid
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await updateUserProfile(currentUser, { displayName });
      setMessage('Profile updated successfully');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main' }}>
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" style={{ width: '100%', height: '100%' }} />
          ) : (
            <AccountCircleIcon sx={{ fontSize: 60 }} />
          )}
        </Avatar>
        
        <Typography component="h1" variant="h4" gutterBottom>
          My Profile
        </Typography>
        
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{message}</Alert>}
        
        <Box sx={{ width: '100%', mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Email
          </Typography>
          <Typography variant="body1">
            {currentUser?.email}
          </Typography>
        </Box>
        
        <Divider sx={{ width: '100%', mb: 3 }} />
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            fullWidth
            id="displayName"
            label="Display Name"
            name="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Profile'}
          </Button>
        </Box>
        
        <Divider sx={{ width: '100%', my: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
} 