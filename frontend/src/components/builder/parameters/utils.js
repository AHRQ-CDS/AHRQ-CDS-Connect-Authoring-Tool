import { doesParameterNeedUsageWarning, parameterHasDuplicateName } from 'utils/warnings';

export const getParameterById = (parameters, id) => parameters.find(param => param.uniqueId === id);

export const getParametersByType = (parameters, type) => parameters.filter(param => param.type === type);

export const parametersHaveWarnings = (parameters, instanceNames, allInstancesInAllTrees) => {
  for (const parameter of parameters) {
    if (
      parameterHasDuplicateName(
        parameter.name,
        parameter.uniqueId,
        parameter.usedBy,
        instanceNames,
        allInstancesInAllTrees
      ) ||
      doesParameterNeedUsageWarning(parameter.name, parameter.usedBy, parameter.comment, allInstancesInAllTrees)
    )
      return true;
  }
  return false;
};
