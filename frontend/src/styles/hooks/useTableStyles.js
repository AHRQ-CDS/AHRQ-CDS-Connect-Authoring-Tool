import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  {
    buttonsCell: {
      whiteSpace: 'nowrap',
      '& button': {
        marginLeft: '10px'
      }
    },
    noWrapCell: {
      whiteSpace: 'nowrap'
    },
    noWrapRow: {
      '& .MuiTableCell-root': {
        whiteSpace: 'nowrap'
      }
    }
  },
  { name: 'Tables' }
);
