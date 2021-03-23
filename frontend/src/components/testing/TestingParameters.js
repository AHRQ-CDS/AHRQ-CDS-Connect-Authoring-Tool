import React from 'react';
import PropTypes from 'prop-types';

import TestingParameter from './TestingParameter';

const TestingParameters = ({ handleUpdateParameters, parameters }) => {
  const handleUpdateParameter = (parameter, newValue, index) => {
    const params = [...parameters];
    params[index] = { ...parameter, value: newValue };
    handleUpdateParameters(params);
  };

  return (
    <>
      {parameters.length > 0 ? <br /> : ''}
      {parameters.map((parameter, index) => (
        <TestingParameter
          key={`param-${index}`}
          parameter={parameter}
          handleUpdateParameter={newValue => handleUpdateParameter(parameter, newValue, index)}
        />
      ))}
    </>
  );
};

TestingParameters.propTypes = {
  handleUpdateParameters: PropTypes.func.isRequired,
  parameters: PropTypes.array.isRequired
};

export default TestingParameters;
