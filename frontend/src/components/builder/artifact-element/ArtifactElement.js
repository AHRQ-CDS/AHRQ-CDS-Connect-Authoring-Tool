import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Stack } from '@mui/material';
import { useQuery } from 'react-query';
import { fetchModifiers } from 'queries/modifiers';
import { ElementCard } from 'components/elements';
import ExpressionPhrase from 'components/builder/ExpressionPhrase';
import { filterRelevantModifiers, getFieldWithId, getReturnType } from 'utils/instances';
import ArtifactElementActions from './ArtifactElementActions';
import ArtifactElementBody from './ArtifactElementBody';

const ArtifactElement = ({
  alerts,
  allowIndent = true,
  allowOutdent,
  baseElementInUsedList,
  handleDeleteElement,
  handleIndent,
  handleOutdent,
  handleUpdateElement,
  hasErrors,
  elementInstance,
  label,
  indentParity,
  updateModifiers,
  validateReturnType
}) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { baseElements, _id: artifactId } = artifact;
  const [showAllContent, setShowAllContent] = useState(true);
  const commentField = getFieldWithId(elementInstance.fields, 'comment');
  const titleField = getFieldWithId(elementInstance.fields, 'element_name');
  const baseElementIsUsed = elementInstance.usedBy ? elementInstance.usedBy.length !== 0 : false;

  const modifiersQuery = useQuery(['modifiers', { artifactId }], () => fetchModifiers({ artifactId }), {
    enabled: artifactId != null
  });
  const modifiersByInputType = useMemo(() => modifiersQuery.data?.modifiersByInputType ?? {}, [modifiersQuery.data]);
  const isLoadingModifiers = useMemo(() => modifiersQuery.isLoading, [modifiersQuery.isLoading]);

  // Base element uses will have _vsac included in the id, but should not support additional VS and codes
  const allowsVSAC =
    elementInstance.id && elementInstance.id.includes('_vsac') && elementInstance.type !== 'baseElement';
  const relevantModifiers = filterRelevantModifiers(
    modifiersByInputType[getReturnType(elementInstance.returnType, elementInstance.modifiers)],
    elementInstance
  );

  return (
    <>
      <ElementCard
        actions={
          (!elementInstance.cannotHaveModifiers && relevantModifiers.length > 0) || allowsVSAC ? (
            <ArtifactElementActions
              allowsVSAC={allowsVSAC}
              hasLimitedModifiers={baseElementInUsedList}
              elementInstance={elementInstance}
              handleUpdateElement={handleUpdateElement}
              isLoadingModifiers={isLoadingModifiers}
              modifiersByInputType={modifiersByInputType}
              updateModifiers={updateModifiers}
            />
          ) : null
        }
        alerts={alerts}
        allowIndent={allowIndent}
        allowOutdent={allowOutdent}
        collapsedContent={<ExpressionPhrase closed instance={elementInstance} baseElements={baseElements} />}
        commentField={commentField}
        disableDeleteMessage={
          (baseElementIsUsed || baseElementInUsedList) &&
          `To delete this element, remove all references to ${baseElementInUsedList ? 'the Base Element List' : 'it'}.`
        }
        disableIndentMessage={
          baseElementInUsedList && 'To edit or delete this element, remove all references to the Base Element List.'
        }
        disableTitleField={false}
        handleDelete={handleDeleteElement}
        handleIndent={handleIndent}
        handleOutdent={handleOutdent}
        handleUpdateComment={updatedField => handleUpdateElement(updatedField)}
        handleUpdateTitleField={updatedField => handleUpdateElement(updatedField)}
        hasErrors={hasErrors}
        indentParity={indentParity}
        isBaseElement={elementInstance.type === 'baseElement'}
        label={label}
        setShowAllContent={setShowAllContent}
        showAllContent={showAllContent}
        titleField={{ ...titleField, name: label }}
      >
        <Stack>
          <ArtifactElementBody
            baseElementIsUsed={baseElementIsUsed || baseElementInUsedList}
            elementInstance={elementInstance}
            handleUpdateElement={handleUpdateElement}
            updateModifiers={updateModifiers}
            validateReturnType={validateReturnType}
          />
        </Stack>
      </ElementCard>
    </>
  );
};

ArtifactElement.propTypes = {
  alerts: PropTypes.array,
  allowIndent: PropTypes.bool,
  allowOutdent: PropTypes.bool,
  baseElementInUsedList: PropTypes.bool.isRequired,
  elementInstance: PropTypes.object.isRequired,
  handleDeleteElement: PropTypes.func.isRequired,
  handleIndent: PropTypes.func,
  handleOutdent: PropTypes.func,
  handleUpdateElement: PropTypes.func.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  indentParity: PropTypes.string,
  label: PropTypes.string.isRequired,
  updateModifiers: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool
};

export default ArtifactElement;
