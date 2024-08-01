import { makeStyles } from '@mui/styles';

export default makeStyles(
  theme => ({
    action: {
      marginBottom: '1em',
      padding: '1em',
      background: theme.palette.common.white,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    actionTitle: {
      fontWeight: 'bold'
    }
  }),
  { name: 'Suggestions', index: 1 }
);
