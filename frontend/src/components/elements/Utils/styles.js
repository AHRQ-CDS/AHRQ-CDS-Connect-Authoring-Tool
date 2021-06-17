import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    active: {
      display: 'inline-block',
      color: '#EEE',
      backgroundColor: 'rgb(87, 120, 160)',
      '&:hover': {
        backgroundColor: 'rgb(87, 120, 160)'
      }
    },
    bold: {
      fontWeight: 'bold'
    },
    button: {
      borderRadius: '5px',
      height: '40px',
      margin: '0px',
      padding: '0px'
    },
    inactive: {
      display: 'inline-block',
      color: '#333',
      backgroundColor: 'rgb(235, 235, 235)',
      '&:hover': {
        backgroundColor: 'rgb(235, 235, 235)'
      }
    }
  }),
  { name: 'ToggleSwitch' }
);
