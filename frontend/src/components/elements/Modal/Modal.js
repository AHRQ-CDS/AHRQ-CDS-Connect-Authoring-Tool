import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core';

import { lightTheme, darkTheme } from 'styles/theme';
import useStyles from './styles';

const Modal = ({
  children,
  Footer,
  handleCloseModal,
  handleSaveModal,
  handleShowModal,
  hasCancelButton = false,
  hasTitleIcon = false,
  Header,
  hideSubmitButton = false,
  maxWidth = 'lg',
  submitButtonText = 'Save',
  submitDisabled = false,
  theme = 'light',
  title,
  TitleIcon
}) => {
  const styles = useStyles();
  let modalTheme = lightTheme;
  if (theme === 'dark') modalTheme = darkTheme;

  return (
    <ThemeProvider theme={modalTheme}>
      <Dialog open={handleShowModal} onClose={handleCloseModal} fullWidth maxWidth={maxWidth}>
        <DialogTitle disableTypography>
          <Typography variant="body1">{title}</Typography>

          <div>
            <div className={styles.titleIcon}>
              {hasTitleIcon && TitleIcon}
            </div>

            <IconButton aria-label="close" className={styles.closeButton} onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent className={styles.header}>{Header}</DialogContent>
        <DialogContent>{children && children}</DialogContent>

        <DialogActions>
          {Footer || <div></div>}

          <div>
            {hasCancelButton && (
              <Button className={styles.cancelButton} onClick={handleCloseModal} type="button" variant="text">
                Cancel
              </Button>
            )}

            {!hideSubmitButton &&
              <Button
                color={theme === 'dark' ? 'secondary' : 'primary'}
                form="modal-form"
                onClick={handleSaveModal}
                type="submit"
                variant="contained"
                disabled={submitDisabled}
              >
                {submitButtonText}
              </Button>
            }
          </div>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  Footer: PropTypes.element,
  handleCloseModal: PropTypes.func.isRequired,
  handleSaveModal: PropTypes.func.isRequired,
  handleShowModal: PropTypes.bool.isRequired,
  hasTitleIcon: PropTypes.bool,
  hasCancelButton: PropTypes.bool,
  Header: PropTypes.element,
  hideSubmitButton: PropTypes.bool,
  maxWidth: PropTypes.string,
  submitButtonText: PropTypes.string,
  submitDisabled: PropTypes.bool,
  theme: PropTypes.string,
  title: PropTypes.string.isRequired,
  TitleIcon: PropTypes.element
};

export default Modal;
