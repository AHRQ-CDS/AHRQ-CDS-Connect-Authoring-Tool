import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Close as CloseIcon } from '@material-ui/icons';

import {
  BooleanComparisonModifier,
  CheckExistenceModifier,
  DateTimeModifier,
  ExternalModifier,
  LabelModifier,
  LookBackModifier,
  NumberModifier,
  QualifierModifier,
  QuantityModifier,
  SelectModifier,
  StringModifier,
  ValueComparisonModifier,
  WithUnitModifier
} from 'components/builder/modifiers';
import { getReturnType, validateModifier } from 'utils/instances';
import useStyles from './styles';

const ModifierTemplate = ({
  canBeRemoved,
  handleRemoveLastModifier,
  handleSelectValueSet,
  handleUpdateModifier,
  index,
  isLastModifier,
  modifier
}) => {
  const modifierMap = useSelector(state => state.modifiers.modifierMap);
  const styles = useStyles();

  // Reset values on modifiers that were not previously set or saved in the database
  if (!modifier.values && modifierMap[modifier.id] && modifierMap[modifier.id].values) {
    modifier.values = modifierMap[modifier.id].values;
  }

  const validationWarning = validateModifier(modifier);

  const modifierForm = (() => {
    switch (modifier.type || modifier.id) {
      case 'ValueComparisonNumber':
        return (
          <ValueComparisonModifier
            handleUpdateModifier={values => handleUpdateModifier(index, values)}
            values={{
              maxOperator: modifier.values?.maxOperator || '',
              maxValue: modifier.values?.maxValue || '',
              minOperator: modifier.values?.minOperator || '',
              minValue: modifier.values?.minValue || ''
            }}
          />
        );
      case 'ValueComparisonObservation':
        return (
          <ValueComparisonModifier
            handleUpdateModifier={values => handleUpdateModifier(index, values)}
            values={{
              maxOperator: modifier.values?.maxOperator || '',
              maxValue: modifier.values?.maxValue || '',
              minOperator: modifier.values?.minOperator || '',
              minValue: modifier.values?.minValue || '',
              unit: modifier.values?.unit || ''
            }}
          />
        );
      case 'LookBack':
        return (
          <LookBackModifier
            handleUpdateModifier={value => handleUpdateModifier(index, value)}
            unit={modifier.values?.unit}
            value={modifier.values?.value}
          />
        );
      case 'WithUnit':
        return (
          <WithUnitModifier
            handleUpdateModifier={value => handleUpdateModifier(index, value)}
            unit={modifier.values?.unit}
          />
        );
      case 'BooleanComparison':
        return (
          <BooleanComparisonModifier
            handleUpdateModifier={value => handleUpdateModifier(index, value)}
            value={modifier.values?.value}
          />
        );
      case 'CheckExistence':
        return (
          <CheckExistenceModifier
            handleUpdateModifier={value => handleUpdateModifier(index, value)}
            value={modifier.values?.value}
          />
        );
      case 'ConvertObservation':
        return (
          <SelectModifier
            handleUpdateModifier={value => handleUpdateModifier(index, value)}
            name={modifier.name}
            value={modifier.values?.value}
          />
        );
      case 'Qualifier':
        return (
          <QualifierModifier
            code={modifier.values?.code}
            handleSelectValueSet={handleSelectValueSet}
            handleUpdateModifier={value => handleUpdateModifier(index, value)}
            qualifier={modifier.values?.qualifier}
            valueSet={modifier.values?.valueSet}
          />
        );
      case 'BeforeDateTimePrecise':
      case 'AfterDateTimePrecise':
        return (
          <DateTimeModifier
            handleUpdateModifier={value => handleUpdateModifier(index, value)}
            name={modifier.name}
            values={{
              date: modifier.values?.date || '',
              time: modifier.values?.time || '',
              precision: modifier.values?.precision || ''
            }}
          />
        );
      case 'BeforeTimePrecise':
      case 'AfterTimePrecise':
        return (
          <DateTimeModifier
            handleUpdateModifier={value => handleUpdateModifier(index, value)}
            name={modifier.name}
            values={{
              time: modifier.values?.time || '',
              precision: modifier.values?.precision || ''
            }}
          />
        );
      case 'ContainsQuantity':
      case 'BeforeQuantity':
      case 'AfterQuantity':
        return (
          <QuantityModifier
            handleUpdateModifier={value => handleUpdateModifier(index, value)}
            name={modifier.name}
            unit={modifier.values?.unit}
            value={modifier.values?.value}
          />
        );
      case 'ContainsInteger':
      case 'BeforeInteger':
      case 'AfterInteger':
      case 'ContainsDecimal':
      case 'BeforeDecimal':
      case 'AfterDecimal':
        return (
          <NumberModifier
            handleUpdateModifier={value => handleUpdateModifier(index, value)}
            name={modifier.name}
            value={modifier.values?.value}
          />
        );
      case 'ContainsDateTime':
      case 'BeforeDateTime':
      case 'AfterDateTime':
        return (
          <DateTimeModifier
            handleUpdateModifier={value => handleUpdateModifier(index, value)}
            name={modifier.name}
            values={{ date: modifier.values?.date || '', time: modifier.values?.time || '' }}
          />
        );
      case 'EqualsString':
      case 'EndsWithString':
      case 'StartsWithString':
        return (
          <StringModifier
            handleUpdateModifier={value => handleUpdateModifier(index, value)}
            name={modifier.name}
            value={modifier.values?.value}
          />
        );
      case 'ExternalModifier':
        return (
          <ExternalModifier
            argumentTypes={modifier.argumentTypes}
            handleUpdateModifier={value => handleUpdateModifier(index, value)}
            modifierArguments={modifier.arguments}
            name={modifier.name}
            value={modifier.values?.value}
          />
        );
      default:
        return <LabelModifier name={modifier.name} />;
    }
  })();

  return (
    <div className={styles.templateFieldDetails}>
      <div className={styles.templateFieldDisplayGroup}>
        {modifierForm}
        {validationWarning && <Alert severity="warning">{validationWarning}</Alert>}
      </div>

      {isLastModifier && (
        <div className={styles.templateFieldButtons}>
          {!canBeRemoved && (
            <Tooltip
              arrow
              title="Cannot remove expression because return type cannot change while in use"
              placement="left"
            >
              <span className={styles.modifierButton}>
                <IconButton aria-label="remove last expression" disabled color="primary">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}

          {canBeRemoved && (
            <IconButton aria-label="remove last expression" color="primary" onClick={handleRemoveLastModifier}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      )}
    </div>
  );
};

const ModifiersTemplate = ({
  baseElementIsUsed,
  elementInstance,
  handleRemoveLastModifier,
  handleSelectValueSet,
  handleUpdateModifier
}) => {
  const { modifiers, returnType } = elementInstance;
  const styles = useStyles();

  let canBeRemoved = true;
  if (baseElementIsUsed) {
    let nextReturnType = returnType;
    if (modifiers.length > 1) nextReturnType = modifiers[modifiers.length - 2].returnType; // new return type if last modifier removed
    canBeRemoved = nextReturnType === getReturnType(returnType, modifiers); // can be removed if they match, else cannot
  }

  return (
    <div className={styles.templateField} id="modifiers-template">
      <div className={styles.templateFieldLabel}>Expressions:</div>

      <div className={styles.templateFieldDisplayGroup}>
        {modifiers.map((modifier, index) => (
          <ModifierTemplate
            key={index}
            canBeRemoved={canBeRemoved}
            handleRemoveLastModifier={handleRemoveLastModifier}
            handleSelectValueSet={handleSelectValueSet}
            handleUpdateModifier={handleUpdateModifier}
            index={index}
            isLastModifier={index + 1 === modifiers.length}
            modifier={modifier}
          />
        ))}
      </div>
    </div>
  );
};

ModifiersTemplate.propTypes = {
  baseElementIsUsed: PropTypes.bool,
  elementInstance: PropTypes.object.isRequired,
  handleRemoveLastModifier: PropTypes.func.isRequired,
  handleSelectValueSet: PropTypes.func.isRequired,
  handleUpdateModifier: PropTypes.func.isRequired
};

export default ModifiersTemplate;
