import { makeStyles } from '@mui/styles';

export default makeStyles(
  theme => ({
    condensedFieldLabel: {
      fontWeight: 600,
      margin: '0'
    },
    condensedFieldInput: {
      margin: '0'
    },
    field: {
      display: 'flex',
      width: '100%'
    },
    fieldCard: {
      position: 'relative',
      padding: '1em 2em',
      marginBottom: '10px'
    },
    fieldCardCloseButton: {
      position: 'absolute',
      right: '10px',
      top: '10px'
    },
    fieldCardFooter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginTop: '1em'
    },
    fieldDisplay: {
      alignItems: 'center',
      display: 'flex',
      width: '100%'
    },
    fieldGroup: {
      width: '100%'
    },
    fieldInput: {
      margin: '10px 10px 10px 0'
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
      minWidth: '150px',
      maxWidth: '200px'
    },
    fieldInputXs: {
      minWidth: '100px',
      maxWidth: '150px'
    },
    fieldInputXl: {
      minWidth: '400px',
      maxWidth: '450px'
    },
    fieldLabel: {
      fontSize: '0.95em',
      fontWeight: 600,
      marginTop: '10px',
      maxWidth: '12.5em',
      minWidth: '12.5em',
      paddingRight: '1em',
      textAlign: 'right'
    },
    fieldLabelGroup: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      display: 'flex',
      justifyContent: 'flex-end',
      lineHeight: '1.2',
      marginTop: '20px'
    },
    fieldLabelNarrow: {
      maxWidth: '7em',
      minWidth: '7em'
    },
    fieldLabelTall: {
      marginTop: '20px'
    },
    helperText: {
      fontSize: '0.7em',
      color: theme.palette.common.gray
    }
  }),
  { name: 'Fields', index: 1 }
);
