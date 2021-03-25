import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
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
    templateFieldDisplayGroup: {
      width: '100%'
    }
  }),
  { name: 'Templates' }
);
