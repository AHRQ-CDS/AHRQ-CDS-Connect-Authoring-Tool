import React, { memo, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faSpinner, faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import RawTextField from './RawTextField';
import { loginVSACUser } from '../../actions/vsac';

export const AuthenticateVSACButton = memo((
  { onLogin, disabled, isAuthenticating = false, isAuthenticated = false }
) => (
  <button
    type="button"
    className="primary-button pull-right"
    onClick={onLogin}
    aria-label="Authenticate VSAC"
    disabled={disabled}
  >
    {!isAuthenticated && !isAuthenticating && <><FontAwesomeIcon icon={faKey} /> Authenticate VSAC</>}
    {isAuthenticating && <><FontAwesomeIcon icon={faSpinner} spin /> Authenticate VSAC</>}
    {isAuthenticated && <><FontAwesomeIcon icon={faCheck} /> VSAC Authenticated</>}
  </button>
));

export default memo(function AuthenticateVSAC() {
  const apiKeyRef = useRef();
  const dispatch = useDispatch();
  const authStatus = useSelector(state => state.vsac.authStatus);
  const isAuthenticating = useSelector(state => state.vsac.isAuthenticating);
  const vsacStatusText = useSelector(state => state.vsac.vsacStatusText);

  const onLogin = useCallback(
    () => dispatch(loginVSACUser('', apiKeyRef.current.value)),
    [dispatch, apiKeyRef]
  );

  const showForm = authStatus == null || authStatus === 'loginFailure';

  return (
    <div className="authenticate-vsac">
      <div className="authenticate-vsac__content">
        {showForm && (
          <>
            <div className="authenticate-vsac__disclaimer">
              Use your UMLS account to log in to VSAC to access value sets and codes.
            </div>

            <div className="authenticate-vsac__form">
              <RawTextField
                name="apiKey"
                label="API Key"
                placeholder="API Key"
                type="password"
                ref={apiKeyRef}
              />

              <AuthenticateVSACButton
                onLogin={onLogin}
                disabled={isAuthenticating}
                isAuthenticating={isAuthenticating}
              />
            </div>
          </>
        )}

        {authStatus === 'loginFailure' && (
          <div className="login__auth-status">
            <FontAwesomeIcon icon={faExclamationCircle} /> {vsacStatusText}
          </div>
        )}

        {authStatus === 'loginSuccess' && (
          <div className="login__auth-status">
            <AuthenticateVSACButton disabled isAuthenticated />
          </div>
        )}
      </div>
    </div>
  );
});
