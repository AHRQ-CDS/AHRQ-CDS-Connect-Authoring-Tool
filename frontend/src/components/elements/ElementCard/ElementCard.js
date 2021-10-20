import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardContent, CardHeader } from '@mui/material';

import ElementCardHeader from './ElementCardHeader';
import ElementCardHeaderActions from './ElementCardHeaderActions';

const ElementCard = ({
  alerts,
  children,
  collapsedContent,
  commentField,
  disableDeleteMessage,
  disableTitleField,
  handleDelete,
  handleUpdateComment,
  handleUpdateTitleField,
  hasErrors,
  hideActions = false,
  label,
  setShowAllContent,
  showAllContent,
  titleField
}) => {
  const [showContent, setShowContent] = useState(true);
  const [showComment, setShowComment] = useState(false);

  useEffect(() => {
    if (showAllContent != null) setShowContent(showAllContent);
  }, [showAllContent]);

  const handleToggleContent = () => {
    setShowContent(!showContent);
    setShowAllContent(null);
  };

  return (
    <Card>
      <CardHeader
        action={
          <ElementCardHeaderActions
            disableDeleteMessage={disableDeleteMessage}
            handleDelete={handleDelete}
            handleToggleContent={handleToggleContent}
            handleToggleComment={() => setShowComment(!showComment)}
            hasComment={Boolean(commentField.value)}
            label={label}
            showContent={showContent}
            showComment={showComment}
            titleValue={titleField.value}
          />
        }
        title={
          <ElementCardHeader
            alerts={alerts}
            collapsedContent={collapsedContent}
            commentField={commentField}
            handleUpdateComment={handleUpdateComment}
            handleUpdateTitleField={handleUpdateTitleField}
            hasErrors={hasErrors}
            showComment={showComment}
            showContent={showContent}
            titleField={titleField}
            titleFieldIsDisabled={disableTitleField}
            titleLabel={label}
          />
        }
      />

      {showContent && <CardContent>{children}</CardContent>}

      {!hideActions && <CardActions></CardActions>}
    </Card>
  );
};

ElementCard.propTypes = {
  alerts: PropTypes.array,
  children: PropTypes.element.isRequired,
  collapsedContent: PropTypes.element,
  commentField: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string
  }).isRequired,
  disableDeleteMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  disableTitleField: PropTypes.bool,
  handleDelete: PropTypes.func.isRequired,
  handleUpdateTitleField: PropTypes.func.isRequired,
  hasErrors: PropTypes.bool,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  setShowAllContent: PropTypes.func.isRequired,
  showAllContent: PropTypes.bool,
  titleField: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.string
  }).isRequired
};

export default ElementCard;
