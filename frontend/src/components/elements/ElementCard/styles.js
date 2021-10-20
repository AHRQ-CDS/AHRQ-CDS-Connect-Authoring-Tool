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
      borderLeft: `4px solid ${theme.palette.common.grayLighter}`,
      fontSize: '0.8em',
      margin: '20px 0',
      padding: '0 20px',
      '& span': {
        display: 'inline-block',
        margin: '2px 3px'
      }
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
    }
  }),
  { name: 'ElementCard', index: 1 }
);
