import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    bold: {
      fontWeight: 'bold'
    },
    italic: {
      fontStyle: 'italic'
    },
    noWrap: {
      whiteSpace: 'nowrap'
    },
    fontSizeSmall: {
      fontSize: '0.8em'
    },
    subtext: {
      color: theme.palette.common.grayLight,
      fontSize: '0.8em'
    }
  }),
  { name: 'Text', index: 1 }
);
