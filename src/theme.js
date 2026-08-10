import { createTheme } from '@mui/material/styles';

// Truecaller-style palette: a vivid blue-to-cyan gradient for the header and
// primary actions, white cards with soft shadows and generous rounding.
export const GRADIENT_PRIMARY = 'linear-gradient(135deg, #0061FF 0%, #00C2FF 100%)';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f4f7fb',
      paper: '#ffffff',
    },
    primary: {
      main: '#0A6CFF',
      dark: '#0047CC',
      light: '#4E9CFF',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00C2FF',
    },
    text: {
      primary: '#10131a',
      secondary: '#5b6472',
    },
    divider: '#e4e9f0',
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 700 },
    subtitle2: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 16px rgba(10, 40, 90, 0.07)',
          border: '1px solid rgba(10, 40, 90, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 700,
          paddingLeft: 20,
          paddingRight: 20,
        },
        containedPrimary: {
          backgroundImage: GRADIENT_PRIMARY,
          boxShadow: '0 6px 16px rgba(10, 108, 255, 0.3)',
          '&:hover': {
            backgroundImage: GRADIENT_PRIMARY,
            boxShadow: '0 8px 20px rgba(10, 108, 255, 0.4)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 999,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px #ffffff inset',
            WebkitTextFillColor: '#10131a',
            caretColor: '#10131a',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: GRADIENT_PRIMARY,
          color: '#ffffff',
          boxShadow: '0 6px 20px rgba(10, 108, 255, 0.25)',
        },
      },
    },
  },
});

export default theme;
