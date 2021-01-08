import React, { memo, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { useLatest, usePrevious } from 'react-use';
import { Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useField } from 'formik';

import codeSystemOptions from 'data/codeSystemOptions';
import validateCode from 'queries/validateCode';
import SelectField from './SelectField';
import TextField from './TextField';
import useStyles from './styles';

const CodeSelectField = ({ namePrefix }) => {
  const codeFieldName = namePrefix ? `${namePrefix}.code` : 'code';
  const systemFieldName = namePrefix ? `${namePrefix}.system` : 'system';
  const { mutateAsync, data: codeData, isLoading, isSuccess, isError, isIdle, reset } = useMutation(validateCode);
  const vsacApiKey = useSelector(state => state.vsac.apiKey);
  const [{ value: codeFieldValue }] = useField(codeFieldName);
  const [{ value: systemFieldValue }] = useField(systemFieldName);
  const prevCodeValue = usePrevious(codeFieldValue);
  const prevSystemValue = usePrevious(systemFieldValue);
  const fieldValuesRef = useLatest({
    code: codeFieldValue,
    system: systemFieldValue
  });
  const styles = useStyles();

  const handleValidateCode = useCallback(() => {
    const { code, system } = fieldValuesRef.current;

    if (!system || !code || !vsacApiKey) return;
    const systemId = codeSystemOptions.find(({ value }) => value === system).id;

    mutateAsync({ code, system: systemId, apiKey: vsacApiKey });
  }, [mutateAsync, fieldValuesRef, vsacApiKey]);

  const shouldReset = !isIdle && (prevCodeValue !== codeFieldValue || prevSystemValue !== systemFieldValue);
  useEffect(() => {
    if (shouldReset) reset();
  }, [shouldReset, reset]);

  if (!vsacApiKey) return null;

  return (
    <div className={styles.fieldGroup}>
      <TextField name={codeFieldName} label="Code" />
      <SelectField name={systemFieldName} label="System" options={codeSystemOptions} />

      {isError && (
        <Alert className={styles.field} severity="warning">
          Unable to validate code and/or code system.
        </Alert>
      )}

      {isSuccess && codeData ? (
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="code-display">
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
            disabled={isLoading || !codeFieldValue || systemFieldValue == null}
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
