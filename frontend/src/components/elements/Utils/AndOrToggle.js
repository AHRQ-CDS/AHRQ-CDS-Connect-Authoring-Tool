import React from 'react';
import makeStyles from './styles';
import { useTextStyles } from 'styles/hooks';
import { Button } from '@material-ui/core';
import clsx from 'clsx';

// Since AND / OR is binary, we use a boolean to represent its state.
// When isAnd is true, AND will be selected.
const AndOrToggle = ({ isAnd, setIsAnd }) => {
  const toggleStyles = makeStyles();
  const textStyles = useTextStyles();
  return (
    <span>
      <Button
        disableTouchRipple="true"
        onClick={() => {
          if (!isAnd) setIsAnd(true);
        }}
        className={clsx(toggleStyles.button, isAnd ? toggleStyles.active : toggleStyles.inactive)}
      >
        <span className={textStyles.textBold}>AND</span>
      </Button>

      <Button
        onClick={() => {
          if (isAnd) setIsAnd(false);
        }}
        className={clsx(toggleStyles.button, isAnd ? toggleStyles.inactive : toggleStyles.active)}
      >
        <span className={textStyles.textBold}>OR</span>
      </Button>
    </span>
  );
};
export default AndOrToggle;
