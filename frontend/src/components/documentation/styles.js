import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    tabBar: {
      backgroundColor: theme.palette.common.blueDarker,
      paddingTop: '30px'
    },
    tab: {
      opacity: 1,
      '&.Mui-selected, &:hover': {
        backgroundColor: theme.palette.common.ahrqGray
      },
      '&:hover, &:focus': {
        color: theme.palette.common.white,
        outline: 'none'
      }
    },
    guide: {
      margin: '2em 0',
      '& div': {
        margin: '10px 0'
      },
      '&.is-position-relative': {
        position: 'relative'
      }
    },
    tocWrapper: {
      width: '74%',
      [theme.breakpoints.down('sm')]: {
        width: '100%'
      }
    },
    toc: {
      position: 'absolute',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '8px',
      width: '25%',
      right: '10px',
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      },
      '& .is-active-link::before': {
        backgroundColor: theme.palette.common.ahrqLightBlue
      },
      '&.is-position-fixed': {
        paddingTop: '30px'
      },
      '&.is-position-absolute': {
        position: 'absolute !important'
      },
      '&.at-bottom': {
        top: 'auto',
        bottom: '30px'
      }
    },
    h2Wrapper: {
      borderTop: `1px solid ${theme.palette.common.grayLighter}`,
      marginTop: '30px',
      paddingTop: '30px'
    },
    h3Wrapper: {
      borderLeft: `3px solid ${theme.palette.common.grayLighter}`,
      paddingLeft: '20px'
    },
    h4Wrapper: {
      borderLeft: `3px solid ${theme.palette.common.ahrqLightBlue}`,
      paddingLeft: '20px'
    }
  }),
  { name: 'Documentation' }
);
