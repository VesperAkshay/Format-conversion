import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Container,
  useMediaQuery,
  useTheme,
  Avatar,
  Tooltip,
  Divider,
  Badge,
  Fade
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../contexts/AuthContext';

const conversionTypes = [
  { name: 'Text', path: '/convert/text' },
  { name: 'Document', path: '/convert/document' },
  { name: 'Image', path: '/convert/image' },
  { name: 'Audio', path: '/convert/audio' },
  { name: 'Video', path: '/convert/video' },
  { name: 'Compressed', path: '/convert/compressed' },
];

function Header() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElConvert, setAnchorElConvert] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser, logout } = useAuth();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenConvertMenu = (event) => {
    setAnchorElConvert(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseConvertMenu = () => {
    setAnchorElConvert(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleCloseUserMenu();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo and title for larger screens */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, mr: 1.5 }}>
              <SwapHorizIcon />
            </Avatar>
            <Typography
              variant="h5"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                textDecoration: 'none',
                letterSpacing: '-0.5px',
              }}
            >
              Format Converter
            </Typography>
          </Box>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
              TransitionComponent={Fade}
            >
              <MenuItem component={RouterLink} to="/" onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Home</Typography>
              </MenuItem>
              {conversionTypes.map((type) => (
                <MenuItem
                  key={type.name}
                  component={RouterLink}
                  to={type.path}
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">{type.name}</Typography>
                </MenuItem>
              ))}
              <MenuItem component={RouterLink} to="/about" onClick={handleCloseNavMenu}>
                <Typography textAlign="center">About</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo and title for mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', flexGrow: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, mr: 1 }}>
              <SwapHorizIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                textDecoration: 'none',
                letterSpacing: '-0.5px',
              }}
            >
              Format Converter
            </Typography>
          </Box>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ 
                mx: 1, 
                color: 'text.primary', 
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              Home
            </Button>
            <Button
              onClick={handleOpenConvertMenu}
              sx={{ 
                mx: 1, 
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              Convert
            </Button>
            <Menu
              id="convert-menu"
              anchorEl={anchorElConvert}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElConvert)}
              onClose={handleCloseConvertMenu}
              TransitionComponent={Fade}
              PaperProps={{
                elevation: 2,
                sx: {
                  mt: 1.5,
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
            >
              {conversionTypes.map((type) => (
                <MenuItem
                  key={type.name}
                  component={RouterLink}
                  to={type.path}
                  onClick={handleCloseConvertMenu}
                  sx={{ 
                    minWidth: 180,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <Typography textAlign="center">{type.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
            <Button
              component={RouterLink}
              to="/about"
              sx={{ 
                mx: 1, 
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              About
            </Button>
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            {currentUser ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ 
                      p: 0.5,
                      border: '2px solid',
                      borderColor: 'primary.light',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    <Avatar 
                      alt={currentUser.displayName || 'User'} 
                      src={currentUser.photoURL}
                      sx={{ width: 36, height: 36 }}
                    >
                      {!currentUser.photoURL && <AccountCircleIcon />}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  TransitionComponent={Fade}
                  PaperProps={{
                    elevation: 2,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                >
                  {currentUser.displayName && (
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle1" fontWeight={600} noWrap>
                        {currentUser.displayName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {currentUser.email}
                      </Typography>
                    </Box>
                  )}
                  
                  {currentUser.displayName && <Divider />}
                  
                  <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu} sx={{ minWidth: 200 }}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
                sx={{ 
                  px: 3,
                  py: 1,
                  borderRadius: '50px',
                  boxShadow: '0 4px 14px 0 rgba(58, 134, 255, 0.2)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(58, 134, 255, 0.3)',
                  }
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header; 