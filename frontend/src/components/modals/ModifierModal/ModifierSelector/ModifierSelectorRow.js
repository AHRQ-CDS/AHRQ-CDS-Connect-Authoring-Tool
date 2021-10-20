import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Card, CardContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import clsx from 'clsx';

import { ModifierForm } from 'components/builder/modifiers';
import { Tooltip } from 'components/elements';
import { modifierCanBeRemoved } from 'components/builder/modifiers/utils';
import { validateModifier } from 'utils/instances';
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
        <Card className={styles.modifierCard} data-testid="modifier-card">
          <CardContent className={styles.modifierCardContent}>
            <ModifierForm
              elementInstance={elementInstance}
              handleUpdateModifier={handleUpdateModifier}
              modifier={modifier}
            />

            {validationWarning && <Alert severity="error">{validationWarning}</Alert>}

            <div className={styles.deleteButton}>
              <Tooltip enabled={!canBeRemoved} placement="left" title={tooltipText}>
                <IconButton
                  aria-label="delete modifier"
                  color="primary"
                  disabled={!canBeRemoved}
                  onClick={handleRemoveModifier}
                  size="large"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
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
