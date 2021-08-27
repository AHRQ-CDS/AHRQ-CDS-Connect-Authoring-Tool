import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    customModifier: {
      alignItems: 'flex-start',
      display: 'flex',
      justifyContent: 'space-between'
    },
    dateTimeInput: {
      '& .MuiIconButton-root': {
        padding: '20px 5px'
      }
    },
    modifier: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: '9px 0',
      width: '100%'
    },
    modifierButton: {
      marginTop: '-38px'
    },
    modifierHeader: {
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        marginRight: '5px'
      }
    },
    modifierMargin: {
      margin: '10px 0'
    },
    modifierText: {
      marginRight: '10px'
    }
  }),
  { name: 'Modifiers', index: 1 }
);
