import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { Dropdown, MultipleSelect } from 'components/elements';
import { EditorsTemplate } from 'components/builder/templates';
import { changeToCase } from 'utils/strings';
import { useFieldStyles } from 'styles/hooks';
import useStyles from '../styles';

const OperandTemplate = ({ handleUpdateRule, resource, rule, selectedOperands }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  return (
    <>
      {selectedOperands.map(operand => (
        <div className={styles.operandGroup} key={operand.id}>
          {operand.preLabel && <span className={styles.ruleLabel}>{operand.preLabel}</span>}

          {operand.type === 'editor' && (
            <EditorsTemplate
              handleUpdateEditor={newValue => handleUpdateRule({ ...rule, [operand.id]: newValue })}
              isInterval={operand.typeSpecifier.type === 'IntervalTypeSpecifier'}
              isList={operand.typeSpecifier.type === 'ListTypeSpecifier'}
              type={changeToCase(operand.typeSpecifier.editorType, 'snakeCase')}
              value={rule[operand.id]}
            />
          )}

          {operand.type === 'selector' && operand.selectionRequiresPredefinedCodes && (
            <div className={fieldStyles.fieldInputXxl}>
              <MultipleSelect
                // allowCustomInput={resource.allowsCustomCodes} // TODO: add support
                label="Code(s)"
                onChange={newValue => handleUpdateRule({ ...rule, [operand.id]: newValue || [] })}
                options={resource.predefinedCodes?.sort() || []}
                value={rule[operand.id] || []}
              />
            </div>
          )}

          {operand.type === 'selector' && !operand.selectionRequiresPredefinedCodes && (
            <div className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputLg)}>
              <Dropdown
                label={operand.name || 'Select...'}
                onChange={event => handleUpdateRule({ ...rule, [operand.id]: event.target.value || [] })}
                options={operand.selectionValues || []}
                value={rule[operand.id] || ''}
              />
            </div>
          )}

          {operand.type === 'label' && <div className={styles.ruleLabel}>{operand.value}</div>}

          {operand.postLabel && <span className={styles.ruleLabel}>{operand.postLabel}</span>}
        </div>
      ))}
    </>
  );
};

OperandTemplate.propTypes = {
  handleUpdateRule: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  rule: PropTypes.object.isRequired,
  selectedOperands: PropTypes.array.isRequired
};

export default OperandTemplate;
