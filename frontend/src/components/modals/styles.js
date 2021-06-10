import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    alert: {
      margin: '20px 0'
    },
    content: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '300px'
    },
    header: {
      borderBottom: `1px solid ${theme.palette.common.grayLighter}`,
      padding: '0 1em 10px 1em',
      margin: 0
    },
    headerIndicator: {
      backgroundColor: theme.palette.common.blue,
      borderRadius: '1px',
      display: 'inline-block',
      height: '30px',
      marginRight: '10px',
      width: '3px'
    },
    headerIndicatorHighlight: {
      backgroundColor: theme.palette.common.blueHighlight
    },
    headerIndicatorLabel: {
      fontWeight: 'bold',
      marginRight: '10px'
    },
    headerTag: {
      alignItems: 'center',
      display: 'flex',
      margin: '10px 0'
    },
    list: {
      backgroundColor: theme.palette.common.blueDarker,
      fontSize: '0.8em',
      margin: '10px 0 20px 0',
      padding: '20px'
    },
    listItem: {
      '& a': {
        fontStyle: 'italic',
        marginLeft: '10px'
      }
    },
    iconButton: {
      height: '50px',
      width: '50px'
    },
    form: {
      alignItems: 'center',
      display: 'flex',
      flex: '1'
    },
    formInput: {
      flex: '1',
      marginRight: '10px'
    },
    searchContainer: {
      backgroundColor: theme.palette.common.grayLightest,
      borderBottom: `0.1em solid ${theme.palette.common.grayLighter}`,
      display: 'flex',
      padding: '1em 2em'
    }
  }),
  { name: 'Builder-Modals', index: 1 }
);
