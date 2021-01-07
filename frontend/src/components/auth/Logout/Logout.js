import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useToggle } from 'react-use';
import { Button, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@material-ui/core';
import { ArrowDropDown as ArrowDropDownIcon } from '@material-ui/icons';

import { Modal } from 'components/elements';
import useStyles from '../styles';

const Logout = ({ authUser, onLogoutClick, artifactSaved }) => {
  const [showModal, toggleModal] = useToggle(false);
  const [showMenu, toggleMenu] = useToggle(false);
  const anchorRef = useRef(null);
  const history = useHistory();
  const styles = useStyles();

  const logout = () => {
    toggleModal(false);
    toggleMenu(false);
    onLogoutClick();
    window.setTimeout(() => history.push('/'), 10);
  };

  const handleLogout = () => {
    artifactSaved ? logout() : toggleModal(true);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    toggleMenu(false);
  };

  const handleListKeyDown = event => {
    if (event.key === 'Tab') {
      event.preventDefault();
      toggleMenu(false);
    }
  };

  return (
    <div>
      <Button
        aria-controls={showMenu ? 'logout-menu' : undefined}
        aria-haspopup="true"
        className={styles.logoutButton}
        onClick={toggleMenu}
        ref={anchorRef}
        startIcon={<ArrowDropDownIcon />}
      >
        {authUser}
      </Button>

      <Popper open={showMenu} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={showMenu} id="logout-menu" onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      <Modal
        title="Logout Confirmation"
        submitButtonText="Logout"
        handleShowModal={showModal}
        handleCloseModal={() => toggleModal(false)}
        handleSaveModal={() => logout()}
      >
        <h5>Are you sure you want to log out without saving your changes?</h5>
      </Modal>
    </div>
  );
};

Logout.propTypes = {
  authUser: PropTypes.string.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  artifactSaved: PropTypes.bool.isRequired
};

export default Logout;
