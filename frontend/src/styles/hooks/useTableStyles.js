import { makeStyles } from '@mui/styles';

export default makeStyles(
  {
    buttonsCell: {
      whiteSpace: 'nowrap',
      '& button': {
        marginLeft: '10px'
      }
    },
    noWrapRow: {
      '& .MuiTableCell-root': {
        whiteSpace: 'nowrap'
      }
    }
  },
  { name: 'Tables' }
);
