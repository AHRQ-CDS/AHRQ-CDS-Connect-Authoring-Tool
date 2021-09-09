import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { IconButton } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import clsx from 'clsx';

import OperandTemplate from './OperandTemplate';
import { Dropdown } from 'components/elements';
import { fetchOperators } from 'queries/modifier-builder';
import ruleIsComplete from './utils/ruleIsComplete';
import { useFieldStyles } from 'styles/hooks';
import useStyles from '../styles';

const RuleCard = ({ handleRemoveRule, handleUpdateRule, resourceOptions, rule }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();
  const { resourceProperty, operator } = rule;
  const ruleOption = resourceProperty ? resourceOptions.find(({ value }) => value === resourceProperty) : null;

  const operatorsQuery = useQuery(
    ['operators', ruleOption?.typeSpecifier],
    () => fetchOperators(ruleOption.typeSpecifier),
    {
      enabled: Boolean(ruleOption)
    }
  );

  const renderPropertySelectValue = optionValue => {
    const selectedResourceOption = resourceOptions.find(({ value }) => value === optionValue);
    return `${selectedResourceOption.labelPrefix ?? ''}${selectedResourceOption.label}`;
  };

  let operatorOptions = operatorsQuery.data;
  if (operatorOptions && ruleOption.predefinedCodes && !ruleOption.allowsCustomCodes) {
    // Only predefined codes allowed, so filter out any operators that have concept operands not using predefined codes
    operatorOptions = operatorOptions.filter(operator => {
      const hasPredefinedCodesEditor = operator.userSelectedOperands?.some(op => op.selectionRequiresPredefinedCodes);
      const hasConceptOrValueSetEditor = operator.userSelectedOperands?.some(op =>
        ['System.Concept', 'valueset'].includes(op.typeSpecifier?.editorType)
      );
      return hasPredefinedCodesEditor || !hasConceptOrValueSetEditor;
    });
  } else if (operatorOptions && !ruleOption.predefinedCodes) {
    // No predefined codes, so filter out any operators that have operands requiring predefined codes
    operatorOptions = operatorOptions.filter(
      operator =>
        !operator.userSelectedOperands || !operator.userSelectedOperands.some(op => op.selectionRequiresPredefinedCodes)
    );
  }

  return (
    <div className={clsx(styles.rulesCardGroup, !ruleIsComplete(rule) && styles.rulesCardGroupIncomplete)}>
      <div className={clsx(styles.line, styles.lineHorizontal, styles.lineHorizontalRule)}></div>
      <div className={clsx(styles.line, styles.lineVertical)}></div>

      <div className={clsx(styles.rule, styles.indent)} data-testid="modifier-rule">
        <Dropdown
          className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputXl)}
          label="Property"
          onChange={event => handleUpdateRule({ id: rule.id, resourceProperty: event.target.value })}
          options={resourceOptions}
          SelectProps={{
            renderValue: renderPropertySelectValue,
            SelectDisplayProps: { 'data-testid': 'property-select' }
          }}
          value={resourceProperty}
        />

        {resourceProperty && operatorsQuery.isSuccess && (
          <Dropdown
            className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputXl)}
            label="Operator"
            labelKey="name"
            onChange={event =>
              handleUpdateRule({
                id: rule.id,
                resourceProperty: rule.resourceProperty,
                operator: operatorsQuery.data.find(({ id }) => id === event.target.value)
              })
            }
            options={operatorOptions}
            SelectProps={{ SelectDisplayProps: { 'data-testid': 'operator-select' } }}
            value={operator?.id}
            valueKey="id"
          />
        )}

        {operatorsQuery.data && operator && operator.userSelectedOperands?.length > 0 && (
          <OperandTemplate
            handleUpdateRule={handleUpdateRule}
            resource={ruleOption}
            rule={rule}
            selectedOperands={operator.userSelectedOperands}
          />
        )}
      </div>

      <div className={styles.alignIcon}>
        <IconButton aria-label="remove rule" className={styles.clearRuleButton} onClick={handleRemoveRule}>
          <ClearIcon />
        </IconButton>
      </div>
    </div>
  );
};

RuleCard.propTypes = {
  handleRemoveRule: PropTypes.func.isRequired,
  handleUpdateRule: PropTypes.func.isRequired,
  resourceOptions: PropTypes.array.isRequired,
  rule: PropTypes.object.isRequired
};

export default RuleCard;
