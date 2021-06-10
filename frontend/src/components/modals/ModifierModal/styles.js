import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    deleteButton: {
      position: 'absolute',
      top: '12px',
      right: '10px'
    },
    displayModeButton: {
      margin: '0 2em',
      minWidth: '300px'
    },
    displayModeSelector: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center'
    },
    modifierCard: {
      position: 'relative',
      margin: 0
    },
    modifierCardContent: {
      paddingRight: '60px'
    },
    modifierModalContent: {
      minHeight: '200px'
    },
    modifierSelectorRow: {
      padding: '10px 0 10px 58px',
      position: 'relative'
    },
    navHeader: {
      alignItems: 'center',
      display: 'flex',
      marginBottom: '1em'
    },
    rowCorner: {
      backgroundColor: theme.palette.common.gray,
      left: '0',
      overflow: 'hidden',
      position: 'absolute',
      width: '3px'
    },
    rowCornerBottom: {
      bottom: '0',
      top: '50%'
    },
    rowCornerTee: {
      bottom: '0',
      top: '0'
    },
    rowCornerTop: {
      bottom: '50%',
      top: '0'
    },
    rowLine: {
      backgroundColor: theme.palette.common.gray,
      height: '3px',
      left: 0,
      position: 'absolute',
      top: '50%',
      width: '40px'
    },
    tag: {
      backgroundColor: theme.palette.common.blueHighlight,
      borderRadius: '5px',
      color: theme.palette.common.white,
      fontSize: '0.9em',
      margin: '0 30px 0 10px',
      padding: '5px 10px',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap'
    },
    warningBanner: {
      marginBottom: '20px'
    }
  }),
  { name: 'Modifier-Modal' }
);
