import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    elementSelect: {
      alignItems: 'flex-start',
      display: 'flex',
      justifyContent: 'space-between',
      margin: '1em'
    },
    elementSelectDropdowns: {
      '& .MuiTextField-root': {
        marginBottom: '10px'
      }
    },
    elementSelectGroup: {
      display: 'flex',
      marginTop: '10px'
    },
    elementSelectLabel: {
      display: 'flex',
      fontWeight: 'bold',
      marginTop: '10px',
      minWidth: '250px'
    }
  }),
  { name: 'Element-Select', index: 1 }
);
