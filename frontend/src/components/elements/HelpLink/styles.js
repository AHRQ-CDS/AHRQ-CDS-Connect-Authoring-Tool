import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    helpButton: {
      color: theme.palette.common.blueHighlight,
      fontSize: '16px',
      fontWeight: '600',
      '& svg': {
        fontSize: '18px',
        marginRight: '3px'
      }
    },
    helpLink: {
      color: theme.palette.common.blueHighlight,
      '& svg': {
        fontSize: '18px'
      }
    }
  }),
  { name: 'HelpLink', index: 1 }
);
