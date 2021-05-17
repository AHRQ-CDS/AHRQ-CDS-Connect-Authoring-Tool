import { v4 as uuidv4 } from 'uuid';
import pluralize from 'pluralize';
import _ from 'lodash';

import { getFieldWithId } from 'utils/instances';
import { sortAlphabeticallyByKey } from 'utils/sort';
import changeToCase from 'utils/strings';
import { isSupportedEditorType, getTypeByCqlArgument } from 'components/builder/editors/utils';

export const vsacCodeDisplayName = vsacCode =>
  vsacCode.display?.length < 60 ? vsacCode.display : `${vsacCode.codeSystem.name} ${vsacCode.code}`;

const isSupportedCqlFunction = cqlFunction => {
  if (cqlFunction.operand.length === 0 || !cqlFunction.argumentTypes) return true;
  return cqlFunction.argumentTypes.every(argType => isSupportedEditorType(argType.calculated));
};

export const generateElement = ({
  artifact,
  cqlOption,
  externalCqlList,
  option,
  subOption,
  template,
  vsacCode,
  vsacValueSet,
  vsacType
}) => {
  const { baseElements, parameters } = artifact;

  switch (option) {
    case 'demographics':
    case 'listOperations':
      return _.cloneDeep(template.entries.find(entry => entry.id === subOption));

    case 'baseElements': {
      const baseElement = baseElements.find(element => element.uniqueId === subOption);
      const commentField = getFieldWithId(baseElement.fields, 'comment');
      const nameField = getFieldWithId(baseElement.fields, 'element_name');

      return {
        id: uuidv4(),
        name: 'Base Element',
        type: 'baseElement',
        template: 'GenericStatement',
        returnType: _.isEmpty(baseElement.modifiers)
          ? baseElement.returnType
          : _.last(baseElement.modifiers).returnType,
        fields: [
          { id: 'element_name', type: 'string', name: 'Element Name', value: nameField.value },
          {
            id: 'baseElementReference',
            type: 'reference',
            name: 'reference',
            value: {
              id: baseElement.uniqueId,
              type: baseElement.type === 'parameter' ? baseElement.type : baseElement.name
            },
            static: true
          },
          { id: 'comment', type: 'textarea', name: 'Comment', value: commentField?.value || '' }
        ]
      };
    }

    case 'externalCql': {
      const cqlLibrary = externalCqlList.find(cqlLibrary => cqlLibrary._id === subOption);
      const cqlLibraryDefinitions = cqlLibrary.details.definitions.concat(cqlLibrary.details.parameters);
      const selectedCqlDefinition = cqlLibraryDefinitions.find(({ name }) => name === cqlOption);
      const cqlLibraryFunctions = cqlLibrary.details.functions.filter(cqlFunction =>
        isSupportedCqlFunction(cqlFunction)
      );
      const selectedCqlFunction = cqlLibraryFunctions.find(({ name }) => name === cqlOption);
      const selectedCqlEntry = selectedCqlDefinition || selectedCqlFunction;
      const selectedCqlEntryType = selectedCqlDefinition ? 'GenericStatement' : 'GenericFunction';

      return {
        id: uuidv4(),
        name: 'External CQL Element',
        type: 'externalCqlElement',
        template: selectedCqlEntryType,
        returnType: selectedCqlEntry.calculatedReturnType,
        fields: [
          { id: 'element_name', type: 'string', name: 'Element Name', value: selectedCqlEntry.name },
          {
            id: 'externalCqlReference',
            type: 'reference',
            name: 'reference',
            value: {
              id: `${selectedCqlEntry.name}${selectedCqlEntryType === 'GenericFunction' ? ' (Function)' : ''} from ${
                cqlLibrary.name
              }`,
              element: selectedCqlEntry.name,
              library: cqlLibrary.name,
              arguments: selectedCqlEntry?.operand
                ? selectedCqlEntry.operand.map(operand => ({ ...operand, value: { argSource: 'editor', type: getTypeByCqlArgument(operand)} }))
                : undefined
            },
            static: true
          },
          { id: 'comment', type: 'textarea', name: 'Comment', value: '' }
        ]
      };
    }

    case 'parameters': {
      const parameter = parameters.find(parameter => parameter.uniqueId === subOption);

      return {
        id: uuidv4(),
        name: parameter.name,
        type: 'parameter',
        returnType: parameter.type,
        template: 'GenericStatement',
        fields: [
          { id: 'element_name', type: 'string', name: 'Element Name', value: parameter.name },
          { id: 'default', type: 'boolean', name: 'Default', value: parameter.value },
          {
            id: 'parameterReference',
            type: 'reference',
            name: 'reference',
            value: { id: parameter.uniqueId },
            static: true
          },
          { id: 'comment', type: 'textarea', name: 'Comment', value: parameter.comment || '' }
        ]
      };
    }

    default: {
      const templateEntryName = changeToCase(pluralize.singular(option), 'capitalCase');
      const element = _.cloneDeep(template.entries.find(entry => entry.name === templateEntryName));
      const vsacCodeOrValueSet = _.cloneDeep(vsacType === 'valueSets' ? vsacValueSet : vsacCode);
      const valueName = vsacType === 'valueSets' ? vsacCodeOrValueSet.name : vsacCodeDisplayName(vsacCodeOrValueSet);
      element.type = 'element';
      element.fields[0] = { ...element.fields[0], static: true, [vsacType]: [vsacCodeOrValueSet] };
      element.fields = [
        { id: 'element_name', type: 'string', name: 'Element Name', value: valueName },
        { id: 'comment', type: 'textarea', name: 'Comment' }
      ].concat(element.fields);
      return element;
    }
  }
};

export const getElementEntries = ({ entryType, artifact, elementTemplates, externalCqlList, parentElementId }) => {
  switch (entryType) {
    case 'baseElements':
      return artifact.baseElements
        .filter(
          baseElement =>
            baseElement.fields.find(field => field.id === 'element_name').value &&
            baseElement.uniqueId !== parentElementId
        )
        .map(baseElement => ({
          value: baseElement.uniqueId,
          label: getFieldWithId(baseElement.fields, 'element_name').value
        }));
    case 'demographics':
      return elementTemplates
        .find(template => template.name === 'Demographics')
        .entries.map(entry => ({
          value: entry.id,
          label: entry.name
        }));
    case 'externalCql':
      if (!externalCqlList) return [];
      return externalCqlList.map(externalCql => {
        const cqlFunctions = externalCql.details.functions
          .filter(cqlFunction => isSupportedCqlFunction(cqlFunction))
          .map(cqlFunction => ({
            value: cqlFunction.name,
            label: `${cqlFunction.name} | Function(${cqlFunction.operand.length}) | ${cqlFunction.calculatedReturnType}`
          }));
        const cqlDefinitions = externalCql.details.definitions
          .concat(externalCql.details.parameters)
          .map(cqlDefinition => ({
            value: cqlDefinition.name,
            label: `${cqlDefinition.name} | ${cqlDefinition.calculatedReturnType}`
          }));
        return {
          value: externalCql._id,
          label: externalCql.name,
          options: cqlFunctions.concat(cqlDefinitions).sort(sortAlphabeticallyByKey('label'))
        };
      });
    case 'parameters':
      return artifact.parameters
        .filter(parameter => parameter.name)
        .map(parameter => ({
          value: parameter.uniqueId,
          label: parameter.name
        }));
    case 'listOperations':
      const operationsOptions = elementTemplates
        .find(template => template.name === 'Operations')
        .entries.map(entry => ({ value: entry.id, label: entry.name }));
      const listOperationsOptions = elementTemplates
        .find(template => template.name === 'List Operations')
        .entries.map(entry => ({
          value: entry.id,
          label: entry.name
        }));
      return listOperationsOptions.concat(operationsOptions);
    default:
      return null;
  }
};
