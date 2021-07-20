import { getFieldWithId } from 'utils/instances';
import { getEditorErrors } from 'components/builder/editors/utils';

export const getParameterById = (parameters, id) => parameters.find(param => param.uniqueId === id);

export const getParametersByType = (parameters, type) => parameters.filter(param => param.type === type);

export const parameterHasDuplicateName = (parameter, elementNames) => {
  const { name: parameterName, uniqueId, usedBy } = parameter;
  const duplicate = elementNames.find(({ name, id }) => name === parameterName && id !== uniqueId);
  return Boolean(duplicate && !usedBy?.includes(duplicate.id));
};

export const parameterHasChangedUse = (parameter, allElements) => {
  const { comment, usedBy } = parameter;
  return usedBy?.some(usageId => {
    const use = allElements.find(({ uniqueId }) => uniqueId === usageId);
    if (!use) return false;
    const useComment = getFieldWithId(use.fields, 'comment')?.value || '';
    return use.modifiers?.length > 0 || useComment !== comment;
  });
};

export const parametersHaveWarnings = (parameters, elementNames) => {
  for (const parameter of parameters) {
    const editorErrors = getEditorErrors(parameter.type, parameter.value);
    if (parameterHasDuplicateName(parameter, elementNames) || editorErrors.hasErrors) return true;
  }
  return false;
};
