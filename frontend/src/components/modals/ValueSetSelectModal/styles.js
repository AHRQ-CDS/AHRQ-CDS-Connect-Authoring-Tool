import { makeStyles } from '@mui/styles';

export default makeStyles(theme => ({
  collapseRow: {
    paddingBottom: '10px',
    paddingTop: '10px',
    paddingRight: '10px',
    paddingLeft: '30px',
    background: theme.palette.common.grayLightest
  },
  simpleTable: {
    // simpleTable is only used for layout purposes - override basic table styles (see _base.scss) that are not helpful here
    '& td:not(:last-child)': {
      paddingRight: '0.5em !important'
    },
    '& td': {
      borderBottom: 'none !important'
    }
  }
}));
