import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    button: {
      borderRadius: '5px',
      height: '40px',
      margin: '0px',
      padding: '0px'
    },
    active: {
      maxWidth: '60px',
      minWidth: '60px',
      color: '#EEE',
      backgroundColor: 'rgb(87, 120, 160)',
      '&:hover': {
        backgroundColor: 'rgb(87, 120, 160)'
      }
    },
    inactive: {
      maxWidth: '50px',
      minWidth: '50px',
      color: '#333',
      backgroundColor: 'rgb(235, 235, 235)'
    }
  }),
  { name: 'AndOrToggle' }
);
