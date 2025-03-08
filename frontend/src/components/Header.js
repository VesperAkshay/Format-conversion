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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenConvertMenu = (event) => {
    setAnchorElConvert(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseConvertMenu = () => {
    setAnchorElConvert(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo and title for larger screens */}
          <SwapHorizIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Format Converter
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
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
          <SwapHorizIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Format Converter
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Home
            </Button>
            <Button
              onClick={handleOpenConvertMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
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
            >
              {conversionTypes.map((type) => (
                <MenuItem
                  key={type.name}
                  component={RouterLink}
                  to={type.path}
                  onClick={handleCloseConvertMenu}
                >
                  <Typography textAlign="center">{type.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
            <Button
              component={RouterLink}
              to="/about"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              About
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header; 