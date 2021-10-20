import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation } from 'react-query';
import { Alert, CircularProgress } from '@mui/material';

import PatientDropZone from './PatientDropZone';
import PatientsTable from './PatientsTable';
import TestResults from './TestResults';
import { ELMErrorModal } from 'components/modals';
import { executeArtifact, fetchPatients, validateArtifact } from 'queries/testing';
import { useSpacingStyles } from 'styles/hooks';
import CodeService from 'utils/code_service/CodeService';
import useStyles from './styles';

export const validate404ErrorMessage = 'Unable to retrieve codes for a value set in this artifact.';

const Tester = () => {
  const [elmErrors, setElmErrors] = useState(null);
  const [executionError, setExecutionError] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const codeService = useMemo(() => new CodeService(), []);
  const { data: patients, isLoading: patientsIsLoading } = useQuery('patients', () => fetchPatients());
  const { mutateAsync: asyncValidateArtifact, isLoading: isValidating } = useMutation(validateArtifact);
  const { mutateAsync: asyncExecuteArtifact, isLoading: isExecuting } = useMutation(executeArtifact);
  const vsacApiKey = useSelector(state => state.vsac.apiKey);
  const spacingStyles = useSpacingStyles();
  const styles = useStyles();

  const handleExecuteCQL = async ({ artifact, params, dataModel, selectedPatients }) => {
    setElmErrors(null);
    setExecutionError(null);
    setTestResults(null);

    let elmFiles, validationElmErrors;
    try {
      ({ elmFiles, elmErrors: validationElmErrors } = await asyncValidateArtifact({ artifact, dataModel }));
      if (validationElmErrors?.length > 0) setElmErrors(validationElmErrors);
    } catch (error) {
      setExecutionError(
        error.response?.status === 404 ? validate404ErrorMessage : `Validation error: ${error.message}`
      );
      return;
    }

    try {
      const results = await asyncExecuteArtifact({
        elmFiles,
        artifact,
        dataModel,
        params,
        patients: selectedPatients,
        vsacApiKey,
        codeService
      });

      setTestResults({ results, patientsExecuted: selectedPatients, artifact });
    } catch (error) {
      setExecutionError(`Execution failed. Error: ${error.message}`);
    }
  };

  return (
    <div className={spacingStyles.globalPadding} id="tester maincontent">
      <PatientDropZone />

      {executionError && (
        <Alert className={spacingStyles.verticalPadding} severity="error">
          {executionError}
        </Alert>
      )}

      {(isExecuting || isValidating || patientsIsLoading) && (
        <div className={spacingStyles.center}>
          <CircularProgress />
        </div>
      )}

      {!testResults && !isExecuting && !patientsIsLoading && (
        <div className={styles.testerInstructions}>
          {!Boolean(vsacApiKey)
            ? 'Log in to VSAC to execute CQL.'
            : 'Select one or more patients below and execute CQL.'}
        </div>
      )}

      {testResults && (
        <TestResults
          artifact={testResults.artifact}
          handleOnClose={() => setTestResults(null)}
          patientsExecuted={testResults.patientsExecuted}
          results={testResults.results}
        />
      )}

      {!patientsIsLoading && <PatientsTable patients={patients || []} handleExecuteCQL={handleExecuteCQL} />}

      {elmErrors && <ELMErrorModal errors={elmErrors} handleCloseModal={() => setElmErrors(null)} />}
    </div>
  );
};

export default Tester;
