import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { IconButton, Stack } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import clsx from 'clsx';

import OperandTemplate from './OperandTemplate';
import { Dropdown } from 'components/elements';
import { fetchOperators } from 'queries/modifier-builder';
import ruleIsComplete from './utils/ruleIsComplete';
import useStyles from '../styles';

const RuleCard = ({ handleRemoveRule, handleUpdateRule, resourceOptions, rule }) => {
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

      <Stack alignItems="center" direction="row" flexWrap="wrap" ml="50px" width="100%" data-testid="modifier-rule">
        <Dropdown
          label="Property"
          onChange={event => handleUpdateRule({ id: rule.id, resourceProperty: event.target.value })}
          options={resourceOptions}
          SelectProps={{
            renderValue: renderPropertySelectValue,
            SelectDisplayProps: { 'data-testid': 'property-select' }
          }}
          sx={{ marginRight: '10px', width: { xs: '300px', xxl: '400px' } }}
          value={resourceProperty}
        />

        {resourceProperty && operatorsQuery.isSuccess && (
          <Dropdown
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
            sx={{ marginRight: '10px', width: { xs: '250px', xxl: '300px' } }}
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
      </Stack>

      <Stack alignSelf="flex-start" mr={1}>
        <IconButton aria-label="remove rule" onClick={handleRemoveRule}>
          <ClearIcon fontSize="small" />
        </IconButton>
      </Stack>
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
