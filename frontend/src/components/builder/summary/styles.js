import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    metaData: {
      padding: '1em 0',
      width: '80%'
    },
    metaDataLabel: {
      display: 'inline-block',
      fontWeight: 'bold',
      marginRight: '20px',
      textAlign: 'right',
      width: '140px'
    },
    summaryCardContent: {
      alignItems: 'flex-start',
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%'
    },
    summaryCardContentGroup: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    },
    summaryCardOdd: {
      backgroundColor: theme.palette.common.white
    },
    summaryCardHeader: {
      margin: '12px 0'
    },
    summaryCardOperand: {
      textTransform: 'uppercase'
    },
    summaryCardRoot: {
      margin: '30px 0'
    },
    summaryDetails: {
      margin: '2em 0'
    },
    summaryDetailsHeader: {
      marginTop: '30px'
    },
    summaryHeader: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between'
    }
  }),
  { name: 'Summary' }
);
