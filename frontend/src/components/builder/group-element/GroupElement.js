import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Stack } from '@mui/material';
import _ from 'lodash';
import { getFieldWithId, isReturnTypeValid } from 'utils/instances';
import { ElementCard } from 'components/elements';
import { ElementSelect } from 'components/builder/element-select';
import ExpressionPhrase from 'components/builder/ExpressionPhrase';
import { ReturnTypeTemplate } from 'components/builder/templates';

const GroupElement = ({
  alerts,
  allowComment = true,
  allowIndent,
  allowOutdent,
  children,
  disable,
  disableTitleField = false,
  elementUniqueId,
  groupInstance,
  groupTitleField,
  handleAddElement,
  handleDeleteElement,
  handleIndent,
  handleOutdent,
  handleUpdateElement,
  hasErrors,
  indentParity,
  isWrapper,
  label = 'Group',
  root,
  showReturnType
}) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { baseElements } = artifact;
  const [showAllContent, setShowAllContent] = useState(true);
  const commentField = getFieldWithId(groupInstance.fields, 'comment');
  const titleField = groupTitleField ?? getFieldWithId(groupInstance.fields, 'element_name');
  const disableDeleteMessage = isWrapper
    ? `To delete this ${label}, remove all references to it.`
    : 'To edit or delete this element, remove all references to the Base Element List.';
  const hasValidReturnType = isReturnTypeValid(
    groupInstance.returnType,
    groupInstance.id,
    groupInstance.childInstances
  );

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
      allowComment={allowComment}
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
      <Stack data-testid="group-element">
        <ExpressionPhrase instance={groupInstance} baseElements={baseElements} />
        {showReturnType && (
          <ReturnTypeTemplate
            returnType={_.startCase(groupInstance.returnType)}
            returnTypeIsValid={hasValidReturnType}
          />
        )}
        {children}
        {/* Subpopulations and ListGroups will just use the containing group's select - they don't need their own */}
        {!isWrapper && (
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
  groupTitleField: PropTypes.shape({
    id: PropTypes.string,
    value: PropTypes.string
  }),
  handleAddElement: PropTypes.func.isRequired,
  handleDeleteElement: PropTypes.func.isRequired,
  handleIndent: PropTypes.func,
  handleOutdent: PropTypes.func,
  handleUpdateElement: PropTypes.func.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  indentParity: PropTypes.string,
  isWrapper: PropTypes.bool,
  label: PropTypes.string,
  showReturnType: PropTypes.bool,
  root: PropTypes.bool.isRequired
};

export default GroupElement;
