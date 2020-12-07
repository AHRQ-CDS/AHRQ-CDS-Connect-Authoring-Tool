import React, { memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress, TextField } from '@material-ui/core';
import { Check as CheckIcon, Lock as LockIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { useUnmount } from 'react-use';

import { loginVSACUser, setVSACAuthStatus } from 'actions/vsac';

export const AuthenticateVSACButton = memo((
  { onLogin, disabled, isAuthenticating = false, isAuthenticated = false }
) => (
  <div className="field-group-button">
    <Button
      color="primary"
      disabled={disabled}
      onClick={onLogin}
      startIcon={isAuthenticating ? <CircularProgress size={20} /> : isAuthenticated ? <CheckIcon /> : <LockIcon />}
      variant="contained"
    >
      {isAuthenticated ? 'VSAC Authenticated' : 'Authenticate VSAC'}
    </Button>
  </div>
));

export default memo(function AuthenticateVSAC() {
  const [apiKey, setApiKey] = useState(null);
  const dispatch = useDispatch();
  const authStatus = useSelector(state => state.vsac.authStatus);
  const isAuthenticating = useSelector(state => state.vsac.isAuthenticating);
  const authStatusText = useSelector(state => state.vsac.authStatusText);

  useUnmount(() => {
    if (authStatus === 'loginFailure') dispatch(setVSACAuthStatus(null));
  });

  const onLogin = useCallback(
    () => dispatch(loginVSACUser(apiKey)),
    [dispatch, apiKey]
  );

  const showForm = authStatus == null || authStatus === 'loginFailure';

  return (
    <div className="field-group authenticate-vsac">
      {showForm && (
        <>
          <div className="authenticate-vsac__disclaimer">
            Use your UMLS Terminology Services API key to log in to VSAC to access value sets and codes.

            <ul>
              <li>
                Need an account?{' '}
                <a
                  href={`${process.env.PUBLIC_URL}/documentation#Requesting_UTS_Account`}
                  target="_blank"
                  rel="noopener noreferrer">Request a UMLS Terminology Services account.
                </a>
              </li>

              <li>
                Don't know your UMLS API key?{' '}
                <a
                  href={`${process.env.PUBLIC_URL}/documentation#Accessing_UMLS_API_Key`}
                  target="_blank"
                  rel="noopener noreferrer">Find your UMLS Terminology Services API key.
                </a>
              </li>
            </ul>
          </div>

          <div className="field-group">
            <TextField
              autoComplete="current-password"
              fullWidth
              label="API Key"
              onChange={event => setApiKey(event.target.value)}
              type="password"
              value={apiKey || ''}
              variant="outlined"
            />

            {authStatus === 'loginFailure' && (
              <Alert severity="error" onClose={() => dispatch(setVSACAuthStatus(null))}>
                {authStatusText}
              </Alert>
            )}

            <AuthenticateVSACButton
              onLogin={onLogin}
              disabled={isAuthenticating}
              isAuthenticating={isAuthenticating}
            />
          </div>
        </>
      )}
    </div>
  );
});
