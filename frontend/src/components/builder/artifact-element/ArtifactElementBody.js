import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import _ from 'lodash';
import { hasBaseElementLinks } from 'utils/baseElements';
import { hasReturnTypeError, validateElement } from 'utils/warnings';
import {
  getFieldWithId,
  getFieldWithType,
  getInstanceById,
  getInstanceByReference,
  getReferenceArguments,
  getReturnType
} from 'utils/instances';
import ExpressionPhrase from 'components/builder/ExpressionPhrase';
import {
  CodeListTemplate,
  ExternalCqlTemplate,
  FieldsTemplate,
  ModifiersTemplate,
  ReferenceTemplate,
  ReturnTypeTemplate,
  ValueSetListTemplate
} from 'components/builder/templates';

const ArtifactElementBody = ({
  allInstancesInAllTrees,
  baseElementIsUsed,
  elementInstance,
  handleUpdateElement,
  instanceNames,
  updateModifiers,
  validateReturnType
}) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { baseElements } = artifact;
  const { fields, modifiers, returnType: startingReturnType } = elementInstance;
  const fieldsToRender = ['number', 'string', 'textarea', 'valueset'];
  const externalCqlField = getFieldWithId(fields, 'externalCqlReference');
  const vsacField = getFieldWithType(fields, '_vsac');
  const referenceField = getFieldWithType(fields, 'reference');

  const validationError = validateElement(elementInstance);
  const returnTypeError = hasReturnTypeError(
    getReturnType(startingReturnType, modifiers),
    modifiers,
    'boolean',
    validateReturnType
  )
    ? "Element must have return type 'boolean' (true/false). Add expression(s) to change the return type."
    : null;

  const handleDeleteValueSet = valueSetToDelete => {
    const elementInstanceClone = _.cloneDeep(elementInstance);
    const cloneVsacField = getFieldWithType(elementInstanceClone.fields, '_vsac');
    if (cloneVsacField && cloneVsacField.valueSets) {
      const updatedValueSets = cloneVsacField.valueSets;
      const indexOfVSToRemove = updatedValueSets.findIndex(
        vs => vs.name === valueSetToDelete.name && vs.oid === valueSetToDelete.oid
      );
      updatedValueSets.splice(indexOfVSToRemove, 1);
      const arrayToUpdate = [{ [cloneVsacField.id]: updatedValueSets, attributeToEdit: 'valueSets' }];
      handleUpdateElement(arrayToUpdate);
    }
  };

  const handleDeleteCode = codeToDelete => {
    const elementInstanceClone = _.cloneDeep(elementInstance);
    const cloneVsacField = getFieldWithType(elementInstanceClone.fields, '_vsac');
    if (cloneVsacField && cloneVsacField.codes) {
      const updatedCodes = [...cloneVsacField.codes];
      const indexOfCodeToRemove = updatedCodes.findIndex(
        code => code.code === codeToDelete.code && _.isEqual(code.codeSystem, codeToDelete.codeSystem)
      );
      updatedCodes.splice(indexOfCodeToRemove, 1);
      const arrayToUpdate = [{ [cloneVsacField.id]: updatedCodes, attributeToEdit: 'codes' }];
      handleUpdateElement(arrayToUpdate);
    }
  };

  const handleRemoveModifier = index => {
    const newModifiers = _.cloneDeep(elementInstance.modifiers);
    if (index > -1) newModifiers.splice(index, 1);
    updateModifiers(newModifiers);
  };

  const handleUpdateModifier = (index, values) => {
    const newModifiers = _.cloneDeep(elementInstance.modifiers);
    if (values[0]?.where) newModifiers[index] = values[0];
    else newModifiers[index].values = { ...newModifiers[index].values, ...values };
    updateModifiers(newModifiers);
  };

  return (
    <>
      {validationError && <Alert severity={'error'}>{validationError}</Alert>}
      {returnTypeError && <Alert severity={'error'}>{returnTypeError}</Alert>}

      <ExpressionPhrase instance={elementInstance} baseElements={baseElements} />

      {elementInstance.fields?.length > 2 && elementInstance.type !== 'externalCqlElement' && (
        <FieldsTemplate
          fields={elementInstance.fields.filter(
            field => fieldsToRender.includes(field.type) && field.id !== 'comment' && field.id !== 'element_name'
          )}
          handleUpdateField={handleUpdateElement}
        />
      )}

      {elementInstance.fields?.length > 2 && elementInstance.type === 'externalCqlElement' && (
        <ExternalCqlTemplate
          externalCqlArguments={externalCqlField.value.arguments ? externalCqlField.value.arguments : []}
          handleUpdateExternalCqlArguments={args => {
            handleUpdateElement({ externalCqlReference: { ...externalCqlField.value, arguments: args } });
          }}
        />
      )}

      {elementInstance.id?.includes('_vsac') && elementInstance.fields.length > 1 && (
        <>
          <ValueSetListTemplate handleDeleteValueSet={handleDeleteValueSet} valueSets={vsacField?.valueSets || []} />

          <CodeListTemplate handleDeleteCode={handleDeleteCode} codes={vsacField?.codes || []} />
        </>
      )}

      {referenceField?.id === 'externalCqlReference' &&
        referenceField.value?.arguments &&
        [...getReferenceArguments(referenceField.value.arguments)].map((arg, index) => (
          <ReferenceTemplate
            key={index}
            elementNames={instanceNames}
            referenceInstanceTab={getInstanceByReference(allInstancesInAllTrees, referenceField).tab}
            referenceField={{
              id: arg.value.argSource === 'baseElement' ? 'baseElementArgumentReference' : 'parameterArgumentReference',
              value: { id: arg.value?.selected, elementName: arg.value?.elementName }
            }}
          />
        ))}

      {referenceField && (
        <ReferenceTemplate
          elementNames={instanceNames}
          referenceInstanceTab={getInstanceByReference(allInstancesInAllTrees, referenceField).tab}
          referenceField={referenceField}
        />
      )}

      {hasBaseElementLinks(elementInstance, baseElements) &&
        [...new Set(baseElements.find(baseElement => baseElement.uniqueId === elementInstance.uniqueId).usedBy)].map(
          (link, index) => (
            <ReferenceTemplate
              key={`standalone-${link}-${index}`}
              elementNames={instanceNames}
              referenceInstanceTab={getInstanceById(allInstancesInAllTrees, link).tab}
              referenceField={{ id: 'baseElementUse', value: { id: link } }}
            />
          )
        )}

      {elementInstance.modifiers?.length > 0 && (
        <ModifiersTemplate
          baseElementIsUsed={baseElementIsUsed}
          elementInstance={elementInstance}
          handleRemoveModifier={handleRemoveModifier}
          handleUpdateModifier={handleUpdateModifier}
        />
      )}

      <ReturnTypeTemplate
        returnType={_.startCase(getReturnType(startingReturnType, modifiers))}
        returnTypeIsValid={validateReturnType !== false && getReturnType(startingReturnType, modifiers) === 'boolean'}
      />
    </>
  );
};

ArtifactElementBody.propTypes = {
  allInstancesInAllTrees: PropTypes.array.isRequired,
  baseElementIsUsed: PropTypes.bool.isRequired,
  elementInstance: PropTypes.object.isRequired,
  handleUpdateElement: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  updateModifiers: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool
};

export default ArtifactElementBody;
