import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    tabs: {
      backgroundColor: theme.palette.common.ahrqDarkBlue
    },
    tab: {
      color: theme.palette.common.white,
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
  { name: 'Navbar' }
);
