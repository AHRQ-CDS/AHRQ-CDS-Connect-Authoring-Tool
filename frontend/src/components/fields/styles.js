import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    cpgTag: {
      backgroundColor: theme.palette.common.orange,
      color: theme.palette.common.white,
      fontSize: '0.5em',
      padding: '1px 3px',
      borderRadius: '3px',
      fontWeight: 'bold',
      marginLeft: '5px'
    },
    cpgTagComplete: {
      backgroundColor: theme.palette.common.blue
    },
    dateFieldInput: {
      '& button': {
        padding: '20px 5px'
      }
    },
    groupedFields: {
      display: 'flex',
      alignItems: 'flex-start',
      width: '100%'
    },
    fieldCentered: {
      alignItems: 'center'
    },
    fieldCheckbox: {
      marginLeft: '20px'
    },
    fieldContainer: {
      width: '100%'
    },
    fieldDisplay: {
      display: 'flex',
      alignItems: 'center',
      '& > div': {
        marginLeft: '10px'
      }
    },
    fieldGroup: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      width: '100%'
    },
    fieldGroupButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      width: '100%',
      marginTop: '10px'
    },
    fieldGroupCloseButton: {
      position: 'absolute',
      right: '10px',
      top: '10px'
    },
    fieldGroupContainer: {
      position: 'relative',
      width: '100%',
      padding: '2em',
      flexWrap: 'wrap',
      marginBottom: '10px',
      backgroundColor: theme.palette.common.grayLighter
    },
    fieldGroups: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    },
    fieldTable: {
      margin: '20px 0',
      padding: '0 20px',
      backgroundColor: theme.palette.common.white
    },
    list: {
      fontSize: '0.8em',
      marginBottom: '20px',
      padding: '20px'
    },
    listItem: {
      '& a': {
        fontStyle: 'italic',
        marginLeft: '10px'
      }
    },
    listText: {
      marginTop: '10px',
      fontSize: '0.9em'
    },
    required: {
      color: theme.palette.common.red
    },
    selectConditionField: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  }),
  { name: 'Artifact-Fields', index: 1 }
);
