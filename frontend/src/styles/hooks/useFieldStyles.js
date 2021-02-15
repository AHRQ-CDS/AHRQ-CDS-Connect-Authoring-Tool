import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    field: {
      display: 'flex',
      margin: '10px 0',
      width: '100%'
    },
    fieldInput: {
      margin: '5px 10px 5px 0',
      [theme.breakpoints.down('md')]: {
        margin: '5px 5px 5px 0'
      }
    },
    fieldInputFullWidth: {
      width: '100%'
    },
    fieldInputGroup: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    },
    fieldInputLg: {
      minWidth: '300px',
      maxWidth: '350px'
    },
    fieldInputMd: {
      minWidth: '200px',
      maxWidth: '250px'
    },
    fieldInputSm: {
      minWidth: '100px',
      maxWidth: '150px'
    },
    fieldInputXl: {
      minWidth: '400px',
      maxWidth: '450px'
    },
    fieldLabel: {
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      paddingRight: '1em',
      minWidth: '12.5em',
      textAlign: 'right',
      marginTop: '10px'
    },
    helperText: {
      fontSize: '0.7em',
      color: theme.palette.common.gray
    }
  }),
  { name: 'Fields' }
);
