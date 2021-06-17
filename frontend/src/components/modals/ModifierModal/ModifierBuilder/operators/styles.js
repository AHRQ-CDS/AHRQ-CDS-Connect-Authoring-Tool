import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    text: {
      alignSelf: 'center',
      marginRight: '10px'
    },
    container: {
      display: 'flex',
      whiteSpace: 'nowrap',
      justifyContent: 'center'
    }
  }),
  { name: 'Operator-Styles' }
);
