import { makeStyles } from '@mui/styles';

export default makeStyles(
  theme => ({
    collapsedErrors: {
      display: 'inline-block',
      marginLeft: '170px'
    },
    collapsedContent: {
      alignItems: 'center',
      display: 'flex'
    },
    expressionPhrase: {
      fontSize: '0.95em',
      '& span': {
        display: 'inline-block'
      }
    },
    expressionBorder: {
      margin: '20px 0',
      borderLeft: `4px solid ${theme.palette.common.grayLighter}`,
      padding: '0 20px'
    },
    expressionPhraseClosed: {
      fontSize: '0.8em'
    },
    expressionText: {
      margin: '5px 0',
      padding: '5px 5px 5px 0'
    },
    expressionTag: {
      backgroundColor: theme.palette.common.blueHighlight,
      borderRadius: '20px',
      color: theme.palette.common.white,
      cursor: 'default',
      margin: '2px 5px',
      padding: '4px 10px'
    },
    expressionType: {
      fontWeight: 700
    },
    odd: {
      backgroundColor: '#f8f8f8'
    },
    even: {
      backgroundColor: '#fff'
    },
    baseElement: {
      // Base Element color overwrites even/odd background color
      backgroundColor: '#d6e0eb',
      borderColor: '#92acc9'
    }
  }),
  { name: 'ElementCard', index: 1 }
);
