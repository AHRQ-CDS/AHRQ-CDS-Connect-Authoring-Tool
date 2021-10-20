import React, { memo, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { useLatest, usePrevious } from 'react-use';
import { Alert, Button, CircularProgress } from '@mui/material';
import { useField } from 'formik';

import codeSystemOptions from 'data/codeSystemOptions';
import validateCode from 'queries/validateCode';
import AutocompleteField from './AutocompleteField';
import TextField from './TextField';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const CodeSelectField = ({ namePrefix }) => {
  const codeFieldName = namePrefix ? `${namePrefix}.code` : 'code';
  const systemFieldName = namePrefix ? `${namePrefix}.system` : 'system';
  const otherFieldName = namePrefix ? `${namePrefix}.other` : 'other';
  const { mutateAsync, data: codeData, isLoading, isSuccess, isError, isIdle, reset } = useMutation(validateCode);
  const vsacApiKey = useSelector(state => state.vsac.apiKey);
  const [{ value: codeFieldValue }] = useField(codeFieldName);
  const [{ value: systemFieldValue }] = useField(systemFieldName);
  const [{ value: otherFieldValue }] = useField(otherFieldName);
  const prevCodeValue = usePrevious(codeFieldValue);
  const prevSystemValue = usePrevious(systemFieldValue);
  const prevOtherValue = usePrevious(otherFieldValue);
  const fieldValuesRef = useLatest({
    code: codeFieldValue,
    system: systemFieldValue,
    other: otherFieldValue
  });
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  const handleValidateCode = useCallback(() => {
    const { code, system } = fieldValuesRef.current;

    if (!system || !code || !vsacApiKey) return;
    const systemId = codeSystemOptions.find(({ value }) => value === system).id;
    mutateAsync({ code, system: systemId, apiKey: vsacApiKey });
  }, [mutateAsync, fieldValuesRef, vsacApiKey]);

  const shouldReset =
    !isIdle &&
    (prevCodeValue !== codeFieldValue || prevSystemValue !== systemFieldValue || prevOtherValue !== otherFieldValue);
  useEffect(() => {
    if (shouldReset) reset();
  }, [shouldReset, reset]);

  if (!vsacApiKey) return null;

  return (
    <div className={styles.fieldGroup}>
      <TextField name={codeFieldName} label="Code" />
      <AutocompleteField name={systemFieldName} label="System" options={codeSystemOptions} />
      {systemFieldValue === 'Other' && <TextField name={otherFieldName} label="Other" />}

      {isError && (
        <Alert className={fieldStyles.field} severity="warning">
          Unable to validate code and/or code system.
        </Alert>
      )}

      {isSuccess && codeData ? (
        <div className={fieldStyles.field}>
          <label className={fieldStyles.fieldLabel} htmlFor="code-display">
            Display:
          </label>

          <div className={styles.fieldDisplay}>
            {codeData.display}
            <Alert severity="success">Validated</Alert>
          </div>
        </div>
      ) : (
        <div className={styles.fieldGroupButton}>
          <Button
            color="primary"
            disabled={isLoading || !codeFieldValue || !systemFieldValue}
            onClick={handleValidateCode}
            startIcon={isLoading && <CircularProgress size={20} />}
            variant="contained"
          >
            Validate
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(CodeSelectField);
