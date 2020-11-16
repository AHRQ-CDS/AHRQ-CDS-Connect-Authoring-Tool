import { createMuiTheme } from '@material-ui/core/styles';
import deepmerge from 'deepmerge';

const colors = {
  white: '#fff',
  grayLightest: '#f8f8f8',
  grayLighter: '#ececec',
  gray: '#494d55',
  blue: '#1f2f3c',
  blueDark: '#08101c',
  blueLight: '#303e4a',
  red: '#961328'
};

const variables = {
  spacing: {
    globalPadding: '2em'
  },
  border: {
    globalBorderWidth: '0.1em',
    globalBorderRadius: '0.2em',
    globalBorder: `1px solid ${colors.grayLighter}`
  }
};

const typography = {
  fontFamily: [
    'Open Sans',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    'sans-serif'
  ].join(',')
};

const materialUiOverridesBase = {
  MuiAlert: {
    root: {
      alignItems: 'center'
    },
    message: {
      textAlign: 'left'
    }
  },
  MuiButton: {
    root: {
      padding: '8px 24px',
      border: '1px solid transparent',
      '&:focus': {
        outline: 'none'
      },
      '&:hover': {
        borderColor: 'transparent'
      }
    },
    text: {
      padding: '8px 24px'
    },
    containedPrimary: {
      '&:hover': {
        backgroundColor: colors.white,
        color: colors.blue,
        borderColor: colors.blue
      }
    },
    containedSecondary: {
      '&:hover': {
        backgroundColor: colors.blueDark
      }
    }
  },
  MuiButtonBase: {
    root: {
      boxShadow: 'none',
      height: 'inherit',
      '&:hover': {
        color: 'inherit',
        boxShadow: 'none'
      }
    }
  },
  MuiDialogActions: {
    root: {
      borderTop: variables.border.globalBorder,
      padding: `1em ${variables.spacing.globalPadding}`,
      justifyContent: 'space-between'
    }
  },
  MuiDialogContent: {
    root: {
      padding: variables.spacing.globalPadding
    }
  },
  MuiDialogTitle: {
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: variables.border.globalBorder,
      padding: `1em ${variables.spacing.globalPadding}`
    }
  },
  MuiIconButton: {
    root: {
      '&:focus': {
        outline: 'none'
      }
    }
  },
  MuiInputBase: {
    root: {
      backgroundColor: colors.white
    }
  },
  MuiInputLabel: {
    outlined: {
      transform: 'translate(14px, 16px) scale(1)',
      '@media (max-width: 1440px)': {
        transform: 'translate(14px, 10px) scale(1)'
      }
    }
  },
  MuiPaper: {
    root: {
      backgroundColor: colors.white
    }
  },
  MuiSelect: {
    root: {
      padding: '14px 16px',
      '@media (max-width: 1440px)': {
        padding: '10px 16px'
      }
    },
    icon: {
      top: 'calc(50% - 14px)',
      '@media (max-width: 1440px)': {
        top: 'calc(50% - 10px)'
      }
    }
  }
};

const materialUiOverridesDark ={
  MuiIconButton: {
    root: {
      color: colors.grayLighter,
      '&:hover': {
        backgroundColor: colors.blueLight
      }
    }
  },
  MuiPaper: {
    root: {
      backgroundColor: colors.blue
    }
  }
};

const paletteBase = {
  primary: {
    main: colors.blue
  },
  secondary: {
    main: colors.grayLighter
  },
  error: {
    main: colors.red
  },
  common: colors,
  background: {
    default: colors.grayLightest
  },
  text: {
    primary: colors.gray,
    secondary: colors.gray
  },
  grey: {
    800: colors.gray
  }
};

const lightTheme = createMuiTheme({
  typography: { ...typography },
  palette: { ...paletteBase },
  overrides: { ...materialUiOverridesBase },
  variables: { ...variables }
});

const darkTheme = createMuiTheme({
  typography: { ...typography },
  palette: deepmerge(paletteBase, {
    text: {
      primary: colors.white,
      secondary: colors.white
    }
  }),
  overrides: deepmerge(materialUiOverridesBase, materialUiOverridesDark),
  variables: { ...variables }
});

export default lightTheme;
export { lightTheme, darkTheme };
