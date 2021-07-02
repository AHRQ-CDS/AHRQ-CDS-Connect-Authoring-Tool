import React from 'react';
import PropTypes from 'prop-types';
import { produce } from 'immer';
import { Button, Card, IconButton } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';

import RuleCard from './RuleCard';
import { ToggleSwitch } from 'components/elements';
import useStyles from '../styles';

const ConjunctionCard = ({ depth, handleRemoveConjunction, handleUpdate, resourceOptions, rule }) => {
  const { conjunctionType, rules } = rule;
  const styles = useStyles();

  const handleToggleSwitch = newConjunctionType => {
    if (newConjunctionType !== conjunctionType) handleUpdate({ ...rule, conjunctionType: newConjunctionType });
  };

  const addGroup = () => {
    handleUpdate({
      ...rule,
      rules: [...rules, { id: uuidv4(), conjunctionType: 'and', rules: [] }]
    });
  };

  const addRule = () => {
    handleUpdate({ ...rule, rules: [...rules, { id: uuidv4(), resourceProperty: '', operator: '' }] });
  };

  const removeRule = ruleIndex => {
    handleUpdate(
      produce(rule, draftRule => {
        draftRule.rules.splice(ruleIndex, 1);
      })
    );
  };

  return (
    <div className={styles.rulesCardGroup}>
      {depth !== 0 && (
        <>
          <div className={clsx(styles.line, styles.lineHorizontal, styles.lineHorizontalCard)}></div>
          <div className={clsx(styles.line, styles.lineVertical)}></div>
        </>
      )}

      <Card className={clsx(styles.rulesCard, depth !== 0 && styles.indent, depth % 2 === 1 && styles.rulesCardOdd)}>
        <div className={styles.rulesCardGroup}>
          <div className={clsx(styles.line, styles.lineHorizontal, depth !== 0 && styles.lineHorizontalConnect)}></div>
          <div className={clsx(styles.line, styles.lineVertical, styles.lineVerticalTop)}></div>
          <ToggleSwitch className={styles.indent} onToggle={handleToggleSwitch} value={conjunctionType} />
        </div>

        {handleRemoveConjunction && (
          <IconButton className={styles.deleteButton} onClick={handleRemoveConjunction}>
            <ClearIcon />
          </IconButton>
        )}

        {rules.map((nestedRule, index) => {
          const nestedUpdate = newState =>
            handleUpdate(
              produce(rule, draftRule => {
                draftRule.rules[index] = newState;
              })
            );

          return nestedRule.conjunctionType ? (
            <ConjunctionCard
              key={nestedRule.id}
              rule={nestedRule}
              depth={depth + 1}
              handleRemoveConjunction={() => removeRule(index)}
              handleUpdate={nestedUpdate}
              resourceOptions={resourceOptions}
            />
          ) : (
            <RuleCard
              key={nestedRule.id}
              rule={nestedRule}
              handleRemoveRule={() => removeRule(index)}
              handleUpdate={nestedUpdate}
              resourceOptions={resourceOptions}
            />
          );
        })}

        <div className={clsx(styles.rulesCardGroup)}>
          <div className={clsx(styles.line, styles.lineHorizontal)}></div>
          <div className={clsx(styles.line, styles.lineVertical, styles.lineVerticalBottom)}></div>

          <div className={styles.indent}>
            <Button className={styles.textButton} onClick={addRule} color="primary" size="small">
              ADD RULE
            </Button>

            <Button className={styles.textButton} onClick={addGroup} color="primary" size="small">
              ADD GROUP
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

ConjunctionCard.propTypes = {
  depth: PropTypes.number.isRequired,
  handleRemoveConjunction: PropTypes.func,
  handleUpdate: PropTypes.func.isRequired,
  resourceOptions: PropTypes.array.isRequired,
  rule: PropTypes.object.isRequired
};

export default ConjunctionCard;
