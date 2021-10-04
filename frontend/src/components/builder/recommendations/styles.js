import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    addSubpopulation: {
      alignItems: 'center',
      display: 'flex'
    },
    addSubpopulationClear: {
      height: '50px',
      width: '50px'
    },
    buttonHighlight: {
      color: theme.palette.common.blueHighlight
    },
    linkDropdown: {
      height: '54px',
      [theme.breakpoints.up('xxl')]: {
        height: '62px'
      }
    },
    linkInput: {
      '& label': {
        lineHeight: '2.4em',
        [theme.breakpoints.up('xxl')]: {
          lineHeight: '1.4em'
        }
      }
    },
    linkText: {
      marginRight: '0',
      width: '100%'
    },
    recommendationCardActions: {
      position: 'absolute',
      right: '20px',
      top: '20px'
    },
    recommendationCardContent: {
      padding: '0 40px'
    },
    recommendationCardHeaderContent: {
      margin: '1.5em 10px 0 0'
    },
    recommendationCardHeader: {
      position: 'relative',
      '& .MuiCardHeader-action': {
        marginTop: 0
      },
      '& .MuiCardHeader-content': {
        padding: '0 20px'
      },
      '& .MuiCardHeader-title': {
        marginLeft: 0
      }
    },
    recommendationInput: {
      marginTop: '0.5em'
    },
    recommendationInputHeader: {
      marginBottom: '1em'
    },
    recommendationSubpopulation: {
      alignItems: 'center',
      backgroundColor: theme.palette.common.white,
      display: 'flex',
      justifyContent: 'space-between',
      margin: '1em 0',
      padding: '0.4em 1em'
    },
    recommendationSubpopulations: {
      margin: '1em 0'
    }
  }),
  { name: 'Recommendations', index: 1 }
);
