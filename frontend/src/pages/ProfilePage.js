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
  Grid,
  Stack,
  Card,
  CardContent,
  IconButton,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import FolderIcon from '@mui/icons-material/Folder';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Remove mock data
  const conversions = [];

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await updateUserProfile(currentUser, { displayName });
      setMessage('Profile updated successfully');
      setEditing(false);
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Grid container spacing={4}>
        {/* Left sidebar */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ position: 'relative', mb: 3 }}>
              <Avatar
                src={currentUser?.photoURL}
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: 'primary.main',
                  fontSize: 64,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  border: '4px solid white',
                }}
              >
                {!currentUser?.photoURL && <AccountCircleIcon sx={{ fontSize: 80 }} />}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'background.paper',
                  border: '2px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'background.paper',
                  },
                }}
                size="small"
                onClick={() => setEditing(!editing)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography variant="h5" fontWeight={700} gutterBottom>
              {currentUser?.displayName || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
              {currentUser?.email}
            </Typography>

            <Chip 
              label="Free Account" 
              color="primary" 
              size="small" 
              sx={{ 
                mt: 1, 
                mb: 3,
                fontWeight: 500,
                borderRadius: '50px',
              }} 
            />

            <Divider sx={{ width: '100%', mb: 3 }} />

            <Stack spacing={2} sx={{ width: '100%' }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<SettingsIcon />}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1,
                  borderRadius: 2,
                  borderWidth: 1.5,
                  '&:hover': {
                    borderWidth: 1.5,
                  },
                }}
              >
                Account Settings
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1,
                  borderRadius: 2,
                  borderWidth: 1.5,
                  '&:hover': {
                    borderWidth: 1.5,
                  },
                }}
              >
                Log Out
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="profile tabs"
                sx={{
                  px: 3,
                  '& .MuiTab-root': {
                    py: 2,
                    fontWeight: 600,
                  },
                }}
              >
                <Tab 
                  icon={<AccountCircleIcon />} 
                  iconPosition="start" 
                  label="Profile" 
                  id="profile-tab-0" 
                  aria-controls="profile-tabpanel-0" 
                />
                <Tab 
                  icon={<HistoryIcon />} 
                  iconPosition="start" 
                  label="Conversion History" 
                  id="profile-tab-1" 
                  aria-controls="profile-tabpanel-1" 
                />
                <Tab 
                  icon={<FolderIcon />} 
                  iconPosition="start" 
                  label="Saved Files" 
                  id="profile-tab-2" 
                  aria-controls="profile-tabpanel-2" 
                />
              </Tabs>
            </Box>

            {/* Profile Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 4 }}>
                {error && (
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
                )}
                {message && (
                  <Alert 
                    severity="success" 
                    sx={{ 
                      width: '100%', 
                      mb: 3,
                      borderRadius: 2,
                    }}
                  >
                    {message}
                  </Alert>
                )}

                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Profile Information
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Update your personal information and how others see you on the platform.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Email Address
                      </Typography>
                      <TextField
                        fullWidth
                        disabled
                        value={currentUser?.email}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderWidth: 1.5,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Display Name
                      </Typography>
                      <TextField
                        fullWidth
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={!editing}
                        sx={{
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
                    </Grid>
                  </Grid>

                  {editing && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => setEditing(false)}
                        sx={{ 
                          mr: 2,
                          borderRadius: 2,
                          borderWidth: 1.5,
                          px: 3,
                          '&:hover': {
                            borderWidth: 1.5,
                          },
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={loading}
                        sx={{ 
                          borderRadius: 2,
                          px: 3,
                          boxShadow: '0 4px 14px 0 rgba(58, 134, 255, 0.2)',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(58, 134, 255, 0.3)',
                          }
                        }}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                      </Button>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Account Statistics
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Overview of your account activity and usage.
                </Typography>

                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={4}>
                    <Card 
                      elevation={0} 
                      sx={{ 
                        borderRadius: 3, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        height: '100%',
                      }}
                    >
                      <CardContent>
                        <Typography variant="h3" fontWeight={700} color="primary.main">
                          {conversions.length}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Conversions
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card 
                      elevation={0} 
                      sx={{ 
                        borderRadius: 3, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        height: '100%',
                      }}
                    >
                      <CardContent>
                        <Typography variant="h3" fontWeight={700} color="primary.main">
                          0
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          Saved Files
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card 
                      elevation={0} 
                      sx={{ 
                        borderRadius: 3, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        height: '100%',
                      }}
                    >
                      <CardContent>
                        <Typography variant="h3" fontWeight={700} color="primary.main">
                          Free
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          Account Type
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* Conversion History Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Recent Conversions
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  View your recent file conversions and download them again if needed.
                </Typography>

                {conversions.length > 0 ? (
                  <Stack spacing={2} sx={{ mt: 3 }}>
                    {conversions.map((conversion) => (
                      <Paper
                        key={conversion.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            variant="rounded"
                            sx={{
                              bgcolor: 'primary.light',
                              width: 48,
                              height: 48,
                            }}
                          >
                            <FolderIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {conversion.fileName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Converted to {conversion.convertedTo} • {conversion.date} • {conversion.size}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            borderRadius: 2,
                            borderWidth: 1.5,
                            '&:hover': {
                              borderWidth: 1.5,
                            },
                          }}
                        >
                          Download
                        </Button>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      mt: 4,
                      p: 4,
                      textAlign: 'center',
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <HistoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      No conversion history yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your recent file conversions will appear here.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ 
                        mt: 2,
                        borderRadius: 2,
                        px: 3,
                        boxShadow: '0 4px 14px 0 rgba(58, 134, 255, 0.2)',
                        '&:hover': {
                          boxShadow: '0 6px 20px rgba(58, 134, 255, 0.3)',
                        }
                      }}
                      onClick={() => navigate('/convert/document')}
                    >
                      Convert a File
                    </Button>
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* Saved Files Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Saved Files
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Access your saved files and manage your storage.
                </Typography>

                <Box
                  sx={{
                    mt: 4,
                    p: 4,
                    textAlign: 'center',
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                  }}
                >
                  <FolderIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No saved files yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Files you save will appear here for easy access.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ 
                      mt: 2,
                      borderRadius: 2,
                      px: 3,
                      boxShadow: '0 4px 14px 0 rgba(58, 134, 255, 0.2)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(58, 134, 255, 0.3)',
                      }
                    }}
                    onClick={() => navigate('/convert/document')}
                  >
                    Convert a File
                  </Button>
                </Box>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
} 