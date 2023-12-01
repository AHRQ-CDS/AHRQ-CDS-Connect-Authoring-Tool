import { flatten } from 'lodash';
import { errorStatementHasWarnings } from 'components/builder/error-statement/utils';
import { parametersHaveWarnings } from 'components/builder/parameters/utils';
import { getAllElements, getElementNames, getElements } from 'components/builder/utils';
import { hasGroupNestedWarning } from 'utils/warnings';

export const getTabMetadata = (artifact, externalCqlListLength) => {
  const { expTreeInclude, expTreeExclude, subpopulations, baseElements, recommendations, parameters, errorStatement } =
    artifact;
  const metadata = {};
  const allElements = getAllElements(artifact) ?? [];
  const names = getElementNames(allElements);
  const namedParameters = parameters.filter(({ name }) => name?.length);

  const hasInclusionErrors = hasGroupNestedWarning(
    getElements('expTreeInclude', expTreeInclude.childInstances),
    names,
    baseElements,
    namedParameters,
    allElements
  );
  metadata.expTreeInclude = {
    hasContent: expTreeInclude.childInstances.length > 0,
    hasError: hasInclusionErrors
  };

  const hasExclusionErrors = hasGroupNestedWarning(
    getElements('expTreeExclude', expTreeExclude.childInstances),
    names,
    baseElements,
    namedParameters,
    allElements
  );
  metadata.expTreeExclude = {
    hasContent: expTreeExclude.childInstances.length > 0,
    hasError: hasExclusionErrors
  };

  const filteredSubpopulations = subpopulations.filter(({ special }) => !special);
  const emptySubpopulations = filteredSubpopulations.filter(({ childInstances }) => childInstances.length === 0);
  const subpopulationInstances = flatten(filteredSubpopulations.map(({ childInstances }) => childInstances));
  const hasSubpopulationsErrors = hasGroupNestedWarning(
    subpopulationInstances,
    names,
    baseElements,
    namedParameters,
    allElements
  );
  metadata.subpopulations = {
    hasContent:
      subpopulations.length > 3 ||
      (subpopulations.length === 3 &&
        (subpopulations[2].subpopulationName !== 'Subpopulation 1' || subpopulations[2].childInstances.length > 0)),
    hasError: emptySubpopulations.length > 0 || hasSubpopulationsErrors
  };

  const hasBaseElementsErrors = hasGroupNestedWarning(
    baseElements,
    names,
    baseElements,
    namedParameters,
    allElements,
    false
  );
  metadata.baseElements = {
    hasContent: baseElements.length > 0,
    hasError: hasBaseElementsErrors
  };

  metadata.recommendations = {
    hasContent: recommendations.length > 0,
    hasError: false
  };

  metadata.parameters = {
    hasContent: parameters.length > 0,
    hasError: parametersHaveWarnings(parameters, names)
  };

  metadata.handleErrors = {
    hasContent: errorStatement.ifThenClauses[0].ifCondition.value != null,
    hasError: errorStatementHasWarnings(errorStatement, expTreeInclude, expTreeExclude)
  };

  metadata.externalCQL = {
    hasContent: externalCqlListLength > 0,
    hasError: false
  };

  return metadata;
};
