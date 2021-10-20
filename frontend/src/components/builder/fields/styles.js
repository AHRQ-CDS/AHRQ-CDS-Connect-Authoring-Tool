import { makeStyles } from '@mui/styles';

export default makeStyles(
  theme => ({
    field: {
      display: 'flex',
      alignItems: 'center',
      margin: '10px 0',
      width: '100%'
    },
    fieldGroup: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      width: '100%'
    },
    fieldLabel: {
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      paddingRight: '1em',
      minWidth: '12.5em',
      textAlign: 'right'
    },
    fieldInput: {
      marginRight: '10px',
      [theme.breakpoints.down('lg')]: {
        margin: '5px 5px 5px 0'
      },
      '&.helper-text': {
        fontSize: '0.7em',
        color: theme.palette.common.gray
      }
    },
    fieldInputSm: {
      minWidth: '100px',
      maxWidth: '150px'
    },
    fieldInputMd: {
      minWidth: '200px',
      maxWidth: '250px'
    },
    fieldInputLg: {
      minWidth: '300px',
      maxWidth: '350px'
    },
    fieldInputXl: {
      minWidth: '400px',
      maxWidth: '450px'
    },
    fieldInputFullWidth: {
      width: '100%'
    }
  }),
  { name: 'Fields', index: 1 }
);
