import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    bold: {
      fontWeight: '600'
    },
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
