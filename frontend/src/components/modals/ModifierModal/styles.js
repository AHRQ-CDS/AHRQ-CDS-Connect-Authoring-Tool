import { fade, makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    alignIcon: {
      alignSelf: 'flex-start',
      marginTop: '0'
    },
    clearRuleButton: {
      alignSelf: 'center',
      marginLeft: '10px'
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
    label: {
      alignSelf: 'center',
      fontWeight: 'bold',
      margin: '0',
      marginTop: '7px',
      marginLeft: '3px'
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
    modifierExpression: {
      marginTop: '10px'
    },
    modifierModalContent: {
      minHeight: '200px',
      minWidth: '1000px'
    },
    navHeader: {
      marginBottom: '1em'
    },
    navHeaderButtons: {
      alignItems: 'center',
      display: 'flex'
    },
    navHeaderGroup: {
      display: 'flex'
    },
    operandGroup: {
      display: 'flex',
      alignItems: 'center'
    },
    rule: {
      display: 'flex',
      flexWrap: 'wrap',
      width: '100%'
    },
    ruleLabel: {
      alignSelf: 'center',
      fontWeight: 'bold',
      marginRight: '10px',
      whiteSpace: 'nowrap'
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
    // keep before rulesCardGroupIncomplete
    rulesCardOdd: {
      backgroundColor: theme.palette.common.white
    },
    rulesCardGroupIncomplete: {
      backgroundColor: fade(theme.palette.common.redLight, 0.15)
    },
    tag: {
      alignItems: 'center',
      backgroundColor: theme.palette.common.blueHighlight,
      borderRadius: '5px',
      color: theme.palette.common.white,
      display: 'flex',
      fontSize: '0.9em',
      height: '40px',
      margin: '0 30px 0 10px',
      padding: '5px 10px',
      textTransform: 'uppercase',
      width: 'fit-content',
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
