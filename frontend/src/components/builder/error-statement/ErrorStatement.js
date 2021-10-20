import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader } from '@mui/material';

import NestedErrorStatement from './NestedErrorStatement';
import useStyles from './styles';

const ErrorStatement = ({ handleUpdateErrorStatement }) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { errorStatement } = artifact;
  const styles = useStyles();

  return (
    <Card>
      <CardHeader title="Handle Errors" />

      <CardContent className={styles.errorStatement}>
        <NestedErrorStatement handleUpdateErrorStatement={handleUpdateErrorStatement} statement={errorStatement} />
      </CardContent>
    </Card>
  );
};

ErrorStatement.propTypes = {
  handleUpdateErrorStatement: PropTypes.func.isRequired
};

export default ErrorStatement;
