import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import useStyles from './styles';

let id = 0;

const KeyValueList = ({ dense = false, list }) => {
  const styles = useStyles();
  const uniqueId = useMemo(() => `kv-${(id += 1)}`, []);

  return (
    <div className={clsx(styles.list, dense && styles.denseList)}>
      {list.map((item, index) => (
        <div key={index} className={clsx(styles.item, dense && styles.denseItem)}>
          <div id={`kv-${uniqueId}-${index}`} className={clsx(styles.key, dense && styles.denseKey)}>
            {item.key}:
          </div>
          <div aria-labelledby={`kv-${uniqueId}-${index}`}>{item.value}</div>
        </div>
      ))}
    </div>
  );
};

KeyValueList.propTypes = {
  dense: PropTypes.bool,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired
    })
  ).isRequired
};

export default KeyValueList;
