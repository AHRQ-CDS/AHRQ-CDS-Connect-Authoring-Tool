import { createTheme } from '@mui/material/styles';
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
    styleOverrides: {
      root: {
        boxShadow: 'none'
      }
    }
  },
  MuiAccordionSummary: {
    styleOverrides: {
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
    }
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        alignItems: 'center'
      },
      message: {
        textAlign: 'left'
      }
    }
  },
  MuiAutocomplete: {
    styleOverrides: {
      option: {
        fontSize: '0.8em'
      },
      popupIndicatorOpen: {
        transform: 'none'
      }
    }
  },
  MuiButton: {
    styleOverrides: {
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
      containedInherit: {
        backgroundColor: colors.white,
        borderColor: colors.grayLighter,
        '&:hover': {
          backgroundColor: colors.grayLighter
        }
      },
      containedPrimary: {
        backgroundColor: colors.blue,
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
        backgroundColor: colors.red,
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
    }
  },
  MuiButtonBase: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        height: 'inherit',
        '&:hover': {
          boxShadow: 'none'
        }
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundColor: colors.grayLightest,
        margin: '1em 0'
      }
    }
  },
  MuiCardActions: {
    styleOverrides: {
      root: {
        borderTop: `1px solid ${colors.grayLighter}`,
        padding: '20px'
      }
    }
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '1em'
      }
    }
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        borderBottom: `1px solid ${colors.grayLighter}`,
        padding: '20px'
      },
      title: {
        fontSize: '1.2em',
        marginLeft: '20px'
      },
      action: {
        marginTop: '10px'
      }
    }
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        borderTop: variables.border.globalBorder,
        padding: `1em ${variables.spacing.globalPadding}`,
        justifyContent: 'space-between'
      }
    }
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: variables.spacing.globalPadding
      }
    }
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: variables.border.globalBorder,
        padding: `1em ${variables.spacing.globalPadding}`
      }
    }
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        opacity: '0.7',

        '&.Mui-focused, &.Mui-filled': {
          opacity: '1'
        }
      }
    }
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        '&:focus': {
          outline: 'none'
        }
      }
    }
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        backgroundColor: colors.white
      },
      hiddenLabel: {
        '& fieldset': {
          top: 0
        },
        '& legend': {
          display: 'none'
        }
      }
    }
  },
  MuiLink: {
    defaultProps: {
      underline: 'hover'
    },
    styleOverrides: {
      root: {
        color: colors.blueLink
      }
    }
  },
  MuiListSubheader: {
    styleOverrides: {
      sticky: {
        backgroundColor: colors.white,
        color: colors.grayLight
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundColor: colors.white
      }
    }
  },
  MuiPickersBasePicker: {
    styleOverrides: {
      pickerView: {
        maxWidth: 'inherit'
      }
    }
  },
  MuiTableCell: {
    styleOverrides: {
      head: {
        whiteSpace: 'nowrap'
      }
    }
  },
  MuiTextField: {
    defaultProps: {
      margin: 'dense',
      size: 'small'
    }
  },
  MuiTooltip: {
    styleOverrides: {
      arrow: {
        color: colors.black
      },
      tooltip: {
        backgroundColor: colors.black,
        fontSize: '0.8em'
      }
    }
  }
};

const materialUiOverridesDark = {
  MuiButton: {
    styleOverrides: {
      colorInherit: {
        color: colors.blue,
        '&:hover': {
          color: colors.blue
        },
        '&.Mui-disabled': {
          color: colors.grayLight
        }
      },
      contained: {
        backgroundColor: colors.white,
        '&:hover': {
          backgroundColor: colors.blue,
          color: colors.white,
          borderColor: colors.white
        },
        '&.Mui-disabled': {
          backgroundColor: colors.gray,
          borderColor: colors.gray,
          color: colors.black
        }
      }
    }
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        color: colors.grayLighter,
        '&:hover': {
          backgroundColor: colors.blueLight
        }
      }
    }
  },
  MuiInputBase: {
    styleOverrides: {
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
    }
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: colors.white,
        '&.Mui-focused': {
          color: colors.white
        }
      }
    }
  },
  MuiLink: {
    styleOverrides: {
      root: {
        color: colors.white,
        fontWeight: 'bold',
        '&:hover, &:focus': {
          color: colors.white
        }
      }
    }
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: colors.white
        }
      },
      notchedOutline: {
        borderColor: colors.white
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundColor: colors.blue
      }
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

const lightTheme = createTheme({
  breakpoints,
  components: materialUiOverridesBase,
  palette: paletteBase,
  typography,
  variables
});

const darkTheme = createTheme({
  breakpoints,
  components: deepmerge(materialUiOverridesBase, materialUiOverridesDark),
  palette: deepmerge(paletteBase, paletteDark),
  typography,
  variables
});

export default lightTheme;
export { lightTheme, darkTheme };
