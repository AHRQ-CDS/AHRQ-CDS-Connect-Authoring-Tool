import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
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
    indent: {
      margin: '10px 0',
      paddingLeft: '1em',
      borderLeft: `4px solid ${theme.palette.common.grayLighter}`
    },
    fullBleed: {
      margin: '0 -9999rem',
      padding: '0 9999rem'
    },
    minHeight: {
      minHeight: '500px'
    },
    verticalPadding: {
      marginTop: '2em',
      marginBottom: '2em'
    }
  }),
  { name: 'Spacing' }
);
