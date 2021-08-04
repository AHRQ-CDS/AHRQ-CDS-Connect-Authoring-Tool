import React from 'react';
import { Card, CardContent } from '@material-ui/core';
import clsx from 'clsx';
import {
  BooleanEditor,
  DateTimeEditor,
  NumberEditor,
  QuantityEditor,
  ValuesetEditor
} from 'components/builder/editors';
import { Dropdown } from 'components/elements';
import ConceptListEditor from '../utils/ConceptListEditor';
import PredefinedCodeSelection from '../utils/PredefinedCodeSelection';
import { useFieldStyles, useFlexStyles, useSpacingStyles } from 'styles/hooks';
import useStyles from '../../styles';

const updateRuleValue = (operandValue, operandId, rule, updateRule) => {
  let newRule = { ...rule };
  newRule[operandId] = operandValue;
  updateRule(newRule);
};

const OperandTemplate = ({ operator, resource, rule, updateRule }) => {
  const fieldStyles = useFieldStyles();
  const spacingStyles = useSpacingStyles();
  const flexStyles = useFlexStyles();
  const modalStyles = useStyles();

  // NOTE: There are three ways you can apply a label in operators.json
  // operand.preLabel - labels the editor/selector to the left
  // operand.postLabel - labels to the right of the editor/selector
  // operand - rendered not here, but down below.  You can create
  // centered labels with this option, great for taking advantage of flex.
  const applyFieldLabels = (jsxElement, preLabel = '', postLabel = '') => {
    if (preLabel === '' && postLabel === '') return jsxElement;
    return (
      <div className={flexStyles.flex}>
        {preLabel !== '' && <span className={modalStyles.preLabel}>{preLabel}</span>}
        {jsxElement}
        {postLabel !== '' && <span className={modalStyles.postLabel}>{postLabel}</span>}
      </div>
    );
  };

  if (operator.userSelectedOperands)
    return operator.userSelectedOperands.map((operand, index) => {
      if (operand.type === 'editor') {
        let { editorType, type } = operand.typeSpecifier;

        return (
          <>
            {applyFieldLabels(
              (() => {
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
                        <ConceptListEditor
                          onChange={values => updateRuleValue(values, operand.id, rule, updateRule)}
                          singular
                          values={rule[operand.id] || []}
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
                      <div>
                        <DateTimeEditor
                          handleUpdateEditor={value => updateRuleValue(value, operand.id, rule, updateRule)}
                          isInterval={type === 'IntervalTypeSpecifier'}
                          isTime={type === 'System.Time'}
                          value={rule[operand.id] || {}}
                          showLabels={type === 'IntervalTypeSpecifier'}
                        />
                      </div>
                    );
                  case 'System.Quantity':
                    return (
                      <div>
                        <QuantityEditor
                          handleUpdateEditor={value => updateRuleValue(value, operand.id, rule, updateRule)}
                          isInterval={operand.typeSpecifier.type === 'IntervalTypeSpecifier'}
                          value={rule[operand.id] || {}}
                        />
                      </div>
                    );
                  default:
                    return null;
                }
              })(),
              operand.preLabel || '',
              operand.postLabel || ''
            )}
          </>
        );
      } else if (operand.type === 'selector') {
        return applyFieldLabels(
          operand.selectionRequiresPredefinedCodes ? (
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
                options={operand.selectionValues.map(value => {
                  return operand.selectionValues.every(option => typeof option === 'object') ? value : { name: value };
                })}
                value={rule[operand.id] || ''}
                valueKey={operand.selectionValues.every(option => typeof option === 'object') ? 'value' : 'name'}
                labelKey="name"
              />
            </div>
          ),
          operand.preLabel || '',
          operand.postLabel || ''
        );
      } else if (operand.type === 'label') {
        // Custom labels (as operands) are rendered here.
        return <div className={modalStyles.label}>{operand.value}</div>;
      } else return null;
    });
  else return null;
};

export default OperandTemplate;
