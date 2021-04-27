import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@material-ui/lab';
import _ from 'lodash';

import EditorsTemplate from './EditorsTemplate';
import { getTypeByCqlArgument } from 'components/builder/editors/utils';

const ExternalCQLTemplate = ({ externalCqlArguments, handleUpdateExternalCqlArguments }) => {
  const allArgumentsComplete = () => {
    return externalCqlArguments
      ? externalCqlArguments.every(cqlArgument => cqlArgument.value && cqlArgument.value !== '')
      : true;
  };

  const handleSelectExternalCqlArgument = (newArgValue, index) => {
    let newExternalCqlArguments = _.cloneDeep(externalCqlArguments);
    newExternalCqlArguments[index].value = newArgValue;
    handleUpdateExternalCqlArguments(newExternalCqlArguments);
  };

  return (
    <div id="external-cql-template">
      {!allArgumentsComplete() && (
        <Alert severity="warning">All fields for standalone External CQL functions are required.</Alert>
      )}

      {externalCqlArguments?.map((cqlArgument, index) => (
        <EditorsTemplate
          key={index}
          handleUpdateEditor={newArgValue => handleSelectExternalCqlArgument(newArgValue, index)}
          label={cqlArgument.name}
          showArgumentType
          type={getTypeByCqlArgument(cqlArgument)}
          value={cqlArgument.value}
        />
      ))}
    </div>
  );
};

ExternalCQLTemplate.propTypes = {
  externalCqlArguments: PropTypes.array.isRequired,
  handleUpdateExternalCqlArguments: PropTypes.func.isRequired
};

export default ExternalCQLTemplate;
