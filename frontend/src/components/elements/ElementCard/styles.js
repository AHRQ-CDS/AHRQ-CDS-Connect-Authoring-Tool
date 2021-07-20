import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    buttonHighlight: {
      color: theme.palette.common.blueHighlight
    },
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
    },
    titleField: {
      margin: '0 10px',
      width: '100%'
    },
    titleGroup: {
      alignItems: 'center',
      display: 'flex'
    },
    titleLabel: {
      fontSize: '0.8em',
      fontWeight: 600,
      marginRight: '1em',
      minWidth: '150px',
      textAlign: 'right'
    },
    warningGroup: {
      '& div': {
        alignItems: 'center',
        display: 'flex',
        height: '50px',
        margin: '10px'
      }
    }
  }),
  { name: 'ElementCard', index: 1 }
);
