import { createTheme } from '@mui/material/styles';

// Create a theme instance
export const theme = createTheme({
  palette: {
    primary: {
      main: '#006d9e',
      '50': '#e3f2fd',
      '800': '#01579b',
    },
    info: {
      main: '#0288d1',
      '50': '#e1f5fe',
      '200': '#81d4fa',
      '700': '#0288d1',
      '800': '#0277bd',
    },
    grey: {
      '50': '#fafafa',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});