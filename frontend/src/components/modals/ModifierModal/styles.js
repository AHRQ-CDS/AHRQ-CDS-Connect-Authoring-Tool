import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    clearRuleButton: {
      alignSelf: 'center',
      marginLeft: '10px'
    },
    compactTextButton: {
      margin: '0',
      padding: '0',
      background: 'transparent'
    },
    deleteButton: {
      position: 'absolute',
      right: '10px',
      top: '20px'
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
      margin: '0 0 0 50px',
      width: '100%'
    },
    line: {
      backgroundColor: theme.palette.common.gray,
      position: 'absolute'
    },
    lineHorizontal: {
      height: '3px',
      top: '50%',
      width: '30px'
    },
    lineHorizontalCard: {
      top: '50px',
      width: '50px'
    },
    lineHorizontalConnect: {
      left: '-30px',
      width: '60px'
    },
    lineHorizontalRule: {
      top: '45px'
    },
    lineVertical: {
      height: '100%',
      width: '3px'
    },
    lineVerticalBottom: {
      bottom: '50%',
      height: '50%'
    },
    lineVerticalTop: {
      height: '50%',
      top: '50%'
    },
    modifierCard: {
      margin: 0,
      position: 'relative'
    },
    modifierCardContent: {
      paddingRight: '60px'
    },
    modifierModalContent: {
      minHeight: '200px',
      minWidth: '1000px'
    },
    multipleSelect: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    navHeader: {
      alignItems: 'center',
      display: 'flex',
      marginBottom: '1em'
    },
    noMarginBottom: {
      marginBottom: '0'
    },
    rule: {
      alignItems: 'flex-start',
      display: 'flex',
      flexWrap: 'wrap',
      width: '100%'
    },
    rulesCard: {
      marginTop: '0',
      padding: '10px 30px',
      width: '100%'
    },
    rulesCardGroup: {
      alignItems: 'center',
      display: 'flex',
      padding: '10px 0',
      position: 'relative'
    },
    rulesCardOdd: {
      backgroundColor: theme.palette.common.white
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
      fontWeight: 700,
      marginRight: '10px'
    },
    versionButton: {
      marginLeft: '20px',
      marginTop: '40px'
    },
    warningBanner: {
      marginBottom: '20px'
    }
  }),
  { name: 'Modifier-Modal', index: 1 }
);
