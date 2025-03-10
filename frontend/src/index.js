import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create a theme instance with enhanced design
const theme = createTheme({
  palette: {
    primary: {
      main: '#3a86ff',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f72585',
      light: '#ff4d8d',
      dark: '#c81d5e',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#3b82f6',
    },
    success: {
      main: '#10b981',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.03),0px 1px 3px 0px rgba(0,0,0,0.05)',
    '0px 3px 3px -2px rgba(0,0,0,0.05),0px 2px 6px 0px rgba(0,0,0,0.03),0px 1px 8px 0px rgba(0,0,0,0.05)',
    '0px 3px 4px -2px rgba(0,0,0,0.05),0px 3px 8px -1px rgba(0,0,0,0.03),0px 1px 12px 0px rgba(0,0,0,0.05)',
    '0px 2px 5px -1px rgba(0,0,0,0.05),0px 4px 10px -2px rgba(0,0,0,0.03),0px 1px 14px -1px rgba(0,0,0,0.05)',
    '0px 3px 6px -1px rgba(0,0,0,0.05),0px 5px 12px -2px rgba(0,0,0,0.03),0px 1px 18px -1px rgba(0,0,0,0.05)',
    '0px 3px 7px -2px rgba(0,0,0,0.05),0px 6px 14px -1px rgba(0,0,0,0.03),0px 1px 20px -1px rgba(0,0,0,0.05)',
    '0px 4px 8px -2px rgba(0,0,0,0.05),0px 7px 16px -2px rgba(0,0,0,0.03),0px 2px 22px -1px rgba(0,0,0,0.05)',
    '0px 5px 9px -2px rgba(0,0,0,0.05),0px 8px 18px -2px rgba(0,0,0,0.03),0px 3px 24px -2px rgba(0,0,0,0.05)',
    '0px 5px 10px -2px rgba(0,0,0,0.05),0px 9px 20px -2px rgba(0,0,0,0.03),0px 4px 26px -2px rgba(0,0,0,0.05)',
    '0px 6px 11px -3px rgba(0,0,0,0.05),0px 10px 22px -2px rgba(0,0,0,0.03),0px 5px 28px -2px rgba(0,0,0,0.05)',
    '0px 6px 12px -3px rgba(0,0,0,0.05),0px 11px 24px -3px rgba(0,0,0,0.03),0px 6px 30px -3px rgba(0,0,0,0.05)',
    '0px 7px 13px -3px rgba(0,0,0,0.05),0px 12px 26px -3px rgba(0,0,0,0.03),0px 7px 32px -3px rgba(0,0,0,0.05)',
    '0px 7px 14px -4px rgba(0,0,0,0.05),0px 13px 28px -3px rgba(0,0,0,0.03),0px 8px 34px -3px rgba(0,0,0,0.05)',
    '0px 8px 15px -4px rgba(0,0,0,0.05),0px 14px 30px -4px rgba(0,0,0,0.03),0px 9px 36px -3px rgba(0,0,0,0.05)',
    '0px 8px 16px -4px rgba(0,0,0,0.05),0px 15px 32px -4px rgba(0,0,0,0.03),0px 10px 38px -4px rgba(0,0,0,0.05)',
    '0px 9px 17px -4px rgba(0,0,0,0.05),0px 16px 34px -4px rgba(0,0,0,0.03),0px 11px 40px -4px rgba(0,0,0,0.05)',
    '0px 9px 18px -5px rgba(0,0,0,0.05),0px 17px 36px -4px rgba(0,0,0,0.03),0px 12px 42px -4px rgba(0,0,0,0.05)',
    '0px 10px 19px -5px rgba(0,0,0,0.05),0px 18px 38px -5px rgba(0,0,0,0.03),0px 13px 44px -5px rgba(0,0,0,0.05)',
    '0px 10px 20px -5px rgba(0,0,0,0.05),0px 19px 40px -5px rgba(0,0,0,0.03),0px 14px 46px -5px rgba(0,0,0,0.05)',
    '0px 11px 21px -5px rgba(0,0,0,0.05),0px 20px 42px -5px rgba(0,0,0,0.03),0px 15px 48px -5px rgba(0,0,0,0.05)',
    '0px 11px 22px -6px rgba(0,0,0,0.05),0px 21px 44px -6px rgba(0,0,0,0.03),0px 16px 50px -6px rgba(0,0,0,0.05)',
    '0px 12px 23px -6px rgba(0,0,0,0.05),0px 22px 46px -6px rgba(0,0,0,0.03),0px 17px 52px -6px rgba(0,0,0,0.05)',
    '0px 12px 24px -6px rgba(0,0,0,0.05),0px 23px 48px -6px rgba(0,0,0,0.03),0px 18px 54px -6px rgba(0,0,0,0.05)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 16px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 