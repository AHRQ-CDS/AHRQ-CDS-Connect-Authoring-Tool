import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    picker: {
      '& button': {
        padding: '20px 5px'
      }
    }
  }),
  { name: 'Pickers', index: 1 }
);
