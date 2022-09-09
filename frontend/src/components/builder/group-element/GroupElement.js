import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Stack } from '@mui/material';
import { getFieldWithId } from 'utils/instances';
import { ElementCard } from 'components/elements';
import { ElementSelect } from 'components/builder/element-select';
import ExpressionPhrase from 'components/builder/ExpressionPhrase';

const GroupElement = ({
  alerts,
  allowIndent,
  allowOutdent,
  children,
  disable,
  disableTitleField = false,
  elementUniqueId,
  groupInstance,
  handleAddElement,
  handleDeleteElement,
  handleIndent,
  handleOutdent,
  handleUpdateElement,
  hasErrors,
  indentParity,
  isSubpopulation,
  label = 'Group',
  root
}) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { baseElements } = artifact;
  const [showAllContent, setShowAllContent] = useState(true);
  const commentField = getFieldWithId(groupInstance.fields, 'comment');
  let titleField = getFieldWithId(groupInstance.fields, 'element_name');
  if (isSubpopulation) {
    titleField = { id: 'subpopulation_title', value: groupInstance.subpopulationName };
  }
  const disableDeleteMessage = isSubpopulation
    ? 'To delete this subpopulation, remove all references to it.'
    : 'To edit or delete this element, remove all references to the Base Element List.';

  if (root) {
    return (
      <Stack data-testid="root">
        {children}
        <ElementSelect
          excludeListOperations
          handleAddElement={handleAddElement}
          indentParity={indentParity}
          isDisabled={disable}
          parentElementId={elementUniqueId}
        />
      </Stack>
    );
  }

  return (
    <ElementCard
      alerts={alerts}
      allowComment={!isSubpopulation} // Subpopulations themselves cannot be commented on
      allowIndent={allowIndent}
      allowOutdent={allowOutdent}
      collapsedContent={<ExpressionPhrase closed instance={groupInstance} baseElements={baseElements} />}
      commentField={commentField}
      disableDeleteMessage={disable && disableDeleteMessage}
      disableIndentMessage={
        disable && 'To edit or delete this element, remove all references to the Base Element List.'
      }
      disableTitleField={disableTitleField}
      handleDelete={handleDeleteElement}
      handleIndent={handleIndent}
      handleOutdent={handleOutdent}
      handleUpdateComment={updatedField => handleUpdateElement(updatedField)}
      handleUpdateTitleField={updatedField => handleUpdateElement(updatedField)}
      hasErrors={hasErrors}
      indentParity={indentParity}
      isBaseElement={false} // Groups will never be base element uses
      label={label}
      setShowAllContent={setShowAllContent}
      showAllContent={showAllContent}
      titleField={titleField}
    >
      <Stack>
        <ExpressionPhrase instance={groupInstance} baseElements={baseElements} />
        {children}
        {/* Subpopulations will just use the containing group's select - they don't need their own */}
        {!isSubpopulation && (
          <ElementSelect
            excludeListOperations
            handleAddElement={handleAddElement}
            indentParity={indentParity}
            isDisabled={disable}
            parentElementId={elementUniqueId}
          />
        )}
      </Stack>
    </ElementCard>
  );
};

GroupElement.propTypes = {
  alerts: PropTypes.array,
  allowIndent: PropTypes.bool,
  allowOutdent: PropTypes.bool,
  disable: PropTypes.bool.isRequired,
  disableTitleField: PropTypes.bool,
  elementUniqueId: PropTypes.string,
  groupInstance: PropTypes.object.isRequired,
  handleAddElement: PropTypes.func.isRequired,
  handleDeleteElement: PropTypes.func.isRequired,
  handleIndent: PropTypes.func,
  handleOutdent: PropTypes.func,
  handleUpdateElement: PropTypes.func.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  indentParity: PropTypes.string,
  isSubpopulation: PropTypes.bool,
  label: PropTypes.string,
  root: PropTypes.bool.isRequired
};

export default GroupElement;
