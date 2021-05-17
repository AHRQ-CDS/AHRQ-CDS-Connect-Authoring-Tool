export const getParameterById = (parameters, id) => parameters.find(param => param.uniqueId === id);

export const getParametersByType = (parameters, type) => parameters.filter(param => param.type === type);
