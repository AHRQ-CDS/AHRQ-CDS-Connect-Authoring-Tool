import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, IconButton, Tooltip } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Close as CloseIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { ModifierForm } from 'components/builder/modifiers';
import { validateModifier } from 'utils/instances';
import { modifierCanBeRemoved } from 'components/builder/modifiers/utils';
import useStyles from '../styles';

const ModifierSelectorRow = ({
  elementInstance,
  handleRemoveModifier,
  handleUpdateModifier,
  isFirst,
  modifier,
  modifiersToAdd
}) => {
  const styles = useStyles();
  const validationWarning = validateModifier(modifier);
  const { canBeRemoved, tooltipText } = modifierCanBeRemoved(
    Boolean(elementInstance.usedBy?.length > 0),
    modifiersToAdd.indexOf(modifier),
    elementInstance.returnType,
    modifiersToAdd
  );

  return (
    <div className={styles.rulesCardGroup}>
      <div className={clsx(styles.line, styles.lineHorizontal)}></div>
      <div className={clsx(styles.line, styles.lineVertical, isFirst && styles.lineVerticalTop)}></div>

      <div className={styles.indent}>
        <Card className={styles.modifierCard}>
          <CardContent className={styles.modifierCardContent}>
            <ModifierForm
              handleSelectValueSet={() => {}} // do nothing, update modifier only
              handleUpdateModifier={handleUpdateModifier}
              modifier={modifier}
            />

            {validationWarning && <Alert severity="error">{validationWarning}</Alert>}

            <div className={styles.deleteButton}>
              {tooltipText && (
                <Tooltip arrow title={tooltipText} placement="left">
                  <span>
                    <IconButton aria-label="delete modifier" disabled color="primary">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}

              {canBeRemoved && (
                <IconButton aria-label="delete modifier" color="primary" onClick={handleRemoveModifier}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

ModifierSelectorRow.propTypes = {
  elementInstance: PropTypes.object.isRequired,
  handleRemoveModifier: PropTypes.func.isRequired,
  handleUpdateModifier: PropTypes.func.isRequired,
  isFirst: PropTypes.bool.isRequired,
  modifier: PropTypes.object.isRequired,
  modifiersToAdd: PropTypes.array.isRequired
};

export default ModifierSelectorRow;
