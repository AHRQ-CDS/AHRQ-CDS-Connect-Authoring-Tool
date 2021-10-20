import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Box, Stack } from '@mui/material';

import ElementCardLabel from './ElementCardLabel';
import { StringField, TextAreaField } from 'components/builder/fields';
import { changeToCase } from 'utils/strings';
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
  const styles = useStyles();
  const label = changeToCase(titleLabel, 'capitalCase');

  return (
    <>
      {showContent ? (
        <>
          <Stack alignItems="center" flexDirection="row">
            <ElementCardLabel label={label} />

            <Box mr={2} width="100%">
              <StringField
                field={titleField}
                handleUpdateField={handleUpdateTitleField}
                isDisabled={titleFieldIsDisabled}
              />
            </Box>
          </Stack>

          {showComment && (
            <Stack alignItems="center" flexDirection="row">
              <ElementCardLabel label="Comment" />

              <Box mr={2} width="100%">
                <TextAreaField field={commentField} handleUpdateField={handleUpdateComment} />
              </Box>
            </Stack>
          )}

          {alerts && (
            <Stack ml="215px" mt={1} mr="15px">
              {alerts.map(
                (alert, index) =>
                  alert.showAlert && (
                    <Alert key={index} severity={alert.alertSeverity}>
                      {alert.alertMessage}
                    </Alert>
                  )
              )}
            </Stack>
          )}
        </>
      ) : (
        <>
          <div className={styles.collapsedContent}>
            <ElementCardLabel label={titleField.value} />
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
