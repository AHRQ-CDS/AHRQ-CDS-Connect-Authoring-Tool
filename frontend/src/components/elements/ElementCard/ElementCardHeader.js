import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@material-ui/lab';

import { StringField, TextAreaField } from 'components/builder/fields';
import { changeToCase } from 'utils/strings';
import { useTextStyles } from 'styles/hooks';
import useStyles from './styles';

const ElementCardTitle = ({
  alerts,
  collapsedContent,
  commentField,
  handleUpdateComment,
  handleUpdateTitleField,
  hasErrors,
  showComment,
  showContent,
  titleField,
  titleFieldIsDisabled,
  titleLabel
}) => {
  const textStyles = useTextStyles();
  const styles = useStyles();
  const label = changeToCase(titleLabel, 'capitalCase');

  return (
    <>
      {showContent ? (
        <>
          <div className={styles.titleGroup}>
            <div className={styles.titleLabel}>{label}:</div>

            <div className={styles.titleField}>
              <StringField
                field={titleField}
                handleUpdateField={handleUpdateTitleField}
                isDisabled={titleFieldIsDisabled}
              />
            </div>
          </div>

          {showComment && (
            <div className={styles.titleGroup}>
              <div className={styles.titleLabel}>Comment:</div>

              <div className={styles.titleField}>
                <TextAreaField field={commentField} handleUpdateField={handleUpdateComment} />
              </div>
            </div>
          )}

          {alerts && (
            <div className={styles.warningGroup}>
              {alerts.map(
                (alert, index) =>
                  alert.showAlert && (
                    <Alert key={index} severity={alert.alertSeverity}>
                      {alert.alertMessage}
                    </Alert>
                  )
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div className={styles.collapsedContent}>
            <div className={styles.titleLabel}>
              {titleField.value || <span className={textStyles.italic}>unnamed</span>}:
            </div>
            {collapsedContent && collapsedContent}
          </div>

          {hasErrors && (
            <div className={styles.collapsedErrors}>
              <Alert severity="error">Has errors.</Alert>
            </div>
          )}
        </>
      )}
    </>
  );
};

ElementCardTitle.propTypes = {
  alerts: PropTypes.array,
  collapsedContent: PropTypes.element,
  commentField: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string
  }).isRequired,
  handleUpdateComment: PropTypes.func.isRequired,
  handleUpdateTitleField: PropTypes.func.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  showComment: PropTypes.bool.isRequired,
  showContent: PropTypes.bool.isRequired,
  titleField: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.string
  }).isRequired,
  titleFieldIsDisabled: PropTypes.bool.isRequired,
  titleLabel: PropTypes.string.isRequired
};

export default ElementCardTitle;
