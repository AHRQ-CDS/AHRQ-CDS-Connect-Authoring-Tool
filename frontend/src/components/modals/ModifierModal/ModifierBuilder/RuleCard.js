import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { IconButton } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
import { fetchOperators } from 'queries/modifier-builder';
import { useFieldStyles } from 'styles/hooks';
import { useSelector } from 'react-redux';
import useStyles from '../styles';

const RuleCard = ({ handleRemoveRule, handleUpdate, resourceOptions, rule }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();
  const { resourceProperty, ruleType } = rule;
  const ruleOption = resourceProperty ? resourceOptions.find(option => option.value === resourceProperty) : null;
  const typeConversionInfo = useSelector(state => state.modifiers.typeConversionData);
  const operatorsQuery = useQuery(
    ['operators', ruleOption?.typeSpecifier],
    () => fetchOperators(typeConversionInfo, ruleOption.typeSpecifier),
    {
      enabled: Boolean(ruleOption)
    }
  );
  const renderPropertySelectValue = optionValue => {
    const selectedResourceOption = resourceOptions.find(({ value }) => value === optionValue);
    return `${selectedResourceOption.labelPrefix ?? ''}${selectedResourceOption.label}`;
  };

  return (
    <div className={styles.rulesCardGroup}>
      <div className={clsx(styles.line, styles.lineHorizontal, styles.lineHorizontalRule)}></div>
      <div className={clsx(styles.line, styles.lineVertical)}></div>

      <div className={clsx(styles.rule, styles.indent)}>
        <Dropdown
          className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputLg)}
          label="Property"
          onChange={event => handleUpdate({ id: rule.id, resourceProperty: event.target.value, operator: '' })}
          options={resourceOptions}
          value={resourceProperty}
          SelectProps={{ renderValue: renderPropertySelectValue }}
        />

        {resourceProperty && operatorsQuery.isSuccess && (
          <Dropdown
            className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputLg)}
            label="Operator"
            labelKey="name"
            onChange={event => handleUpdate({ ...rule, ruleType: event.target.value })}
            options={operatorsQuery.data}
            value={ruleType}
            valueKey="id"
          />
        )}

        {(() => {
          if (operatorsQuery.data) {
            let operatorData = operatorsQuery.data.find(op => op.id === ruleType);
            if (!operatorData) return null;
            switch (ruleType) {
              default:
                return null;
            }
          } else return null;
        })()}

        <IconButton className={styles.clearRuleButton} onClick={handleRemoveRule}>
          <ClearIcon />
        </IconButton>
      </div>
    </div>
  );
};

RuleCard.propTypes = {
  handleRemoveRule: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  resourceOptions: PropTypes.array.isRequired,
  rule: PropTypes.object.isRequired
};

export default RuleCard;
