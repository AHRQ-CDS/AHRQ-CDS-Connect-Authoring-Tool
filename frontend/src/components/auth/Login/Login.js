import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import _ from 'lodash';

import { Modal } from 'components/elements';
import { onVisitExternalForm } from 'utils/handlers';
import { loginUser, setAuthStatus } from 'actions/auth';
import useStyles from '../styles';

const Login = () => {
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const styles = useStyles();

  const closeModal = useCallback(() => {
    setShowModal(false);
    dispatch(setAuthStatus(null));
  }, [dispatch]);

  const handleLogin = useCallback(
    () => dispatch(loginUser(username, password))
      .then(response => {
        if (response.type === 'LOGIN_SUCCESS') history.push('/artifacts');
      }),
    [dispatch, username, password]
  );

  const handleChangeUsername = useCallback(event => {
    setShowWarning(_.includes(event.target.value, '@'));
    setUsername(event.target.value);
  }, []);

  const handleChangePassword = useCallback(event => {
    setPassword(event.target.value);
  }, []);

  const WarningHelperText = () => (
    <>
      <ErrorOutlineOutlinedIcon fontSize="inherit" /> Please enter your username, not your email address.
    </>
  );

  return (
    <div className={styles.root}>
      <Button
        className={styles.loginButton}
        onClick={() => setShowModal(true)}
        startIcon={isAuthenticating && <CircularProgress size={20} />}
        variant="outlined"
      >
        Login
      </Button>

      <Modal
        handleCloseModal={closeModal}
        handleSaveModal={handleLogin}
        handleShowModal={showModal}
        isLoading={isAuthenticating}
        submitButtonText="Login"
        theme="dark"
        title="Login to your account"
      >
        <div>
          <div className={styles.disclaimer}>
            This warning banner provides privacy and security notices consistent with applicable federal laws,
            directives, and other federal guidance for accessing this Government system, which includes all
            devices/storage media attached to this system. This system is provided for Government-authorized use only.
            Unauthorized or improper use of this system is prohibited and may result in disciplinary action and/or civil
            and criminal penalties. At any time, and for any lawful Government purpose, the government may monitor,
            record, and audit your system usage and/or intercept, search and seize any communication or data transiting
            or stored on this system. Therefore, you have no reasonable expectation of privacy. Any communication or
            data transiting or stored on this system may be disclosed or used for any lawful Government purpose.
          </div>

          <div>
            <TextField
              className={styles.input}
              error={showWarning}
              fullWidth
              helperText={showWarning ? <WarningHelperText /> : null}
              label="username"
              onChange={handleChangeUsername}
              value={username}
              variant="outlined"
            />

            <TextField
              className={styles.input}
              fullWidth
              label="password"
              onChange={handleChangePassword}
              type="password"
              value={password}
              variant="outlined"
            />

            {authStatus === 'loginFailure' && <Alert severity="error">{authStatusText}</Alert>}
          </div>

          <div className={styles.forgotPassword}>
            <a href="https://ahrqadmin.org/UMA/password" onClick={onVisitExternalForm}>
              Forgot password?
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
