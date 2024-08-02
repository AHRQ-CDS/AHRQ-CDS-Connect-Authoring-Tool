import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { isEmpty } from 'lodash';
import { Autocomplete, Paper, TextField } from '@mui/material';
import { Modal } from 'components/elements';
import { EditorsTemplate } from 'components/builder/templates';
import { useFieldStyles } from 'styles/hooks';
import { allRequests, typesInitialValues } from './structuredRequestFields';

const getInitialAction = type => {
  const request = allRequests[type];
  const initialAction = { description: '', resource: { resourceType: request.name } };
  request.elements.forEach(e => (initialAction.resource[e.name] = typesInitialValues[e.type]));
  return initialAction;
};

const getCodeFromAction = value => {
  if (value == null) {
    return null;
  }
  if (isEmpty(value.code) && isEmpty(value.system)) {
    return null;
  } else {
    return { code: value.code, display: value.display, system: value.system, uri: value.uri };
  }
};

const isElementValueEmpty = value =>
  value === '' || (typeof value === 'object' && value.code === '' && value.text === '');

const RecommendationActionModal = ({ action, closeModal, saveAction, type }) => {
  const fieldStyles = useFieldStyles();
  const [currentAction, setCurrentAction] = useState(isEmpty(action) ? getInitialAction(type) : action);
  const requestElements = allRequests[type].elements;

  const onChange = (field, value) => {
    if (field === 'description') {
      // description is only top level property that changes, so handle it separately to simplify things
      setCurrentAction({ ...currentAction, description: value });
    } else {
      setCurrentAction({ ...currentAction, resource: { ...currentAction.resource, [field]: value } });
    }
  };

  const updateCodeableConcept = (field, value, isText) => {
    if (isText) {
      setCurrentAction({
        ...currentAction,
        resource: {
          ...currentAction.resource,
          [field]: { ...currentAction.resource[field], text: value }
        }
      });
    } else {
      // Reset fields to empty string when deleting codes. value will be null if code is being deleted.
      const { code = '', display = '', system = '', uri = '' } = value ?? {};
      setCurrentAction({
        ...currentAction,
        resource: {
          ...currentAction.resource,
          [field]: { ...currentAction.resource[field], code, display, system, uri }
        }
      });
    }
  };

  const isComplete = () => {
    const requiredElements = requestElements.filter(e => e.required).map(e => e.name);
    const isComplete =
      currentAction.description !== '' &&
      requiredElements.every(name => !isElementValueEmpty(currentAction.resource[name]));
    return isComplete;
  };

  const onSubmit = () => {
    saveAction(currentAction);
  };

  const renderInput = element => {
    switch (element.type) {
      case 'code':
        return (
          <Autocomplete
            autoSelect
            autoHighlight
            className={fieldStyles.fieldInputLg}
            getOptionLabel={option => option?.label || ''}
            onChange={(e, option) => onChange(element.name, option?.value ?? '')}
            options={element.options}
            required={true}
            renderInput={params => <TextField {...params} placeholder="Select..." />}
            value={element.options.find(option => option.value === currentAction.resource[element.name]) ?? null}
          />
        );
      case 'codeableConcept':
        return (
          <Paper className={fieldStyles.group}>
            <TextField
              className={fieldStyles.field}
              id="codeable-concept-text"
              name="Text"
              placeholder="CodeableConcept text"
              onChange={event => updateCodeableConcept(element.name, event.target.value, true)}
              value={currentAction.resource[element.name].text}
            />
            <EditorsTemplate
              type="system_code"
              handleUpdateEditor={code => updateCodeableConcept(element.name, code)}
              value={getCodeFromAction(currentAction.resource[element.name])}
            />
          </Paper>
        );
      default:
        break;
    }
  };

  return (
    <Modal
      handleCloseModal={closeModal}
      handleSaveModal={onSubmit}
      isOpen
      maxWidth="xl"
      hasEnterKeySubmit={false}
      submitButtonText={isEmpty(action) ? 'Create' : 'Update'}
      title={isEmpty(action) ? 'New Action' : 'Update Action'}
      submitDisabled={!isComplete()}
    >
      <div>
        <div className={fieldStyles.field}>
          <label className={fieldStyles.fieldLabel} htmlFor="type-create">
            Type:
          </label>
          <div id="type-create" className={fieldStyles.fieldInput}>
            Create
          </div>
        </div>
        <div className={fieldStyles.field}>
          <label className={fieldStyles.fieldLabel} htmlFor="request-type">
            Request Type<span className={fieldStyles.required}>*</span>:
          </label>
          <div id="request-type" className={fieldStyles.fieldInput}>
            {allRequests[type].name}
          </div>
        </div>
        <div className={fieldStyles.field}>
          <label className={clsx(fieldStyles.fieldLabel, fieldStyles.fieldLabelGroup)} htmlFor="description">
            Description<span className={fieldStyles.required}>*</span>:
          </label>
          <div className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputFullWidth)}>
            <TextField
              className={fieldStyles.field}
              id="description"
              name="description"
              placeholder="Description of your action..."
              required={true}
              onChange={event => onChange('description', event.target.value)}
              value={currentAction.description}
            />
          </div>
        </div>
        {Object.keys(currentAction.resource)
          .filter(key => key !== 'resourceType')
          .map(key => {
            const element = requestElements.find(e => e.name === key);
            return (
              <div key={key} className={fieldStyles.field}>
                <label className={fieldStyles.fieldLabel} htmlFor={key}>
                  {element.label}
                  {element.required ? <span className={fieldStyles.required}>*</span> : ''}:
                </label>
                <div id={key} className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputFullWidth)}>
                  {renderInput(element)}
                </div>
              </div>
            );
          })}
      </div>
    </Modal>
  );
};

RecommendationActionModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  action: PropTypes.object.isRequired,
  saveAction: PropTypes.func.isRequired
};

export default RecommendationActionModal;
