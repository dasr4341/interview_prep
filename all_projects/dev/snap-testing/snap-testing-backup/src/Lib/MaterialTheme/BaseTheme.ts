import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    yellow: Palette['primary'];
  }

  interface PaletteOptions {
    yellow?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    yellow: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    yellow: true;
  }
}

const theme = createTheme({
  palette: {
    yellow: {
      main: '#E6BA29',
      contrastText: '#484848',
    },
  },
});

export default theme;
