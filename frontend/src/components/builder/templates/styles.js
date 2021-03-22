import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    templateField: {
      display: 'flex'
    },
    templateFieldButtons: {
      alignItems: 'flex-start',
      display: 'flex',
      whiteSpace: 'nowrap'
    },
    templateFieldDetails: {
      borderBottom: `1px solid ${theme.palette.common.grayLight}`,
      display: 'flex',
      justifyContent: 'space-between',
      padding: '5px 0',
      width: '100%'
    },
    templateFieldDisplay: {
      alignItems: 'center',
      display: 'flex',
      width: '100%'
    },
    templateFieldDisplayPadded: {
      alignItems: 'center',
      display: 'flex',
      padding: '1em 0',
      width: '100%'
    },
    templateFieldDisplayGroup: {
      width: '100%'
    },
    templateFieldLabel: {
      fontWeight: 'bold',
      margin: '20px 1em 0 0',
      minWidth: '12.5em',
      textAlign: 'right',
      whiteSpace: 'nowrap'
    }
  }),
  { name: 'Templates' }
);
