import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { Modal, CqlViewer } from 'components/elements';
import { viewCql } from 'queries/artifacts';

const CQLModal = ({ handleCloseModal, artifact, dataModel }) => {
  const [executionError, setExecutionError] = useState(null);
  // For now we just show a single CQL file
  const [cqlFile, setCqlFile] = useState(null);
  const { mutateAsync: asyncViewCql, isLoading } = useMutation(viewCql);

  useEffect(() => {
    let isSubscribed = true;
    const loadCql = async () => {
      try {
        const { cqlFiles } = await asyncViewCql({ artifact, dataModel });
        if (cqlFiles.length > 0) {
          // Only update the state if the component is still mounted
          if (isSubscribed) setCqlFile(cqlFiles[0]);
        }
      } catch (error) {
        setExecutionError('Error retrieving CQL');
        return;
      }
    };
    loadCql();
    return () => (isSubscribed = false); // Cancel subscription if unmounting
  }, [artifact, dataModel, asyncViewCql]);

  return (
    <Modal
      title={cqlFile ? `${cqlFile.name}.cql` : 'Loading...'}
      submitButtonText="Close"
      isOpen
      handleCloseModal={handleCloseModal}
      handleSaveModal={handleCloseModal}
    >
      <div>
        {isLoading && 'Loading CQL'}
        {cqlFile && <CqlViewer code={cqlFile.text} />}
        {executionError}
      </div>
    </Modal>
  );
};

CQLModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  artifact: PropTypes.object.isRequired,
  dataModel: PropTypes.object.isRequired
};

export default CQLModal;
