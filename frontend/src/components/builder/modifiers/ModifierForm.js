import React from 'react';
import PropTypes from 'prop-types';

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
  UserDefinedModifier,
  ValueComparisonModifier,
  WithUnitModifier
} from 'components/builder/modifiers';

const ModifierForm = ({ elementInstance, index, handleSelectValueSet, handleUpdateModifier, modifier }) => {
  const handleUpdateModifierValues = values => {
    handleUpdateModifier({ values });
  };
  switch (modifier.type || modifier.id) {
    case 'ValueComparisonNumber':
      return (
        <ValueComparisonModifier
          handleUpdateModifier={handleUpdateModifierValues}
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
          handleUpdateModifier={handleUpdateModifierValues}
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
          handleUpdateModifier={handleUpdateModifierValues}
          unit={modifier.values?.unit}
          value={modifier.values?.value}
        />
      );
    case 'WithUnit':
      return <WithUnitModifier handleUpdateModifier={handleUpdateModifierValues} unit={modifier.values?.unit} />;
    case 'BooleanComparison':
      return (
        <BooleanComparisonModifier handleUpdateModifier={handleUpdateModifierValues} value={modifier.values?.value} />
      );
    case 'CheckExistence':
      return (
        <CheckExistenceModifier handleUpdateModifier={handleUpdateModifierValues} value={modifier.values?.value} />
      );
    case 'ConvertObservation':
      return (
        <SelectModifier
          handleUpdateModifier={handleUpdateModifierValues}
          name={modifier.name}
          value={modifier.values?.value}
        />
      );
    case 'Qualifier':
      return (
        <QualifierModifier
          code={modifier.values?.code}
          handleSelectValueSet={handleSelectValueSet}
          handleUpdateModifier={handleUpdateModifierValues}
          qualifier={modifier.values?.qualifier}
          valueSet={modifier.values?.valueSet}
        />
      );
    case 'BeforeDateTimePrecise':
    case 'AfterDateTimePrecise':
      return (
        <DateTimeModifier
          handleUpdateModifier={handleUpdateModifierValues}
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
          handleUpdateModifier={handleUpdateModifierValues}
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
          handleUpdateModifier={handleUpdateModifierValues}
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
          handleUpdateModifier={handleUpdateModifierValues}
          name={modifier.name}
          value={modifier.values?.value}
        />
      );
    case 'ContainsDateTime':
    case 'BeforeDateTime':
    case 'AfterDateTime':
      return (
        <DateTimeModifier
          handleUpdateModifier={handleUpdateModifierValues}
          name={modifier.name}
          values={{ date: modifier.values?.date || '', time: modifier.values?.time || '' }}
        />
      );
    case 'EqualsString':
    case 'EndsWithString':
    case 'StartsWithString':
      return (
        <StringModifier
          handleUpdateModifier={handleUpdateModifierValues}
          name={modifier.name}
          value={modifier.values?.value}
        />
      );
    case 'ExternalModifier':
      return (
        <ExternalModifier
          argumentTypes={modifier.argumentTypes}
          handleUpdateModifier={handleUpdateModifierValues}
          modifierArguments={modifier.arguments}
          name={modifier.name}
          values={modifier.values?.value}
        />
      );

    case 'UserDefinedModifier':
      return (
        <UserDefinedModifier
          elementInstance={elementInstance}
          index={index}
          handleUpdateModifier={handleUpdateModifier}
          label="Custom Expression"
          modifier={modifier}
        />
      );
    default:
      return <LabelModifier name={modifier.name} />;
  }
};

ModifierForm.propTypes = {
  elementInstance: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  handleSelectValueSet: PropTypes.func.isRequired,
  handleUpdateModifier: PropTypes.func.isRequired,
  modifier: PropTypes.object.isRequired
};

export default ModifierForm;
