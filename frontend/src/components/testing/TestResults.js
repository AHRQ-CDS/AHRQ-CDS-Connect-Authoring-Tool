import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Paper } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import TestResultsSection from './TestResultsSection';
import { KeyValueList } from 'components/elements';
import { getPatientId, getPatientFullName } from 'utils/patients';
import { useSpacingStyles } from 'styles/hooks';
import useStyles from './styles';

const TestResults = ({ artifact, handleOnClose, patientsExecuted, results }) => {
  const spacingStyles = useSpacingStyles();
  const styles = useStyles();
  const resultsArray = useMemo(() => Object.values(results.patientResults), [results]);
  const resultsIncludedCount = useMemo(() => resultsArray.filter(r => r.MeetsInclusionCriteria).length, [resultsArray]);
  const resultsExcludedCount = useMemo(() => resultsArray.filter(r => r.MeetsExclusionCriteria).length, [resultsArray]);
  const resultsCount = resultsArray.length;

  const resultsMetaList = [
    { key: 'Artifact', value: artifact.name },
    { key: 'Meets Inclusion Criteria', value: `${resultsIncludedCount} of ${resultsCount} patients` },
    { key: 'Meets Exclusion Criteria', value: `${resultsExcludedCount} of ${resultsCount} patients` }
  ];

  return (
    <Paper className={styles.testResults}>
      <IconButton className={styles.closeButton} onClick={handleOnClose}>
        <CloseIcon />
      </IconButton>

      <div className={styles.testResultsTitle}>CQL Execution Results</div>
      <KeyValueList list={resultsMetaList} />

      <div className={spacingStyles.verticalPadding}>
        {patientsExecuted.map(patient => {
          const patientId = getPatientId({ patient });
          return (
            <TestResultsSection
              key={patientId}
              patientName={getPatientFullName({ patient })}
              results={results.patientResults[patientId]}
            />
          );
        })}
      </div>
    </Paper>
  );
};

TestResults.propTypes = {
  artifact: PropTypes.object.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  patientsExecuted: PropTypes.array.isRequired,
  results: PropTypes.object.isRequired
};

export default TestResults;
