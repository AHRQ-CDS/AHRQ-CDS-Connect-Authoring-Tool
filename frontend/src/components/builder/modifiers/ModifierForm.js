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
  ValueComparisonModifier,
  WithUnitModifier
} from 'components/builder/modifiers';

const ModifierForm = ({ handleSelectValueSet, handleUpdateModifier, modifier }) => {
  switch (modifier.type || modifier.id) {
    case 'ValueComparisonNumber':
      return (
        <ValueComparisonModifier
          handleUpdateModifier={handleUpdateModifier}
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
          handleUpdateModifier={handleUpdateModifier}
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
          handleUpdateModifier={handleUpdateModifier}
          unit={modifier.values?.unit}
          value={modifier.values?.value}
        />
      );
    case 'WithUnit':
      return <WithUnitModifier handleUpdateModifier={handleUpdateModifier} unit={modifier.values?.unit} />;
    case 'BooleanComparison':
      return <BooleanComparisonModifier handleUpdateModifier={handleUpdateModifier} value={modifier.values?.value} />;
    case 'CheckExistence':
      return <CheckExistenceModifier handleUpdateModifier={handleUpdateModifier} value={modifier.values?.value} />;
    case 'ConvertObservation':
      return (
        <SelectModifier
          handleUpdateModifier={handleUpdateModifier}
          name={modifier.name}
          value={modifier.values?.value}
        />
      );
    case 'Qualifier':
      return (
        <QualifierModifier
          code={modifier.values?.code}
          handleSelectValueSet={handleSelectValueSet}
          handleUpdateModifier={handleUpdateModifier}
          qualifier={modifier.values?.qualifier}
          valueSet={modifier.values?.valueSet}
        />
      );
    case 'BeforeDateTimePrecise':
    case 'AfterDateTimePrecise':
      return (
        <DateTimeModifier
          handleUpdateModifier={handleUpdateModifier}
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
          handleUpdateModifier={handleUpdateModifier}
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
          handleUpdateModifier={handleUpdateModifier}
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
          handleUpdateModifier={handleUpdateModifier}
          name={modifier.name}
          value={modifier.values?.value}
        />
      );
    case 'ContainsDateTime':
    case 'BeforeDateTime':
    case 'AfterDateTime':
      return (
        <DateTimeModifier
          handleUpdateModifier={handleUpdateModifier}
          name={modifier.name}
          values={{ date: modifier.values?.date || '', time: modifier.values?.time || '' }}
        />
      );
    case 'EqualsString':
    case 'EndsWithString':
    case 'StartsWithString':
      return (
        <StringModifier
          handleUpdateModifier={handleUpdateModifier}
          name={modifier.name}
          value={modifier.values?.value}
        />
      );
    case 'ExternalModifier':
      return (
        <ExternalModifier
          argumentTypes={modifier.argumentTypes}
          handleUpdateModifier={handleUpdateModifier}
          modifierArguments={modifier.arguments}
          name={modifier.name}
          values={modifier.values?.value}
        />
      );
    default:
      return <LabelModifier name={modifier.name} />;
  }
};

ModifierForm.propTypes = {
  handleSelectValueSet: PropTypes.func.isRequired,
  handleUpdateModifier: PropTypes.func.isRequired,
  modifier: PropTypes.object.isRequired
};

export default ModifierForm;
