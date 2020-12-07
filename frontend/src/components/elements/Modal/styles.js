import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1)
    },
    cancelButton: {
      marginRight: '0.5em',
    },
    header: {
      flex: 'none',
      padding: 0
    },
    titleIcon: {
      marginRight: '1em'
    },
    footerButtons: {
      whiteSpace: 'nowrap'
    }
  }),
  { name: 'Modal' }
);
