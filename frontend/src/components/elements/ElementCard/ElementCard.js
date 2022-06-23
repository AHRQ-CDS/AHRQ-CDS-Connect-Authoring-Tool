import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Card, CardActions, CardContent, CardHeader } from '@mui/material';

import ElementCardHeader from './ElementCardHeader';
import ElementCardHeaderActions from './ElementCardHeaderActions';
import useStyles from './styles';

const ElementCard = ({
  actions,
  alerts,
  allowIndent,
  allowOutdent,
  children,
  collapsedContent,
  commentField,
  disableDeleteMessage,
  disableIndentMessage,
  disableTitleField,
  handleDelete,
  handleIndent,
  handleOutdent,
  handleUpdateComment,
  handleUpdateTitleField,
  hasErrors,
  isBaseElement,
  label,
  indentParity,
  setShowAllContent,
  showAllContent,
  titleField
}) => {
  const styles = useStyles();
  const [showContent, setShowContent] = useState(true);
  const [showComment, setShowComment] = useState(false);

  useEffect(() => {
    if (showAllContent != null) setShowContent(showAllContent);
  }, [showAllContent]);

  const handleToggleContent = () => {
    setShowContent(!showContent);
    setShowAllContent(null);
  };

  const background = styles[indentParity] ?? '';
  const classNames = clsx(isBaseElement && styles.baseElement, background);

  return (
    <Card className={classNames}>
      <CardHeader
        action={
          <ElementCardHeaderActions
            allowIndent={allowIndent}
            allowOutdent={allowOutdent}
            disableDeleteMessage={disableDeleteMessage}
            disableIndentMessage={disableIndentMessage}
            handleDelete={handleDelete}
            handleIndent={handleIndent}
            handleOutdent={handleOutdent}
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

      {actions && showContent && <CardActions>{actions}</CardActions>}
    </Card>
  );
};

ElementCard.propTypes = {
  actions: PropTypes.element,
  alerts: PropTypes.array,
  allowIndent: PropTypes.bool,
  allowOutdent: PropTypes.bool,
  children: PropTypes.element.isRequired,
  collapsedContent: PropTypes.element,
  commentField: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string
  }).isRequired,
  disableDeleteMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  disableIndentMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disableTitleField: PropTypes.bool,
  handleDelete: PropTypes.func.isRequired,
  handleIndent: PropTypes.func,
  handleOutdent: PropTypes.func,
  handleUpdateComment: PropTypes.func.isRequired,
  handleUpdateTitleField: PropTypes.func.isRequired,
  hasErrors: PropTypes.bool,
  indentParity: PropTypes.string,
  isBaseElement: PropTypes.bool,
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
