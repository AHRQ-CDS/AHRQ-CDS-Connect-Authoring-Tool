import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    noWrap: {
      whiteSpace: 'nowrap'
    },
    subtext: {
      color: theme.palette.common.grayLight,
      fontSize: '0.8em'
    }
  }),
  { name: 'Text' }
);
