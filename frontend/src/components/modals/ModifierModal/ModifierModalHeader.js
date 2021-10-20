import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@mui/material';
import { ArrowForward as ArrowForwardIcon, Check as CheckIcon } from '@mui/icons-material';
import clsx from 'clsx';

import ExpressionPhrase from 'components/builder/ExpressionPhrase';
import { changeToCase } from 'utils/strings';
import { useSpacingStyles } from 'styles/hooks';
import useStyles from '../styles';

const ModifierModalHeader = ({ elementInstance, modifiersToAdd }) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { baseElements } = artifact;
  const modifiersReturnType = modifiersToAdd[modifiersToAdd.length - 1]?.returnType;
  const spacingStyles = useSpacingStyles();
  const styles = useStyles();

  return (
    <Card className={styles.header}>
      <CardContent>
        <div className={styles.headerTag}>
          <div className={clsx(styles.headerIndicator, styles.headerIndicatorHighlight)}>
            <ExpressionPhrase
              instance={{ ...elementInstance, modifiers: modifiersToAdd }}
              baseElements={baseElements}
            />
          </div>
        </div>

        <div className={styles.headerTag}>
          <div className={styles.headerIndicator} data-testid="modifier-return-type">
            <span className={styles.headerIndicatorLabel}>Return Type:</span>
            {changeToCase(elementInstance.returnType, 'capitalCase')}
            {modifiersReturnType && (
              <>
                <ArrowForwardIcon className={spacingStyles.horizontalPadding} fontSize="small" />
                {modifiersReturnType === 'boolean' && <CheckIcon fontSize="small" />}
                {changeToCase(modifiersReturnType, 'capitalCase')}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

ModifierModalHeader.propTypes = {
  elementInstance: PropTypes.object.isRequired,
  modifiersToAdd: PropTypes.array.isRequired
};

export default ModifierModalHeader;
