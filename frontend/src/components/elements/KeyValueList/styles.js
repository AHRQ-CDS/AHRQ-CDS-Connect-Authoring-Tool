import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    list: {
      width: '100%'
    },
    item: {
      display: 'flex',
      margin: '0.5em 0'
    },
    key: {
      fontWeight: '600',
      minWidth: '300px'
    },
    denseList: {
      fontSize: '0.8em'
    },
    denseItem: {
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.common.grayLighter}`,
      margin: '0',
      padding: '5px 0',
      '&:last-of-type': {
        border: '0'
      }
    },
    denseKey: {
      fontWeight: '400',
      minWidth: '280px'
    }
  }),
  { name: 'KeyValueList', index: 1 }
);
