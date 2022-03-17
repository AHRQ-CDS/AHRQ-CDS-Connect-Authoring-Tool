import React from 'react';
import PropTypes from 'prop-types';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { lightTheme, darkTheme } from 'styles/theme';
import useStyles from './styles';

const Modal = ({
  children,
  closeButtonText = 'Cancel',
  disableBackdropClick = false,
  Footer,
  handleCloseModal,
  handleSaveModal,
  isOpen,
  hasCancelButton = false,
  hasEnterKeySubmit = true,
  hasTitleIcon = false,
  Header,
  hideSubmitButton = false,
  isLoading = false,
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

  const enterKeyCheck = (func, argument, event) => {
    if (!event || event.type !== 'keydown' || event.key !== 'Enter') return;
    event.preventDefault();
    if (argument) {
      func(argument);
    } else {
      func();
    }
  };

  const onClose = (event, reason) => {
    if (reason && reason === 'backdropClick' && disableBackdropClick) {
      return;
    }
    handleCloseModal();
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={modalTheme}>
        <Dialog
          fullWidth
          maxWidth={maxWidth}
          onClose={onClose}
          onKeyDown={hasEnterKeySubmit ? e => enterKeyCheck(handleSaveModal, null, e) : null}
          open={isOpen}
        >
          <DialogTitle>
            <Typography variant="body1" data-testid={title}>
              {title}
            </Typography>

            <div>
              <div className={styles.titleIcon}>{hasTitleIcon && TitleIcon}</div>

              <IconButton aria-label="close" className={styles.closeButton} onClick={handleCloseModal} size="large">
                <CloseIcon />
              </IconButton>
            </div>
          </DialogTitle>

          <DialogContent className={styles.header}>{Header}</DialogContent>
          <DialogContent>{children && children}</DialogContent>

          <DialogActions>
            {Footer || <div></div>}

            <div className={styles.footerButtons}>
              {hasCancelButton && (
                <Button className={styles.cancelButton} onClick={handleCloseModal} variant="text">
                  {closeButtonText}
                </Button>
              )}

              {!hideSubmitButton && (
                <Button
                  color={theme === 'dark' ? 'inherit' : 'primary'}
                  disabled={submitDisabled || isLoading}
                  form="modal-form"
                  onClick={handleSaveModal}
                  startIcon={isLoading && <CircularProgress size={20} />}
                  variant="contained"
                >
                  {submitButtonText}
                </Button>
              )}
            </div>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  closeButtonText: PropTypes.string,
  disableBackdropClick: PropTypes.bool,
  Footer: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
  handleCloseModal: PropTypes.func.isRequired,
  handleSaveModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  hasCancelButton: PropTypes.bool,
  hasEnterKeySubmit: PropTypes.bool,
  hasTitleIcon: PropTypes.bool,
  Header: PropTypes.element,
  hideSubmitButton: PropTypes.bool,
  isLoading: PropTypes.bool,
  maxWidth: PropTypes.string,
  submitButtonText: PropTypes.string,
  submitDisabled: PropTypes.bool,
  theme: PropTypes.string,
  title: PropTypes.string.isRequired,
  TitleIcon: PropTypes.element
};

export default Modal;
