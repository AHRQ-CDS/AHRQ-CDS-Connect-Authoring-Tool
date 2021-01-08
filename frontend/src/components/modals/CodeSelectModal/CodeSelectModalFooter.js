import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@material-ui/lab';

const CodeSelectModalFooter = ({ isValidCode }) => (
  <div>
    {isValidCode && <Alert severity="success">Validation Successful!</Alert>}

    {isValidCode === false &&
      <Alert severity="error">
        Validation Error: Unable to validate code and/or code system. Please try again, or select
        this code without validation.
      </Alert>
    }
  </div>
);

CodeSelectModalFooter.propTypes = {
  isValidCode: PropTypes.bool
};

export default CodeSelectModalFooter;
