import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    toggleButton: {
      backgroundColor: theme.palette.common.grayLighter,
      borderRadius: '5px',
      height: '40px',
      margin: '0',
      padding: '0'
    },
    active: {
      display: 'inline-block',
      backgroundColor: theme.palette.common.blueHighlight,
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: theme.palette.common.blueHighlight
      }
    }
  }),
  { name: 'ToggleSwitch', index: 1 }
);
