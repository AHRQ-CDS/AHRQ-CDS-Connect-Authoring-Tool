import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { ArrowBackIos as ArrowBackIosIcon } from '@material-ui/icons';
import VersionSelect from './VersionSelect';
import RuleTree from './RuleTree';
import useStyles from '../styles';

const defaultExpTree = {
  conjunctionType: 'and',
  rules: []
};

const ModifierBuilder = ({ inputType, fhirVersion, handleGoBack, setFHIRVersion }) => {
  const modalStyles = useStyles();
  const [queryTree, setQueryTree] = useState(defaultExpTree);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <div>
        <IconButton onClick={handleGoBack}>
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
      </div>
      {fhirVersion === '' ? (
        <VersionSelect setFHIRVersion={setFHIRVersion} />
      ) : (
        <>
          <div className={modalStyles.typeIndicator}>WHERE</div>
          <RuleTree
            inputType={inputType}
            fhirVersion={fhirVersion}
            onReset={() => setQueryTree(defaultExpTree)}
            rootTreeNode={queryTree}
            setRootTreeNode={setQueryTree}
          />
        </>
      )}
    </div>
  );
};

ModifierBuilder.propTypes = {
  handleGoBack: PropTypes.func.isRequired,
  setFHIRVersion: PropTypes.func.isRequired
};

export default ModifierBuilder;
