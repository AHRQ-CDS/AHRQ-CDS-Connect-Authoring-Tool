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
import getModifierExpression from 'components/modals/ModifierModal/ModifierBuilder/utils/getModifierExpression';

const ModifierForm = ({ elementInstance, handleUpdateModifier, modifier }) => {
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

    case 'UserDefinedModifier':
      return (
        <UserDefinedModifier
          elementInstance={elementInstance}
          handleUpdateModifier={handleUpdateModifier}
          label={`Custom: ${getModifierExpression(modifier)}`}
          modifier={modifier}
        />
      );
    default:
      return <LabelModifier name={modifier.name} />;
  }
};

ModifierForm.propTypes = {
  elementInstance: PropTypes.object.isRequired,
  handleUpdateModifier: PropTypes.func.isRequired,
  modifier: PropTypes.object.isRequired
};

export default ModifierForm;
