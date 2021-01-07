import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    root: {
      marginTop: '5px'
    },
    loginButton: {
      borderColor: theme.palette.common.white,
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: theme.palette.common.blue
      },
      '& .MuiCircularProgress-indeterminate': {
        color: theme.palette.common.white
      }
    },
    logoutButton: {
      color: theme.palette.common.white,
      textTransform: 'none',
      fontWeight: '600'
    },
    disclaimer: {
      fontSize: '0.8em',
      marginBottom: '40px'
    },
    forgotPassword: {
      fontSize: '0.8em',
      '& a': {
        color: theme.palette.common.blueLinkLight
      }
    },
    input: {
      margin: '10px 0'
    }
  }),
  { name: 'Auth' }
);
