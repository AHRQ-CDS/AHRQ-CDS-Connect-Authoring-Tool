import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { formatISO } from 'date-fns';

import ArtifactModalForm from './ArtifactModalForm';
import { Modal } from 'components/elements';
import { useInitialValues } from './hooks';
import { stripContextFields } from 'utils/fields';
import artifactProps from 'prop-types/artifact';

function dateToStringTransform(value) {
  if (value == null) return value;
  return formatISO(value);
}

const ArtifactModal = ({ artifactEditing, handleAddArtifact, handleCloseModal, handleUpdateArtifact }) => {
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const initialValues = useInitialValues(artifactEditing);
  const formRef = useRef();

  const handleSaveModal = useCallback(() => {
    formRef.current.submitForm();
  }, [formRef]);

  const validate = useCallback(values => {
    const errors = {};
    if (values.name === '') errors.name = 'Required';
    return errors;
  }, []);

  const handleSubmit = useCallback(
    values => {
      const newValues = {
        ...values,
        approvalDate: dateToStringTransform(values.approvalDate),
        lastReviewDate: dateToStringTransform(values.lastReviewDate),
        effectivePeriod: {
          start: dateToStringTransform(values.effectivePeriod.start),
          end: dateToStringTransform(values.effectivePeriod.end)
        },
        context: stripContextFields(values.context)
      };

      if (artifactEditing) {
        handleUpdateArtifact(artifactEditing, newValues);
      } else {
        handleAddArtifact(newValues);
      }

      handleCloseModal();
    },
    [artifactEditing, handleAddArtifact, handleCloseModal, handleUpdateArtifact]
  );

  return (
    <Modal
      handleCloseModal={handleCloseModal}
      handleSaveModal={handleSaveModal}
      isOpen
      maxWidth="xl"
      submitButtonText={artifactEditing ? 'Save' : 'Create'}
      submitDisabled={submitDisabled}
      title={artifactEditing ? 'Edit Artifact Details' : 'Create New Artifact'}
    >
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={validate}
        validateOnMount
      >
        <ArtifactModalForm setSubmitDisabled={setSubmitDisabled} />
      </Formik>
    </Modal>
  );
};

ArtifactModal.propTypes = {
  artifactEditing: artifactProps,
  handleAddArtifact: PropTypes.func,
  handleCloseModal: PropTypes.func.isRequired,
  handleUpdateArtifact: PropTypes.func
};

export default ArtifactModal;
