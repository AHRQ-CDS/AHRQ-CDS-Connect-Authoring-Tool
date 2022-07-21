import { makeStyles } from '@mui/styles';

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
    },
    // Even/odd color is opposite from groups because this is rendered within a group with the same parity
    // So an "even" (grey) group gets an "even" element select, but that needs to be white ("odd" color)
    odd: {
      backgroundColor: '#fff'
    },
    even: {
      backgroundColor: '#f8f8f8'
    }
  }),
  { name: 'Element-Select', index: 1 }
);
