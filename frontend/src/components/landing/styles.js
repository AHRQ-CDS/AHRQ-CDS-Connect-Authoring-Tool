import { makeStyles } from '@material-ui/core/styles';
import backgroundImage from './cds-connect-background.jpg';

const buttonStyles = (theme, color) => {
  return {
    backgroundColor: theme.palette.common[color],
    borderColor: `${theme.palette.common[color]} transparent transparent`,
    '&:hover, &:focus, &:active': {
      backgroundColor: theme.palette.common[color],
      color: theme.palette.common.white
    }
  };
};

export default makeStyles(
  theme => ({
    root: {
      padding: '0 20px'
    },
    homeBanner: {
      background: `url(${backgroundImage}) no-repeat center center fixed`,
      backgroundSize: 'cover'
    },
    homeBannerContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '80px 20px'
    },
    homeBannerTitle: {
      color: theme.palette.common.white,
      textAlign: 'center',
      fontSize: '2.3em',
      fontWeight: 'bold'
    },
    homeBannerSubtitle: {
      color: theme.palette.common.white,
      textAlign: 'center',
      paddingTop: '10px'
    },
    primaryButtonLink: {
      marginTop: '2em',
      border: `1px solid ${theme.palette.common.white}`,
      backgroundColor: theme.palette.common.blue,
      width: '300px',
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.blue
      },
      '&:focus': {
        color: theme.palette.common.white
      },
      '&:hover:focus': {
        color: theme.palette.common.blue
      }
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.common.white,
      height: '60px',
      fontSize: '1.3em'
    },
    landingHeader: {
      backgroundColor: theme.palette.common.grayDark
    },
    whatsNewHeader: {
      backgroundColor: theme.palette.common.redLight,
      justifyContent: 'space-between',
      cursor: 'pointer',
      '&:focus': {
        outline: 'none'
      }
    },
    whatsNew: {
      marginBottom: '40px'
    },
    whatsNewButtons: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '2px'
    },
    whatsNewButtonGroup: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '25%'
    },
    whatsNewButton: {
      width: '95%',
      height: '60px',
      color: theme.palette.common.white,
      borderRadius: 0,
      boxShadow: 'none',
      border: 0,
      textTransform: 'none',
      '&:focus': {
        outline: 'none'
      }
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent !important',
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: '10px',
      marginLeft: '-10px'
    },
    green: { ...buttonStyles(theme, 'green') },
    yellow: { ...buttonStyles(theme, 'yellow') },
    red: { ...buttonStyles(theme, 'redLight') },
    gray: { ...buttonStyles(theme, 'grayLight') },
    whatsNewDisplay: {
      display: 'flex',
      alignItems: 'center',
      margin: '20px 0 60px',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center',
        '& img': {
          marginBottom: '20px'
        }
      }
    },
    whatsNewDisplayImage: {
      marginRight: 'calc(10px + 3vw)',
      '& img': {
        width: '30em',
        border: `1px solid ${theme.palette.common.grayLight}`,
        [theme.breakpoints.down('sm')]: {
          width: '100%'
        }
      }
    },
    whatsNewName: {
      marginBottom: '10px',
      fontWeight: 'bold'
    },
    whatsNewLinkButton: {
      marginTop: '20px',
      color: theme.palette.common.white,
      borderRadius: 0,
      '& a': {
        color: theme.palette.common.white
      }
    },
    homeContent: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '60px 0',
      fontSize: '0.9em',
      [theme.breakpoints.down('md')]: {
        flexWrap: 'wrap'
      }
    },
    homeCard: {
      flex: '0 1 22%',
      '& a': {
        fontWeight: 'bold'
      },
      [theme.breakpoints.down('md')]: {
        flex: '0 1 calc(50% - 1em)'
      },
      [theme.breakpoints.down('sm')]: {
        flex: '0 1 100%'
      }
    },
    homeCardImage: {
      display: 'block',
      width: '100px',
      margin: '20px auto'
    },
    homeCardTitle: {
      textAlign: 'center',
      fontSize: '1.4em',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    homeFooter: {
      paddingTop: '20px',
      paddingBottom: '20px',
      backgroundColor: theme.palette.common.grayDark,
      color: theme.palette.common.white,
      fontSize: '0.9em',
      '& a': {
        color: theme.palette.common.white,
        textSecoration: 'underline'
      }
    }
  }),
  { name: 'Landing' }
);
