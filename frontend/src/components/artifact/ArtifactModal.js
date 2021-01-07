import React, { memo, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import classnames from 'classnames';
import { parseISO, formatISO } from 'date-fns';

import { Modal } from 'components/elements';
import { TextField } from 'components/fields';
import { addArtifact, updateAndSaveArtifact } from 'actions/artifacts';
import cpgFields, { versionHelperText, cpgScoreHelperText } from './cpgFields';
import { stripContextFields, getCpgCompleteCount } from 'utils/fields';

function getInitialValue(artifactEditing, valueName, defaultValue, transformer = x => x) {
  if (!artifactEditing || artifactEditing[valueName] == null) return defaultValue;
  return transformer(artifactEditing[valueName]);
}

function stringToDateTransform(value) {
  if (value == null) return value;
  return parseISO(value);
}

function dateToStringTransform(value) {
  if (value == null) return value;
  return formatISO(value);
}

const useInitialValues = artifactEditing =>
  useMemo(
    () => ({
      name: getInitialValue(artifactEditing, 'name', ''),
      version: getInitialValue(artifactEditing, 'version', ''),
      description: getInitialValue(artifactEditing, 'description', ''),
      url: getInitialValue(artifactEditing, 'url', ''),
      status: getInitialValue(artifactEditing, 'status', null),
      experimental: getInitialValue(artifactEditing, 'experimental', null, value => `${value}`),
      publisher: getInitialValue(artifactEditing, 'publisher', ''),
      context: getInitialValue(artifactEditing, 'context', []),
      purpose: getInitialValue(artifactEditing, 'purpose', ''),
      usage: getInitialValue(artifactEditing, 'usage', ''),
      copyright: getInitialValue(artifactEditing, 'copyright', ''),
      approvalDate: getInitialValue(artifactEditing, 'approvalDate', null, stringToDateTransform),
      lastReviewDate: getInitialValue(artifactEditing, 'lastReviewDate', null, stringToDateTransform),
      effectivePeriod: getInitialValue(
        artifactEditing,
        'effectivePeriod',
        { start: null, end: null },
        ({ start, end }) => ({ start: stringToDateTransform(start), end: stringToDateTransform(end) })
      ),
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
  const cpgPercentage = Math.floor((cpgCompleteCount / cpgTotalCount) * 100);

  const toggleForm = useCallback(() => {
    setOpenForm(isOpen => !isOpen);
  }, []);

  useEffect(() => setSubmitDisabled(!isValid), [isValid, setSubmitDisabled]);

  return (
    <Form className="artifact-form">
      <TextField name="name" label="Artifact Name" required={true} />
      <TextField name="version" label="Version" helperText={versionHelperText} />

      <div className="cpg-score field">
        <label className="field-label" htmlFor="cpg-score">
          CPG Score:
        </label>

        <div id="cpg-score" className="field-input">
          <div className="cpg-percentage">
            <div className="cpg-percentage-complete" style={{ width: `${cpgPercentage}%` }}>
              <div className={classnames('cpg-percentage-label', cpgPercentage === 0 && 'zero')}>{cpgPercentage}%</div>
            </div>
          </div>

          <div className="helper-text">{cpgScoreHelperText}</div>
        </div>
      </div>

      <div className="cpg-button">
        <Button color="primary" onClick={toggleForm} variant="contained">
          {openForm ? 'Hide CPG Fields' : 'Show CPG Fields'}
        </Button>
      </div>

      {openForm &&
        cpgFields.map(field => {
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
        approvalDate: dateToStringTransform(values.approvalDate),
        lastReviewDate: dateToStringTransform(values.lastReviewDate),
        effectivePeriod: {
          start: dateToStringTransform(values.effectivePeriod.start),
          end: dateToStringTransform(values.effectivePeriod.end)
        },
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
        handleCloseModal={closeModal}
        handleSaveModal={handleSaveModal}
        handleShowModal={showModal}
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
    </div>
  );
}
