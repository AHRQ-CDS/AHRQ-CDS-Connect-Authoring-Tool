import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader } from '@material-ui/core';

import { EditorsTemplate } from 'components/builder/templates';
import { useTextStyles } from 'styles/hooks';

const TestingParameter = ({ handleUpdateParameter, parameter }) => {
  const textStyles = useTextStyles();
  const { name, type, uniqueId, value } = parameter;

  return (
    <Card id={uniqueId}>
      <CardHeader
        disableTypography
        title={
          <>
            <span className={textStyles.bold}>Parameter:{' '}</span>
            {name}
          </>
        }
      />

      <CardContent>
        <EditorsTemplate handleUpdateEditor={handleUpdateParameter} label="Value" isNested type={type} value={value} />
      </CardContent>
    </Card>
  );
};

TestingParameter.propTypes = {
  handleUpdateParameter: PropTypes.func.isRequired,
  parameter: PropTypes.object.isRequired
};

export default TestingParameter;
