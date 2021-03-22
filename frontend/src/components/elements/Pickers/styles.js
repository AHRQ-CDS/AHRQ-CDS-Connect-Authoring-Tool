import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    picker: {
      '& .MuiIconButton-root': {
        padding: '20px 5px'
      }
    }
  }),
  { name: 'Pickers' }
);
