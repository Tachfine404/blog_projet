import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5D3FD3', // Mauve foncé
      light: '#7B68EE',
      dark: '#483D8B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D4AF37', // Doré
      light: '#FFD700',
      dark: '#B8860B',
      contrastText: '#000000',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
      dark: '#000000',
    },
    text: {
      primary: '#2C2C2C', // Gris foncé
      secondary: '#666666',
      disabled: '#999999',
    },
    divider: '#2C2C2C',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#000000',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#000000',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#000000',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#000000',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#000000',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#000000',
    },
    subtitle1: {
      fontSize: '1.1rem',
      color: '#2C2C2C',
    },
    subtitle2: {
      fontSize: '0.9rem',
      color: '#2C2C2C',
    },
    body1: {
      fontSize: '1rem',
      color: '#2C2C2C',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#2C2C2C',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#5D3FD3',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
          color: '#FFFFFF',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(93, 63, 211, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#2C2C2C',
            },
            '&:hover fieldset': {
              borderColor: '#5D3FD3',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5D3FD3',
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#5D3FD3',
          '& .MuiTableCell-root': {
            color: '#FFFFFF',
            fontWeight: 600,
          },
        },
      },
    },
  },
});

export default theme;
