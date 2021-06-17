import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    bottomIndent: {
      marginBottom: '25px'
    },
    cardLight: {
      backgroundColor: 'rgb(255, 255, 255)'
    },
    cardDark: {
      backgroundColor: 'rgb(248, 248, 248)'
    },
    deleteButton: {
      position: 'absolute',
      top: '12px',
      right: '10px'
    },
    deleteStatement: {
      padding: 0,
      marginLeft: 'auto',
      position: 'relative',
      bottom: '30px',
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
    indent: {
      marginLeft: '30px'
    },
    lineGroup: {
      display: 'flex',
      alignItems: 'center'
    },
    linePadding: {
      width: '30px'
    },
    lineParent: {
      margin: '0',
      position: 'relative',
      left: '0px',
      top: '58px',
      borderTop: '3px solid black',
      height: '0',
      width: '38px'
    },
    lineChild: {
      margin: '0',
      position: 'relative',
      bottom: '3px',
      right: '35px',
      borderTop: '3px solid black',
      height: '0',
      width: '35px'
    },
    lineSpacer: {
      height: '15px',
      borderLeft: '3px solid black'
    },
    lineConnector: {
      borderLeft: '3px solid black'
    },
    lineContentPane: {
      margin: 0,
      borderLeft: '3px solid black',
      padding: '12px'
    },
    lineStubTop: {
      height: '20px',
      borderLeft: '3px solid black',
      borderTop: '3px solid black',
      alignSelf: 'flex-end',
      marginRight: '15px'
    },
    lineStubMid: {
      backgroundColor: theme.palette.common.black,
      height: '3px',
      width: '27px',
      marginRight: '15px'
    },
    lineStubLow: {
      height: '20px',
      borderLeft: '3px solid black',
      borderBottom: '3px solid black',
      alignSelf: 'flex-start',
      marginRight: '15px'
    },
    modifierCard: {
      position: 'relative',
      margin: 0
    },
    modifierCardContent: {
      paddingRight: '60px'
    },
    modifierModalContent: {
      minHeight: '200px',
      minWidth: '1000px'
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
    statementCard: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      width: '95%',
      margin: '0',
      marginLeft: '8px'
    },
    toggleDeleteGroup: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    topIndent: {
      marginTop: '35px'
    },
    typeIndicator: {
      marginLeft: '5px',
      marginBottom: '20px',
      padding: '8px',
      borderRadius: '5px',
      backgroundColor: theme.palette.common.blueHighlight,
      color: theme.palette.common.white,
      display: 'inline-block'
    },
    typeIndicatorContainer: {
      width: '100%'
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
    textButton: {
      color: theme.palette.common.blueHighlight,
      padding: '0',
      marginRight: '20px'
    },
    versionButton: {
      marginTop: '40px',
      marginLeft: '20px'
    },
    warningBanner: {
      marginBottom: '20px'
    }
  }),
  { name: 'Modifier-Modal' }
);
