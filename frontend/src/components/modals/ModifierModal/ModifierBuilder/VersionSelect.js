import React from 'react';
import propTypes from 'prop-types';
import { Button } from '@material-ui/core';

import { useTextStyles } from 'styles/hooks';
import useStyles from '../styles';

const VersionSelect = ({ setFHIRVersion }) => {
  const modalStyles = useStyles();
  const textStyles = useTextStyles();
  return (
    <div>
      <div>
        <div>Select FHIR version to use:</div>
        <span className={textStyles.italic}>
          <span className={textStyles.bold}>Note:</span> Once the modifier you built is added, the artifact will be
          'locked' to the version you select here unless removed.
        </span>
      </div>
      <div>
        <Button
          onClick={() => setFHIRVersion('4.0.0')}
          className={modalStyles.versionButton}
          color="primary"
          variant="contained"
        >
          R4
        </Button>
        <Button
          onClick={() => setFHIRVersion('3.0.0')}
          className={modalStyles.versionButton}
          color="primary"
          variant="contained"
        >
          STU3
        </Button>
        <Button
          onClick={() => setFHIRVersion('1.0.2')}
          className={modalStyles.versionButton}
          color="primary"
          variant="contained"
        >
          DSTU2
        </Button>
      </div>
    </div>
  );
};

export default VersionSelect;

VersionSelect.propTypes = {
  setFHIRVersion: propTypes.func.isRequired
};
