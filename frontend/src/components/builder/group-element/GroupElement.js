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
  elementUniqueId,
  groupInstance,
  handleAddElement,
  handleDeleteElement,
  handleIndent,
  handleOutdent,
  handleUpdateElement,
  hasErrors,
  indentParity,
  root
}) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { baseElements } = artifact;
  const [showAllContent, setShowAllContent] = useState(true);
  const commentField = getFieldWithId(groupInstance.fields, 'comment');
  const titleField = getFieldWithId(groupInstance.fields, 'element_name');

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
      allowIndent={allowIndent}
      allowOutdent={allowOutdent}
      collapsedContent={<ExpressionPhrase closed instance={groupInstance} baseElements={baseElements} />}
      commentField={commentField}
      disableDeleteMessage={
        disable && 'To edit or delete this element, remove all references to the Base Element List.'
      }
      disableIndentMessage={
        disable && 'To edit or delete this element, remove all references to the Base Element List.'
      }
      disableTitleField={false}
      handleDelete={handleDeleteElement}
      handleIndent={handleIndent}
      handleOutdent={handleOutdent}
      handleUpdateComment={updatedField => handleUpdateElement(updatedField)}
      handleUpdateTitleField={updatedField => handleUpdateElement(updatedField)}
      hasErrors={hasErrors}
      indentParity={indentParity}
      isBaseElement={false} // Groups will never be base element uses
      label={'Group'}
      setShowAllContent={setShowAllContent}
      showAllContent={showAllContent}
      titleField={titleField}
    >
      <Stack>
        <ExpressionPhrase instance={groupInstance} baseElements={baseElements} />
        {children}
        <ElementSelect
          excludeListOperations
          handleAddElement={handleAddElement}
          indentParity={indentParity}
          isDisabled={disable}
          parentElementId={elementUniqueId}
        />
      </Stack>
    </ElementCard>
  );
};

GroupElement.propTypes = {
  alerts: PropTypes.array,
  allowIndent: PropTypes.bool,
  allowOutdent: PropTypes.bool,
  disable: PropTypes.bool.isRequired,
  elementUniqueId: PropTypes.string,
  groupInstance: PropTypes.object.isRequired,
  handleAddElement: PropTypes.func.isRequired,
  handleDeleteElement: PropTypes.func.isRequired,
  handleIndent: PropTypes.func,
  handleOutdent: PropTypes.func,
  handleUpdateElement: PropTypes.func.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  indentParity: PropTypes.string,
  root: PropTypes.bool.isRequired
};

export default GroupElement;
