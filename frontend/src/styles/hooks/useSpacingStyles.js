import { makeStyles } from '@mui/styles';

export default makeStyles(
  theme => ({
    alignCenter: {
      alignItems: 'center'
    },
    center: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      margin: '2em 0'
    },
    globalPadding: {
      margin: 'auto',
      [theme.breakpoints.up('xl')]: {
        width: '1170px'
      },
      [theme.breakpoints.down('xl')]: {
        width: '970px'
      },
      [theme.breakpoints.down('lg')]: {
        width: '750px'
      },
      [theme.breakpoints.down('md')]: {
        width: '100%'
      }
    },
    horizontalPadding: {
      margin: '0 10px'
    },
    indent: {
      borderLeft: `4px solid ${theme.palette.common.grayLighter}`,
      margin: '10px 0',
      paddingLeft: '1em'
    },
    fullBleed: {
      margin: '0 -9999rem',
      padding: '0 9999rem'
    },
    fullWidth: {
      width: '100%'
    },
    marginLeft: {
      marginLeft: '10px'
    },
    marginRight: {
      marginRight: '10px'
    },
    marginTop: {
      marginTop: '20px'
    },
    marginTopHalf: {
      marginTop: '10px'
    },
    minHeight: {
      minHeight: '500px'
    },
    paddingRight: {
      paddingRight: '10px'
    },
    verticalPadding: {
      margin: '2em 0'
    }
  }),
  { name: 'Spacing', index: 1 }
);
