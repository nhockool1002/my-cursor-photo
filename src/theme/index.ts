import { createTheme } from '@mui/material/styles';

const baseTheme = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontFamily: '"Exo 2", sans-serif',
      fontWeight: 600,
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h3: {
      fontFamily: '"Exo 2", sans-serif',
      fontWeight: 600,
      fontSize: '1.75rem',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    h4: {
      fontFamily: '"Exo 2", sans-serif',
      fontWeight: 500,
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    h5: {
      fontFamily: '"Exo 2", sans-serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      '@media (max-width:600px)': {
        fontSize: '0.9rem',
      },
    },
    h6: {
      fontFamily: '"Exo 2", sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      '@media (max-width:600px)': {
        fontSize: '0.8rem',
      },
    },
    subtitle1: {
      fontFamily: '"Exo 2", sans-serif',
      fontWeight: 400,
    },
    subtitle2: {
      fontFamily: '"Exo 2", sans-serif',
      fontWeight: 400,
    },
    body1: {
      fontFamily: '"Exo 2", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Exo 2", sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Exo 2", sans-serif',
      fontWeight: 500,
      textTransform: 'none' as const,
    },
    caption: {
      fontFamily: '"Exo 2", sans-serif',
      fontWeight: 400,
    },
    overline: {
      fontFamily: '"Exo 2", sans-serif',
      fontWeight: 400,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '6px',
            '& .MuiSvgIcon-root': {
              fontSize: '1.2rem',
            },
          },
        },
      },
    },
  },
};

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  },
}); 