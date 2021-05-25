import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Close as CloseIcon } from '@material-ui/icons';
import clsx from 'clsx';

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
import { useFieldStyles } from 'styles/hooks';

const ModifierTemplate = ({
  baseElementIsUsed,
  elementInstance,
  handleRemoveModifier,
  handleSelectValueSet,
  handleUpdateModifier,
  index,
  modifier
}) => {
  const modifierMap = useSelector(state => state.modifiers.modifierMap);
  const fieldStyles = useFieldStyles();

  // Reset values on modifiers that were not previously set or saved in the database
  if (!modifier.values && modifierMap[modifier.id] && modifierMap[modifier.id].values) {
    modifier.values = modifierMap[modifier.id].values;
  }

  const { modifiers, returnType } = elementInstance;

  const hasMultipleModifiers = modifiers.length > 1;
  const nextModifierAllowsReturnType = Boolean(modifiers[index + 1]?.inputTypes.includes(returnType));
  const isFirstModifier = index === 0;
  const isLastModifier = index === modifiers.length - 1;
  const nextModifierAllowsPreviousReturnType = Boolean(
    modifiers[index + 1]?.inputTypes.includes(modifiers[index - 1]?.returnType)
  );
  const nextToLastModifierReturnTypeMatchesElement = Boolean(
    modifiers[modifiers.length - 2]?.returnType === getReturnType(returnType, modifiers)
  );
  const lastModifierReturnTypeMatchesElement = returnType === getReturnType(returnType, modifiers);

  let canBeRemoved = true;
  let tooltipText;
  if (hasMultipleModifiers) {
    if (isFirstModifier) {
      canBeRemoved = nextModifierAllowsReturnType;
      if (!canBeRemoved) tooltipText = 'Cannot remove expression because return type does not match next input type.';
    } else if (isLastModifier) {
      canBeRemoved = baseElementIsUsed ? nextToLastModifierReturnTypeMatchesElement : true;
      if (!canBeRemoved) tooltipText = 'Cannot remove expression because final return type would change while in use.';
    } else {
      canBeRemoved = nextModifierAllowsPreviousReturnType;
      if (!canBeRemoved) tooltipText = 'Cannot remove expression because return type does not match next input type.';
    }
  } else if (baseElementIsUsed) {
    canBeRemoved = lastModifierReturnTypeMatchesElement;
    if (!canBeRemoved) tooltipText = 'Cannot remove expression because final return type would change while in use.';
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
              maxValue: modifier.values?.maxValue ?? '',
              minOperator: modifier.values?.minOperator || '',
              minValue: modifier.values?.minValue ?? ''
            }}
          />
        );
      case 'ValueComparisonObservation':
        return (
          <ValueComparisonModifier
            handleUpdateModifier={values => handleUpdateModifier(index, values)}
            values={{
              maxOperator: modifier.values?.maxOperator || '',
              maxValue: modifier.values?.maxValue ?? '',
              minOperator: modifier.values?.minOperator || '',
              minValue: modifier.values?.minValue ?? '',
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
            values={modifier.values?.value}
          />
        );
      default:
        return <LabelModifier name={modifier.name} />;
    }
  })();

  return (
    <div className={fieldStyles.fieldDetails}>
      <div className={fieldStyles.fieldGroup}>
        {modifierForm}
        {validationWarning && <Alert severity="warning">{validationWarning}</Alert>}
      </div>

      <div className={fieldStyles.fieldButtons}>
        {tooltipText && (
          <Tooltip arrow title={tooltipText} placement="left">
            <span>
              <IconButton aria-label="remove expression" disabled color="primary">
                <CloseIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}

        {canBeRemoved && (
          <IconButton aria-label="remove expression" color="primary" onClick={() => handleRemoveModifier(index)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </div>
    </div>
  );
};

const ModifiersTemplate = ({
  baseElementIsUsed,
  elementInstance,
  handleRemoveModifier,
  handleSelectValueSet,
  handleUpdateModifier
}) => {
  const { modifiers } = elementInstance;
  const fieldStyles = useFieldStyles();

  return (
    <div className={fieldStyles.field} id="modifiers-template">
      <div className={clsx(fieldStyles.fieldLabel, fieldStyles.fieldLabelTall)}>Expressions:</div>

      <div className={fieldStyles.fieldGroup}>
        {modifiers.map((modifier, index) => (
          <ModifierTemplate
            key={index}
            baseElementIsUsed={baseElementIsUsed}
            elementInstance={elementInstance}
            handleRemoveModifier={handleRemoveModifier}
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
  handleRemoveModifier: PropTypes.func.isRequired,
  handleSelectValueSet: PropTypes.func.isRequired,
  handleUpdateModifier: PropTypes.func.isRequired
};

export default ModifiersTemplate;
