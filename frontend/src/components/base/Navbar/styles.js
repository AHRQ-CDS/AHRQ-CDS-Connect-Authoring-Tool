import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    tabs: {
      backgroundColor: theme.palette.common.ahrqDarkBlue,
      paddingBottom: '10px'
    },
    tab: {
      color: theme.palette.common.white,
      marginRight: '15px',
      borderRadius: '5px',
      textTransform: 'none',
      opacity: 1,
      '&:hover, &:focus': {
        color: theme.palette.common.white,
        textDecoration: 'none'
      },
      '&:hover, &.active': {
        backgroundColor: theme.palette.common.ahrqGray
      },
      [theme.breakpoints.down('lg')]: {
        minWidth: '130px'
      },
      [theme.breakpoints.down('md')]: {
        minWidth: '100px'
      }
    }
  }),
  { name: 'Navbar', index: 1 }
);
