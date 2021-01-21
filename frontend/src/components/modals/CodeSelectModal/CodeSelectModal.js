import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { useLatest } from 'react-use';
import { CircularProgress } from '@material-ui/core';

import CodeDetailsTable from './CodeDetailsTable';
import CodeSelectModalFooter from './CodeSelectModalFooter';
import CodeSelectModalHeader from './CodeSelectModalHeader';
import codeSystemOptions from 'data/codeSystemOptions';
import { Modal } from 'components/elements';
import validateCode from 'queries/validateCode';
import useStyles from '../styles';

const CodeSelectModal = ({ handleCloseModal, handleSelectCode }) => {
  const { mutateAsync, isLoading, isSuccess, isIdle, data: codeData } = useMutation(validateCode);
  const [code, setCode] = useState('');
  const [codeSystem, setCodeSystem] = useState(null);
  const [otherCodeSystem, setOtherCodeSystem] = useState('');
  const codeRef = useLatest(code);
  const codeSystemRef = useLatest(codeSystem);
  const otherCodeSystemRef = useLatest(otherCodeSystem);
  const codeDisplayNameRef = useLatest(codeData?.display);
  const apiKey = useSelector(state => state.vsac.apiKey);
  const styles = useStyles();

  const handleValidateCode = useCallback(() => {
    const selectedCodeSystem = codeSystemRef.current;
    const system = selectedCodeSystem
      ? selectedCodeSystem === 'Other'
        ? otherCodeSystemRef.current
        : codeSystemOptions.find(codeSystemOption => codeSystemOption.value === selectedCodeSystem).id
      : '';

    mutateAsync({ code: codeRef.current, system, apiKey });
  }, [apiKey, codeRef, codeSystemRef, otherCodeSystemRef, mutateAsync]);

  const handleSaveCodeSelection = useCallback(() => {
    const codeSystemId =
      codeSystemRef.current === 'Other'
        ? otherCodeSystemRef.current
        : codeSystemOptions.find(codeSystemOption => codeSystemOption.value === codeSystemRef.current)?.id;

    handleSelectCode({
      display: codeDisplayNameRef.current || '',
      code: codeRef.current,
      codeSystem: { name: codeSystemRef.current, id: codeSystemId || '' }
    });
    handleCloseModal();
  }, [handleCloseModal, handleSelectCode, codeDisplayNameRef, codeRef, codeSystemRef, otherCodeSystemRef]);

  return (
    <Modal
      Footer={<CodeSelectModalFooter isValidCode={isIdle || isLoading ? null : isSuccess} />}
      handleCloseModal={handleCloseModal}
      handleSaveModal={handleSaveCodeSelection}
      hasCancelButton
      Header={
        <CodeSelectModalHeader
          code={code}
          codeSystem={codeSystem}
          isValidating={isLoading}
          onValidate={handleValidateCode}
          otherCodeSystem={otherCodeSystem}
          setCode={setCode}
          setCodeSystem={setCodeSystem}
          setOtherCodeSystem={setOtherCodeSystem}
        />
      }
      isOpen
      maxWidth="xl"
      submitButtonText="Select"
      submitDisabled={!code || !codeSystem}
      title="Choose code"
    >
      <div className={styles.content}>
        {isLoading && <CircularProgress />}
        {codeData && <CodeDetailsTable codeData={codeData} />}
      </div>
    </Modal>
  );
};

CodeSelectModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  handleSelectCode: PropTypes.func.isRequired
};

export default CodeSelectModal;
