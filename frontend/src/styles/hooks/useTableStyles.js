import { makeStyles } from '@mui/styles';

export default makeStyles(
  {
    buttonsCell: {
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
