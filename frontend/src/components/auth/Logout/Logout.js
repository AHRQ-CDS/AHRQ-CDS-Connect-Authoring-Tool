import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useToggle } from 'react-use';
import { Button, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material';

import { Modal } from 'components/elements';
import { logoutUser } from 'actions/auth';
import useStyles from '../styles';

const Logout = () => {
  const [showModal, toggleModal] = useToggle(false);
  const [showMenu, toggleMenu] = useToggle(false);
  const authUser = useSelector(state => state.auth.username);
  const artifactSaved = useSelector(state => state.artifacts.artifactSaved);
  const dispatch = useDispatch();
  const anchorRef = useRef(null);
  const history = useHistory();
  const styles = useStyles();

  const logout = useCallback(() => {
    toggleModal(false);
    toggleMenu(false);
    dispatch(logoutUser());
    window.setTimeout(() => history.push('/'), 10);
  }, [dispatch, history, toggleMenu, toggleModal]);

  const handleLogout = useCallback(() => {
    artifactSaved ? logout() : toggleModal(true);
  }, [artifactSaved, logout, toggleModal]);

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
        isOpen={showModal}
        handleCloseModal={() => toggleModal(false)}
        handleSaveModal={() => logout()}
      >
        <h5>Are you sure you want to log out without saving your changes?</h5>
      </Modal>
    </div>
  );
};

export default Logout;
