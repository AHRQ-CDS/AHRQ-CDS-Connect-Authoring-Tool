import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(
  theme => ({
    dropZoneIcon: {
      fontSize: '5em'
    },
    dropZoneSection: {
      '& .dropzone': {
        borderColor: theme.palette.common.gray,
        borderRadius: '1em',
        borderStyle: 'dashed',
        borderWidth: '0.25em',
        cursor: 'pointer',
        margin: 'auto',
        padding: '2em 1em',
        textAlign: 'center',
        '&:focus': {
          borderColor: theme.palette.common.green,
          outline: 'none'
        },
        '&.disabled': {
          cursor: 'not-allowed',
          color: theme.palette.common.grayLight,
          borderColor: theme.palette.common.grayLight
        }
      }
    },
    dropZoneWarning: {
      color: theme.palette.common.red,
      fontSize: '0.9em',
      fontStyle: 'italic',
      margin: '10px 60px'
    }
  }),
  { name: 'DropZone' }
);
