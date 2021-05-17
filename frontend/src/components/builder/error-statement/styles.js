import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    errorStatement: {
      margin: '1em 2em 2em 2em'
    },
    errorStatementButton: {
      display: 'block'
    },
    errorStatementButtonElse: {
      paddingTop: '20px'
    },
    errorStatementContent: {
      borderLeft: `3px solid ${theme.palette.common.gray}`,
      paddingLeft: '28px',
      position: 'relative'
    },
    errorStatementContentIndent: {
      paddingLeft: '108px'
    },
    errorStatementHeader: {
      alignItems: 'center',
      display: 'flex',
      padding: '10px 0',
      position: 'relative'
    },
    label: {
      display: 'flex',
      minWidth: '110px'
    },
    labelText: {
      alignItems: 'center',
      backgroundColor: theme.palette.common.grayLighter,
      borderRadius: '5px',
      display: 'flex',
      fontSize: '0.8em',
      fontWeight: '600',
      height: '35px',
      marginLeft: '30px',
      padding: '5px 10px',
      whiteSpace: 'nowrap'
    },
    labelCorner: {
      backgroundColor: theme.palette.common.gray,
      bottom: '0',
      left: '0',
      overflow: 'hidden',
      position: 'absolute',
      top: '50%',
      width: '3px'
    },
    labelLine: {
      backgroundColor: theme.palette.common.gray,
      height: '3px',
      position: 'absolute',
      top: '50%',
      width: '20px'
    },
    warningBanner: {
      paddingTop: '20px'
    },
    warningTag: {
      alignItems: 'center',
      backgroundColor: 'inherit',
      border: `1px solid ${theme.palette.common.red}`,
      borderRadius: '5px',
      color: theme.palette.common.red,
      display: 'flex-inline',
      fontSize: '0.9em',
      fontWeight: '600',
      height: '35px',
      padding: '5px 10px',
      whiteSpace: 'nowrap'
    }
  }),
  { name: 'Error-Statement' }
);
