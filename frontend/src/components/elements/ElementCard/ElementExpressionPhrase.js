import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Tooltip } from 'components/elements';

import useStyles from './styles';

const ElementExpressionPhrase = ({ closed, expressions, inModal = false }) => {
  const styles = useStyles();

  return (
    <div
      className={clsx(
        styles.expressionPhrase,
        closed && styles.expressionPhraseClosed,
        !inModal && styles.expressionBorder
      )}
    >
      {expressions.map((expression, index) => (
        <Tooltip key={index} enabled={!!expression.tooltipText} title={expression.tooltipText}>
          <span
            className={clsx(
              expression.isTag ? styles.expressionTag : styles.expressionText,
              expression.isType && styles.expressionType
            )}
          >
            {expression.label}
          </span>
        </Tooltip>
      ))}
    </div>
  );
};

ElementExpressionPhrase.propTypes = {
  closed: PropTypes.bool,
  expressions: PropTypes.array.isRequired,
  inModal: PropTypes.bool
};

export default ElementExpressionPhrase;
