import { makeStyles } from '@mui/styles';

export default makeStyles(
  theme => ({
    closeButton: {
      float: 'right'
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
    helpLinkRow: {
      display: 'flex'
    },
    helpLink: {
      margin: '2em 0 2em auto'
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
  { name: 'Testing', index: 1 }
);
