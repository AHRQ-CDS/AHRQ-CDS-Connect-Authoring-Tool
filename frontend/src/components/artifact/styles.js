import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    artifactButton: { 
      marginLeft: '10px', 
    },
    artifactForm: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '20px 40px'
    },
    artifactInfo: {
      fontSize: '0.9em',
      color: theme.palette.common.gray
    },
    cpgButton: {
      margin: '20px 12.5em'
    },
    cpgPercentage: {
      height: '20px',
      marginBottom: '5px',
      backgroundColor: theme.palette.common.grayLighter,
      color: theme.palette.common.white,
      borderRadius: '20px',
      width: '100%',
      fontSize: '14px',
      fontWeight: '600'
    },
    cpgPercentageComplete: {
      backgroundColor: theme.palette.common.blue,
      borderRadius: '20px'
    },
    cpgPercentageLabel: {
      padding: '0 8px',
      textAlign: 'right'
    },
    cpgPercentageLabelZero: {
      color: theme.palette.common.blue
    }
  }),
  { name: 'Artifact' }
);
