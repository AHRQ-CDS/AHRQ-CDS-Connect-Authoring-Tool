import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    field: {
      display: 'flex',
      width: '100%'
    },
    fieldButtons: {
      alignItems: 'flex-start',
      display: 'flex',
      whiteSpace: 'nowrap'
    },
    fieldButtonsAlignCenter: {
      alignItems: 'center'
    },
    fieldCard: {
      position: 'relative',
      width: '100%',
      padding: '2em',
      marginBottom: '5px'
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
    fieldDetails: {
      borderBottom: `3px solid ${theme.palette.common.grayLighter}`,
      display: 'flex',
      padding: '10px 0',
      width: '100%'
    },
    fieldDetailsLast: {
      border: 'none',
      marginBottom: '20px'
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
    fieldInputGroupContainer: {
      width: '100%'
    },
    fieldInputGroupJustifyLeft: {
      justifyContent: 'flex-start'
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
    fieldLabelShort: {
      marginTop: '0px',
      paddingBottom: '3px'
    },
    fieldLabelTall: {
      marginTop: '18px'
    },
    fieldLabelTaller: {
      marginTop: '30px'
    },
    fieldLabelWithInput: {
      marginTop: '15px'
    },
    footer: {
      color: theme.palette.common.grayLight,
      fontSize: '0.7em',
      textAlign: 'right',
      whiteSpace: 'nowrap'
    },
    helperText: {
      fontSize: '0.7em',
      color: theme.palette.common.gray
    },
    condensedField: {
      margin: '0'
    },
    nestedField: {
      display: 'block'
    },
    nestedFieldLabel: {
      textAlign: 'left'
    }
  }),
  { name: 'Fields', index: 1 }
);
