import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    globalPadding: {
      margin: 'auto',
      [theme.breakpoints.down('xl')]: {
        width: '1170px'
      },
      [theme.breakpoints.down('lg')]: {
        width: '970px'
      },
      [theme.breakpoints.down('md')]: {
        width: '750px'
      },
      [theme.breakpoints.down('sm')]: {
        width: '100%'
      }
    },
    fullBleed: {
      margin: '0 -9999rem',
      padding: '0 9999rem'
    }
  }),
  { name: 'Spacing' }
);
