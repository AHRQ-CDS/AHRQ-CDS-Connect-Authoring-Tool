import * as types from './types';
import { getAllElements, getBaseElementsInUse, getLibrariesInUse, getParametersInUse } from 'components/builder/utils';
import { checkForNeedToPromote, isElementUnionIntersect } from 'utils/lists';

export function updateArtifact(artifactToUpdate, props) {
  return dispatch => {
    const artifact = {
      ...artifactToUpdate,
      ...props
    };

    const allElements = getAllElements(artifact) ?? [];
    const baseElementsInUse = getBaseElementsInUse(allElements);
    const parametersInUse = getParametersInUse(allElements);
    const librariesInUse = getLibrariesInUse(allElements);

    // Add uniqueId to list on base element to mark where it is used.
    artifact.baseElements.forEach(element => {
      const elementInUse = baseElementsInUse.find(usedBaseEl => usedBaseEl.baseElementId === element.uniqueId);
      element.usedBy = elementInUse ? elementInUse.usedBy : [];
    });

    // Add uniqueId to list on parameter to mark where it is used.
    artifact.parameters.forEach(parameter => {
      const parameterInUse = parametersInUse.find(usedParameter => usedParameter.parameterId === parameter.uniqueId);
      parameter.usedBy = parameterInUse ? parameterInUse.usedBy : [];
    });

    return dispatch({
      type: types.UPDATE_ARTIFACT,
      artifact,
      librariesInUse
    });
  };
}

export function loadArtifact(artifact) {
  return dispatch => {
    const allElements = getAllElements(artifact) ?? [];
    const librariesInUse = getLibrariesInUse(allElements);

    // NOTE: This check is to ensure any Union/Intersect list groups that were created
    // before the "needToPromote" flag was added to properly promote lists
    // in CQL are marked for promotion.
    // This section of code is only really useful for a limited amount of time,
    // because eventually we can assume any artifact being used has the property
    // set appropriately. Consider deleting this after one year (April 2024).
    artifact.baseElements.forEach(baseElement => {
      if (isElementUnionIntersect(baseElement.id)) {
        checkForNeedToPromote(baseElement);
      }
    });

    return dispatch({
      type: types.LOAD_ARTIFACT,
      artifact,
      librariesInUse
    });
  };
}

export function artifactSaved(artifact) {
  return dispatch => {
    return dispatch({
      type: types.SAVE_ARTIFACT_SUCCESS,
      artifact
    });
  };
}
