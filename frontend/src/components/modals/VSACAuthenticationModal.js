/* eslint-disable jsx-a11y/no-autofocus */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useMutation } from 'react-query';
import { useLatest } from 'react-use';
import { TextField } from '@mui/material';
import { Alert } from '@mui/material';

import { Link, Modal } from 'components/elements';
import { setVSACApiKey } from 'actions/vsac';
import authenticateVSAC from 'queries/authenticateVSAC';
import useStyles from './styles';

const VSACAuthenticationModal = ({ handleCloseModal }) => {
  const [apiKey, setApiKey] = useState('');
  const apiKeyRef = useLatest(apiKey);
  const dispatch = useDispatch();
  const styles = useStyles();

  const { mutateAsync, isLoading, isError } = useMutation(authenticateVSAC);

  const closeModal = useCallback(() => {
    handleCloseModal();
    setApiKey('');
  }, [handleCloseModal]);

  const login = useCallback(() => {
    const apiKey = apiKeyRef.current;

    mutateAsync({ apiKey }).then(() => {
      dispatch(setVSACApiKey(apiKey));
      closeModal();
    });
  }, [mutateAsync, apiKeyRef, dispatch, closeModal]);

  return (
    <Modal
      handleCloseModal={closeModal}
      handleSaveModal={login}
      isOpen
      hasCancelButton
      isLoading={isLoading}
      maxWidth="md"
      submitButtonText="Login"
      theme="dark"
      title="Login to your VSAC account"
    >
      <>
        <div>
          Use your UMLS Terminology Services API key to log in to VSAC to access value sets and codes within the CDS
          Authoring Tool.
        </div>

        <div className={styles.list}>
          <div className={styles.listItem}>
            Need an account?
            <Link
              href={`${process.env.PUBLIC_URL}/documentation#Requesting_UTS_Account`}
              text="Request a UMLS Terminology Services account."
            />
          </div>

          <div className={styles.listItem}>
            Don't know your UMLS API key?
            <Link
              href={`${process.env.PUBLIC_URL}/documentation#Accessing_UMLS_API_Key`}
              text="Find your UMLS Terminology Services API key."
            />
          </div>
        </div>

        <form id="modal-form" onSubmit={login}>
          <TextField
            autoComplete="new-password"
            autoFocus
            fullWidth
            label="API Key"
            onChange={event => setApiKey(event.target.value)}
            type="password"
            value={apiKey}
          />

          {isError && (
            <Alert className={styles.alert} severity="error">
              Authentication Error: Unauthorized, please try again.
            </Alert>
          )}
        </form>
      </>
    </Modal>
  );
};

VSACAuthenticationModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired
};

export default VSACAuthenticationModal;
