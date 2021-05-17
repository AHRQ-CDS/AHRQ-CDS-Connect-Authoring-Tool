import { createMuiTheme } from '@material-ui/core/styles';
import deepmerge from 'deepmerge';

const breakpoints = {
  values: {
    xs: 0,
    sm: 480,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1440
  }
};

const colors = {
  ahrqDarkBlue: '#1e2f40',
  ahrqGray: '#4a5968',
  ahrqLightBlue: '#6693ee',
  black: '#333',
  blue: '#1f2f3c',
  blueDark: '#08101c',
  blueDarker: '#192732',
  blueDarkest: '#071119',
  blueHighlight: '#5178a4',
  blueLight: '#303e4a',
  blueLink: '#266798',
  blueLinkLight: '#2e7eba',
  gray: '#494d55',
  grayBlue: '#24394a',
  grayDark: '#323a45',
  grayLight: '#646974',
  grayLighter: '#e9ecef',
  grayLightest: '#f8f8f8',
  green: '#36a0a0',
  orange: '#fd7e14',
  red: '#961328',
  redLight: '#e1756a',
  white: '#fff',
  yellow: '#b48e43'
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
  MuiAccordion: {
    root: {
      boxShadow: 'none'
    }
  },
  MuiAccordionSummary: {
    root: {
      borderRadius: '5px',
      '&:hover': {
        backgroundColor: colors.grayLighter
      },
      '&.Mui-expanded': {
        backgroundColor: colors.grayLighter,
        minHeight: 'inherit'
      }
    },
    content: {
      margin: '0',
      '&.Mui-expanded': {
        margin: '0'
      }
    }
  },
  MuiAlert: {
    root: {
      alignItems: 'center'
    },
    message: {
      textAlign: 'left'
    }
  },
  MuiAutocomplete: {
    inputRoot: {
      '&[class*="MuiOutlinedInput-root"]': {
        '& $input': {
          padding: '5px',
          '@media (max-width: 1440px)': {
            padding: '1.5px'
          }
        }
      }
    },
    option: {
      fontSize: '0.8em'
    },
    popupIndicatorOpen: {
      transform: 'none'
    }
  },
  MuiButton: {
    root: {
      padding: '8px 24px',
      border: '1px solid transparent',
      borderRadius: 0,
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
    contained: {
      backgroundColor: colors.white,
      borderColor: colors.grayLighter,
      '&:hover': {
        backgroundColor: colors.grayLighter
      }
    },
    containedPrimary: {
      borderColor: colors.blue,
      '&:hover': {
        backgroundColor: colors.white,
        color: colors.blue,
        borderColor: colors.blue
      },
      '&.Mui-disabled': {
        borderColor: 'transparent'
      }
    },
    containedSecondary: {
      borderColor: colors.red,
      '&:hover': {
        backgroundColor: colors.white,
        color: colors.red,
        borderColor: colors.red
      },
      '&.Mui-disabled': {
        borderColor: 'transparent'
      }
    }
  },
  MuiButtonBase: {
    root: {
      boxShadow: 'none',
      height: 'inherit',
      '&:hover': {
        boxShadow: 'none'
      }
    }
  },
  MuiCard: {
    root: {
      backgroundColor: colors.grayLightest,
      margin: '1em 0'
    }
  },
  MuiCardActions: {
    root: {
      borderTop: `1px solid ${colors.grayLighter}`,
      padding: '20px'
    }
  },
  MuiCardContent: {
    root: {
      padding: '10px 20px',
      '&:last-child': {
        paddingBottom: '10px'
      }
    }
  },
  MuiCardHeader: {
    root: {
      borderBottom: `1px solid ${colors.grayLighter}`,
      padding: '20px'
    },
    title: {
      fontSize: '1.2em',
      marginLeft: '20px'
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
  MuiFormLabel: {
    root: {
      opacity: '0.7',

      '&$focused, &$filled': {
        opacity: '1'
      }
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
  MuiLink: {
    root: {
      color: colors.blueLink
    }
  },
  MuiOutlinedInput: {
    input: {
      padding: '14px',
      '@media (max-width: 1440px)': {
        padding: '10px'
      }
    }
  },
  MuiPaper: {
    root: {
      backgroundColor: colors.white
    }
  },
  MuiPickersBasePicker: {
    pickerView: {
      maxWidth: 'inherit'
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
  },
  MuiTooltip: {
    arrow: {
      color: colors.black
    },
    tooltip: {
      backgroundColor: colors.black,
      fontSize: '0.8em'
    }
  }
};

const materialUiOverridesDark = {
  MuiButton: {
    contained: {
      backgroundColor: colors.white,
      '&:hover': {
        backgroundColor: colors.blue,
        color: colors.white,
        borderColor: colors.white
      },
      '&$disabled': {
        backgroundColor: colors.white,
        color: colors.black
      }
    }
  },
  MuiIconButton: {
    root: {
      color: colors.grayLighter,
      '&:hover': {
        backgroundColor: colors.blueLight
      }
    }
  },
  MuiInputBase: {
    root: {
      backgroundColor: 'transparent'
    },
    input: {
      '&:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 100px ${colors.blueLink} inset`,
        WebkitTextFillColor: colors.white,
        borderTopLeftRadius: 'inherit',
        borderTopRightRadius: 'inherit'
      }
    }
  },
  MuiInputLabel: {
    root: {
      color: colors.white,
      '&.Mui-focused': {
        color: colors.white
      }
    }
  },
  MuiLink: {
    root: {
      color: colors.white,
      fontWeight: 'bold',
      '&:hover, &:focus': {
        color: colors.white
      }
    }
  },
  MuiOutlinedInput: {
    root: {
      '&$focused $notchedOutline': {
        borderColor: colors.white
      }
    },
    notchedOutline: {
      borderColor: colors.white
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
    main: colors.red
  },
  error: {
    main: colors.red
  },
  common: colors,
  background: {
    default: colors.grayLighter
  },
  text: {
    primary: colors.gray,
    secondary: colors.gray
  },
  grey: {
    800: colors.gray
  }
};

const paletteDark = {
  error: {
    main: colors.redLight
  },
  text: {
    primary: colors.white,
    secondary: colors.white,
    error: colors.redLight
  }
};

const lightTheme = createMuiTheme({
  breakpoints: { ...breakpoints },
  typography: { ...typography },
  palette: { ...paletteBase },
  overrides: { ...materialUiOverridesBase },
  variables: { ...variables }
});

const darkTheme = createMuiTheme({
  breakpoints: { ...breakpoints },
  typography: { ...typography },
  palette: deepmerge(paletteBase, paletteDark),
  overrides: deepmerge(materialUiOverridesBase, materialUiOverridesDark),
  variables: { ...variables }
});

export default lightTheme;
export { lightTheme, darkTheme };
