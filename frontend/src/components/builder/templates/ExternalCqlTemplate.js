import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Stack } from '@mui/material';
import _ from 'lodash';

import { ArgumentsTemplate } from 'components/builder/templates';
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
    <Stack data-testid="external-cql-template">
      {!allArgumentsComplete() && (
        <Alert severity="warning">
          All fields for standalone External CQL functions are required. Enter valid values for each field.
        </Alert>
      )}

      {externalCqlArguments?.map((cqlArgument, index) => (
        <ArgumentsTemplate
          key={index}
          argumentLabel={cqlArgument.name}
          argumentType={getTypeByCqlArgument(cqlArgument)}
          argumentValue={externalCqlArguments[index].value}
          handleUpdateArgument={newValue => handleSelectExternalCqlArgument(newValue, index)}
        />
      ))}
    </Stack>
  );
};

ExternalCQLTemplate.propTypes = {
  externalCqlArguments: PropTypes.array.isRequired,
  handleUpdateExternalCqlArguments: PropTypes.func.isRequired
};

export default ExternalCQLTemplate;
