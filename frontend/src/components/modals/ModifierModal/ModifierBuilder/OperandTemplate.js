import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack } from '@mui/material';

import { Dropdown, MultipleSelect } from 'components/elements';
import { EditorsTemplate } from 'components/builder/templates';
import { changeToCase } from 'utils/strings';
import useStyles from '../styles';

const OperandTemplate = ({ handleUpdateRule, resource, rule, selectedOperands }) => {
  const styles = useStyles();

  return (
    <>
      {selectedOperands.map(operand => (
        <Stack key={operand.id} direction="row">
          {operand.preLabel && <span className={styles.ruleLabel}>{operand.preLabel}</span>}

          {operand.type === 'editor' && (
            <Box mr="10px">
              <EditorsTemplate
                handleUpdateEditor={newValue => handleUpdateRule({ ...rule, [operand.id]: newValue })}
                isInterval={operand.typeSpecifier.type === 'IntervalTypeSpecifier'}
                isList={operand.typeSpecifier.type === 'ListTypeSpecifier'}
                type={changeToCase(operand.typeSpecifier.editorType, 'snakeCase')}
                value={rule[operand.id]}
              />
            </Box>
          )}

          {operand.type === 'selector' && operand.selectionRequiresPredefinedCodes && (
            <MultipleSelect
              // allowCustomInput={resource.allowsCustomCodes} // TODO: add support
              label="Code(s)"
              onChange={newValue => handleUpdateRule({ ...rule, [operand.id]: newValue || [] })}
              options={resource.predefinedCodes?.sort() || []}
              sx={{ width: { xs: '750px', xl: '910px' } }}
              value={rule[operand.id] || []}
            />
          )}

          {operand.type === 'selector' && !operand.selectionRequiresPredefinedCodes && (
            <Dropdown
              label={operand.name || 'Select...'}
              onChange={event => handleUpdateRule({ ...rule, [operand.id]: event.target.value || [] })}
              options={operand.selectionValues || []}
              sx={{ width: { xs: '150px', xxl: '200px' } }}
              value={rule[operand.id] || ''}
            />
          )}

          {operand.type === 'label' && <div className={styles.ruleLabel}>{operand.value}</div>}

          {operand.postLabel && <span className={styles.ruleLabel}>{operand.postLabel}</span>}
        </Stack>
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
