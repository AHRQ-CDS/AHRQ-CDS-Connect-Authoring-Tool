import { makeStyles } from '@mui/styles';

export default makeStyles(
  theme => ({
    root: {
      backgroundColor: theme.palette.common.blueDarkest
    },
    workspace: {
      margin: '0 auto',
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
    header: {
      display: 'flex',
      alignItems: 'center',
      padding: '1em 0'
    },
    heading: {
      color: theme.palette.common.white,
      flex: 1,
      margin: '0',
      paddingRight: '1em',
      fontSize: '1.3em'
    },
    headerButton: {
      color: theme.palette.common.white,
      marginRight: '10px'
    },
    buttonBar: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '5px',
      marginTop: '5px'
    },
    buttonBarButton: {
      marginRight: '10px'
    },
    statusMessage: {
      height: '30px',
      color: theme.palette.common.white,
      fontStyle: 'italic',
      textAlign: 'right'
    },
    body: {
      margin: '0 -9999rem',
      padding: '0 9999rem',
      background: theme.palette.common.white,
      minHeight: '500px'
    },
    tabList: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '0 -9999rem',
      padding: '0 9999rem',
      background: theme.palette.common.blueDarkest,
      position: 'sticky',
      top: '0',
      zIndex: '2'
    },
    tab: {
      alignItems: 'center',
      borderRadius: '0.2em 0.2em 0 0',
      cursor: 'pointer',
      display: 'flex',
      flexGrow: '1',
      justifyContent: 'space-around',
      listStyle: 'none',
      margin: '0 0.25em',
      padding: '0.65em',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      backgroundColor: theme.palette.common.blue,
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: theme.palette.common.grayDark
      },
      fontSize: '0.72em',
      [theme.breakpoints.down('xxl')]: {
        fontSize: '1em'
      },
      [theme.breakpoints.down('xl')]: {
        fontSize: '0.85em'
      },
      [theme.breakpoints.down('lg')]: {
        fontSize: '0.72em'
      }
    },
    tabSelected: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
      '&:hover': {
        // Don't change the background when selected tab is hovered
        backgroundColor: theme.palette.common.white
      }
    },
    tabIndicator: {
      fontSize: '1.1em'
    },
    tabIndicatorError: {
      fontSize: '1.1em',
      color: theme.palette.common.redLight
    },
    blurb: {
      marginBottom: '20px',
      fontSize: '0.9em',
      fontStyle: 'italic'
    }
  }),
  { name: 'Workspace', index: 1 }
);
