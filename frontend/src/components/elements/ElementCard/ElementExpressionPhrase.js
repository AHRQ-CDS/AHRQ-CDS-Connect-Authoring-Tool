import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import useStyles from './styles';

const ElementExpressionPhrase = ({ expressions }) => {
  const styles = useStyles();

  return (
    <div className={styles.expressionPhrase}>
      {expressions.map((expression, index) => (
        <span
          key={index}
          className={clsx(expression.isTag && styles.expressionTag, expression.isType && styles.expressionType)}
        >
          {expression.label}
        </span>
      ))}
    </div>
  );
};

ElementExpressionPhrase.propTypes = {
  expressions: PropTypes.array.isRequired
};

export default ElementExpressionPhrase;
