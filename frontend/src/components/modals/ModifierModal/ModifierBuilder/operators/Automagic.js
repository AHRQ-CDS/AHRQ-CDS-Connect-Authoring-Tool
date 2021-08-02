import React from 'react';
import { BooleanEditor, CodeEditor, DateTimeEditor, NumberEditor, ValuesetEditor } from 'components/builder/editors';
import { Dropdown } from 'components/elements';

import { useFieldStyles, useSpacingStyles } from 'styles/hooks';
import PredefinedCodeSelection from '../utils/PredefinedCodeSelection';
import ConceptListEditor from '../utils/ConceptListEditor';

import clsx from 'clsx';

const updateRuleValue = (operandValue, operandId, rule, updateRule) => {
  let newRule = { ...rule };
  newRule[operandId] = operandValue;
  updateRule(newRule);
};

const Automagic = ({ operator, resource, rule, updateRule }) => {
  const fieldStyles = useFieldStyles();
  const spacingStyles = useSpacingStyles();
  if (operator.userSelectedOperands)
    return operator.userSelectedOperands.map((operand, index) => {
      if (operand.type === 'editor') {
        let { editorType, type } = operand.typeSpecifier;

        return (
          <>
            {(() => {
              switch (editorType) {
                case 'valueset':
                  return (
                    <ValuesetEditor
                      nameValue={rule?.valueset?.name || ''}
                      oidValue={rule?.valueset?.oid || ''}
                      onChange={value => updateRuleValue(value, operand.id, rule, updateRule)}
                      label="label"
                    />
                  );

                case 'System.Boolean':
                  return (
                    <BooleanEditor
                      handleUpdateEditor={value => updateRuleValue(value, operand.id, rule, updateRule)}
                      value={rule[operand.id] || ''}
                    />
                  );
                case 'System.Code': // TODO: Add support for List<System.Concept> (It's different!)
                case 'System.Concept': // TODO: Custom component to store current concept codes. Currently overwritten on edits.
                  if (operand.typeSpecifier.type === 'ListTypeSpecifier') {
                    return (
                      <ConceptListEditor
                        onChange={values => updateRuleValue(values, operand.id, rule, updateRule)}
                        values={rule[operand.id] || []}
                      />
                    );
                  } else {
                    return (
                      <CodeEditor
                        codeButtonText="Add Concept"
                        handleUpdateEditor={value => updateRuleValue(value, operand.id, rule, updateRule)}
                      />
                    );
                  }
                case 'System.Integer':
                case 'System.Decimal':
                  return (
                    <div className={spacingStyles.marginRight}>
                      <NumberEditor
                        fullWidth={false}
                        handleUpdateEditor={value => updateRuleValue(value, operand.id, rule, updateRule)}
                        isDecimal={editorType === 'decimal'}
                        isInterval={type === 'IntervalTypeSpecifier'}
                        label="Value"
                        value={rule[operand.id] || ''}
                      />
                    </div>
                  );
                case 'System.DateTime':
                  return (
                    <DateTimeEditor
                      handleUpdateEditor={value => updateRuleValue(value, operand.id, rule, updateRule)}
                      isInterval={type === 'IntervalTypeSpecifier'}
                      isTime={type === 'System.Time'} // TODO: Is this correct? System.Time?
                      value={rule[operand.id] || {}}
                    />
                  );
                default:
                  return null;
              }
            })()}
          </>
        );
      } else if (operand.type === 'selector') {
        return operand.selectionRequiresPredefinedCodes ? (
          <PredefinedCodeSelection
            allowsCustomCodes={resource.allowsCustomCodes}
            options={resource.predefinedCodes}
            onChange={value => updateRuleValue(value, operand.id, rule, updateRule)}
            value={rule[operand.id]}
          />
        ) : (
          <div className={clsx(spacingStyles.paddingRight, spacingStyles.marginTopHalf)}>
            <Dropdown
              className={fieldStyles.fieldInputMd}
              label={operand.name || 'Select...'}
              key={`selector-${index}`}
              onChange={event => updateRuleValue(event.target.value, operand.id, rule, updateRule)}
              options={operand.selectionValues.map(val => {
                return { name: val };
              })}
              value={rule[operand.id] || ''}
              valueKey="name"
              labelKey="name"
            />
          </div>
        );
      } else return null;
    });
  else return null;
};

export default Automagic;
