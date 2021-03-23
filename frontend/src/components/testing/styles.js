import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    closeButton: {
      float: 'right'
    },
    dropZoneIcon: {
      fontSize: '5em'
    },
    dropZoneSection: {
      '& .dropzone': {
        borderColor: theme.palette.common.gray,
        borderRadius: '1em',
        borderStyle: 'dashed',
        borderWidth: '0.25em',
        cursor: 'pointer',
        margin: 'auto',
        padding: '2em 1em',
        textAlign: 'center',
        '&:focus': {
          borderColor: theme.palette.common.green,
          outline: 'none'
        }
      }
    },
    dropZoneWarning: {
      color: theme.palette.common.red,
      fontSize: '0.9em',
      fontStyle: 'italic',
      margin: '10px 60px'
    },
    patientCard: {
      alignItems: 'center',
      backgroundColor: theme.palette.common.grayLighter,
      borderRadius: '5px',
      display: 'flex',
      marginBottom: '20px',
      padding: '20px'
    },
    patientCardDemographics: {
      display: 'flex',
      '& div': {
        color: theme.palette.common.gray,
        fontSize: '0.9em',
        marginRight: '40px'
      }
    },
    patientCardIcon: {
      fontSize: '3em',
      margin: '0 40px 0 20px'
    },
    patientCardName: {
      fontSize: '1.5em'
    },
    patientsTableButtons: {
      margin: '2em 0',
      '& button': {
        marginRight: '20px'
      }
    },
    testerInstructions: {
      backgroundColor: theme.palette.common.grayLighter,
      borderRadius: '0.2em',
      fontStyle: 'italic',
      marginBottom: '1em',
      padding: '0.75em 1em'
    },
    testResults: {
      backgroundColor: theme.palette.common.grayLighter,
      padding: '2em'
    },
    testResultsSection: {
      '& .Mui-expanded': {
        backgroundColor: theme.palette.common.gray,
        color: theme.palette.common.white
      },
      '& .MuiAccordionSummary-root:hover': {
        backgroundColor: theme.palette.common.gray,
        color: theme.palette.common.white
      },
      '& .MuiAccordionSummary-root:hover .MuiSvgIcon-root': {
        fill: theme.palette.common.white
      }
    },
    testResultsPatientIcon: {
      marginRight: '10px'
    },
    testResultsPatientName: {
      fontWeight: '600'
    },
    testResultsTitle: {
      textAlign: 'center',
      fontSize: '1.2em',
      fontWeight: 'bold',
      marginBottom: '2em'
    },
    trueIcon: {
      fill: theme.palette.common.green
    },
    falseIcon: {
      fill: theme.palette.common.red
    },
    versionButtons: {
      marginTop: '1em',
      '& button': {
        marginRight: '10px'
      }
    }
  }),
  { name: 'Testing' }
);
