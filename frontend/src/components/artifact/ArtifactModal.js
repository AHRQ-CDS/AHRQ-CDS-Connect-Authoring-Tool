import React, { memo, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';

import { Modal }  from 'components/elements';
import { TextField } from 'components/fields';
import { addArtifact, updateAndSaveArtifact } from 'actions/artifacts';
import cpgFields, { versionHelperText, cpgScoreHelperText } from './cpgFields';
import { stripContextFields, getCpgCompleteCount } from 'utils/fields';

function getInitialValue(artifactEditing, valueName, defaultValue, transformer = (x) => x) {
  if (!artifactEditing || artifactEditing[valueName] == null) return defaultValue;
  return transformer(artifactEditing[valueName]);
}

const useInitialValues = artifactEditing =>
  useMemo(
    () => ({
      name: getInitialValue(artifactEditing, 'name', ''),
      version: getInitialValue(artifactEditing, 'version', ''),
      description: getInitialValue(artifactEditing, 'description', ''),
      url: getInitialValue(artifactEditing, 'url', ''),
      status: getInitialValue(artifactEditing, 'status', null),
      experimental: getInitialValue(artifactEditing, 'experimental', null, (value) => `${value}`),
      publisher: getInitialValue(artifactEditing, 'publisher', ''),
      context: getInitialValue(artifactEditing, 'context', []),
      purpose: getInitialValue(artifactEditing, 'purpose', ''),
      usage: getInitialValue(artifactEditing, 'usage', ''),
      copyright: getInitialValue(artifactEditing, 'copyright', ''),
      approvalDate: getInitialValue(artifactEditing, 'approvalDate', null),
      lastReviewDate: getInitialValue(artifactEditing, 'lastReviewDate', null),
      effectivePeriod: getInitialValue(artifactEditing, 'effectivePeriod', { start: null, end: null }),
      topic: getInitialValue(artifactEditing, 'topic', []),
      author: getInitialValue(artifactEditing, 'author', []),
      reviewer: getInitialValue(artifactEditing, 'reviewer', []),
      endorser: getInitialValue(artifactEditing, 'endorser', []),
      relatedArtifact: getInitialValue(artifactEditing, 'relatedArtifact', [])
    }),
    [artifactEditing]
  );

const ArtifactModalForm = memo(({ setSubmitDisabled }) => {
  const [openForm, setOpenForm] = useState(false);
  const { values, isValid } = useFormikContext();
  const { cpgTotalCount, cpgCompleteCount } = getCpgCompleteCount(values);
  const cpgPercentage = Math.floor(cpgCompleteCount / cpgTotalCount * 100);

  const toggleForm = useCallback(() => {
    setOpenForm(isOpen => !isOpen);
  }, []);

  useEffect(() => setSubmitDisabled(!isValid), [isValid, setSubmitDisabled]);

  return (
    <Form className="artifact-form">
      <TextField name="name" label="Artifact Name" required={true} helperText="*Required." />
      <TextField name="version" label="Version" helperText={versionHelperText} />

      <div className="cpg-score form__group">
        <label className="field-label" htmlFor="cpg-score">CPG Score:</label>

        <div id="cpg-score" className="input__group">
          <div className="cpg-percentage">
            <div className="cpg-percentage-complete" style={{ width: `${cpgPercentage}%` }}>
              <div className={classnames('cpg-percentage-label', cpgPercentage === 0 && 'zero')}>
                {cpgPercentage}%
              </div>
            </div>
          </div>

          <div className="helper-text">{cpgScoreHelperText}</div>
        </div>
      </div>

      <button
        className="cpg-button primary-button"
        onClick={toggleForm}
        aria-label="open cpg form"
        type="button"
      >
        {openForm ? 'Hide CPG Fields' : 'Show CPG Fields'}
      </button>

      {openForm && cpgFields.map(field => {
        const FormComponent = field.component;
        return <FormComponent key={field.name} isCpgField {...field} />;
      })}
    </Form>
  );
});

export default function ArtifactModal({ artifactEditing, showModal, closeModal }) {
  const dispatch = useDispatch();
  const formRef = useRef();
  const initialValues = useInitialValues(artifactEditing);
  const [submitDisabled, setSubmitDisabled] = useState(true);

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
        context: stripContextFields(values.context)
      };

      if (artifactEditing) {
        dispatch(updateAndSaveArtifact(artifactEditing, newValues));
      } else {
        dispatch(addArtifact(newValues));
      }

      closeModal();
    },
    [closeModal, dispatch, artifactEditing]
  );

  return (
    <div className="element-modal">
      <Modal
        title={artifactEditing ? 'Edit Artifact Details' : 'Create New Artifact'}
        submitButtonText={artifactEditing ? 'Save' : 'Create'}
        submitDisabled={submitDisabled}
        handleShowModal={showModal}
        handleCloseModal={closeModal}
        handleSaveModal={handleSaveModal}
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
    </div>
  );
}
