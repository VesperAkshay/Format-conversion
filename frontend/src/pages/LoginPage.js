import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Paper,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGithubSignIn() {
    try {
      setError('');
      setLoading(true);
      await loginWithGithub();
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: { xs: 4, md: 8 }, mb: 4 }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        {/* Left side - Form */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
              borderRadius: 3,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04)'
            }}
          >
            <Typography 
              component="h1" 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 700, 
                color: 'text.primary',
                textAlign: 'center',
                mb: 3
              }}
            >
              Welcome Back
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    alignItems: 'center'
                  }
                }}
              >
                {error}
              </Alert>
            )}
            
            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              sx={{ 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
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
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  mt: 1, 
                  mb: 3, 
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px 0 rgba(58, 134, 255, 0.2)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(58, 134, 255, 0.3)',
                  }
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              
              <Divider sx={{ my: 2 }}>OR</Divider>
              
              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleSignIn}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 2,
                    borderWidth: 1.5,
                    '&:hover': {
                      borderWidth: 1.5,
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                  disabled={loading}
                >
                  Sign in with Google
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                  onClick={handleGithubSignIn}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 2,
                    borderWidth: 1.5,
                    '&:hover': {
                      borderWidth: 1.5,
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                  disabled={loading}
                  color="secondary"
                >
                  Sign in with GitHub
                </Button>
              </Stack>
              
              <Grid container sx={{ mt: 3 }}>
                <Grid item xs>
                  <Link 
                    component={RouterLink} 
                    to="/forgot-password" 
                    variant="body2"
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 500,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link 
                    component={RouterLink} 
                    to="/register" 
                    variant="body2"
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 500,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        
        {/* Right side - Image/Info */}
        <Grid 
          item 
          md={6} 
          sx={{ 
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'primary.main',
              borderRadius: 3,
              color: 'white',
              backgroundImage: 'linear-gradient(135deg, #3a86ff 0%, #60a5fa 100%)',
              boxShadow: '0 10px 40px rgba(58, 134, 255, 0.2)'
            }}
          >
            <Box
              component="img"
              src="/logo192.png"
              alt="Format Converter"
              sx={{
                width: 80,
                height: 80,
                mb: 3,
                filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))'
              }}
            />
            <Typography variant="h4" component="h2" gutterBottom fontWeight={700} textAlign="center">
              Format Converter
            </Typography>
            <Typography variant="body1" textAlign="center" sx={{ mb: 4, opacity: 0.9 }}>
              Convert your files between different formats with ease. Fast, secure, and reliable.
            </Typography>
            <Box
              sx={{
                width: '100%',
                maxWidth: 300,
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Features:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  • Multiple file format support
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  • Fast conversion process
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  • Secure and private
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  • Free to use
                </Typography>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 