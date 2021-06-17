import React from 'react';
import makeStyles from './styles';
import propTypes from 'prop-types';
import { Button } from '@material-ui/core';
import clsx from 'clsx';
import _ from 'lodash';

const ToggleSwitch = ({ labels = ['AND', 'OR'], onToggle, useLabel, value }) => {
  const styles = makeStyles();
  const active = clsx(styles.button, styles.active);
  const inactive = clsx(styles.button, styles.inactive);

  return (
    <>
      <Button disableRipple onClick={() => (!value ? onToggle() : _.noop())} className={value ? active : inactive}>
        {useLabel && <span className={styles.bold}>{_.first(labels)}</span>}
      </Button>

      <Button disableRipple onClick={() => (value ? onToggle() : _.noop())} className={!value ? active : inactive}>
        {useLabel && <span className={styles.bold}>{_.last(labels)}</span>}
      </Button>
    </>
  );
};
export default ToggleSwitch;

ToggleSwitch.propTypes = {
  labels: propTypes.array,
  onToggle: propTypes.func.isRequired,
  useLabel: propTypes.bool,
  value: propTypes.bool.isRequired
};
