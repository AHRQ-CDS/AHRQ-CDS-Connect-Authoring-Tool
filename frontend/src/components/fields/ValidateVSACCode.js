import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates as batch } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useField } from 'formik';

import { TextField, SelectField } from '.';
import { validateCode, resetCodeValidation } from 'actions/vsac';

const codeSystemOptions = [
  { value: 'SNOMED', label: 'SNOMED', id: 'http://snomed.info/sct' },
  { value: 'ICD-9-CM', label: 'ICD-9-CM', id: 'http://hl7.org/fhir/sid/icd-9-cm' },
  { value: 'ICD-10-CM', label: 'ICD-10-CM', id: 'http://hl7.org/fhir/sid/icd-10-cm' },
  { value: 'NCI', label: 'NCI', id: 'http://ncimeta.nci.nih.gov' },
  { value: 'LOINC', label: 'LOINC', id: 'http://loinc.org' },
  { value: 'RXNORM', label: 'RXNORM', id: 'http://www.nlm.nih.gov/research/umls/rxnorm' },
  { value: 'Other', label: 'Other', id: null }
];

const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

const FastValidateVSACCode = memo(({
  codeFieldName,
  systemFieldName,
  handleValidateCode,
  isValid,
  validatedCode,
  isValidating,
  isMissingInput
}) => {
  return (
    <div className="field-group validate-vsac-code">
      <TextField name={codeFieldName} label="Code" />
      <SelectField name={systemFieldName} label="System" options={codeSystemOptions}/>

      {isValid === false &&
        <Alert className="field" severity="warning">Unable to validate code and/or code system.</Alert>
      }

      {!validatedCode &&
        <div className="field-group-button">
          <Button
            color="primary"
            disabled={isValidating || isMissingInput}
            onClick={handleValidateCode}
            startIcon={isValidating && <CircularProgress size={20} />}
            variant="contained"
          >
            Validate
          </Button>
        </div>
      }

      {isValid && validatedCode &&
        <div className="field">
          <label className="field-label" htmlFor="code-display">Display:</label>
          <div id="code-display">
            {validatedCode.display}
            <Alert severity="success">Validated</Alert>
          </div>
        </div>
      }
    </div>
  );
});

export default memo(function ValidateVSACCode({ namePrefix }) {
  const codeFieldName = namePrefix ? `${namePrefix}.code` : 'code';
  const systemFieldName = namePrefix ? `${namePrefix}.system` : 'system';

  const [validatedCode, setValidatedCode] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [{ value: codeFieldValue }] = useField(codeFieldName);
  const [{ value: systemFieldValue }] = useField(systemFieldName);
  const prevCodeValue = usePrevious(codeFieldValue);
  const prevSystemValue = usePrevious(systemFieldValue);
  const dispatch = useDispatch();
  const authStatus = useSelector(state => state.vsac.authStatus);
  const apiKey = useSelector(state => state.vsac.apiKey);
  const fieldValuesRef = useRef({
    apiKey: apiKey,
    code: codeFieldValue,
    system: systemFieldValue,
  });

  const handleValidateCode = useCallback(
    async () => {
      const { code, system, apiKey } = fieldValuesRef.current;

      if (!system || !code || !apiKey) return;
      const systemId = codeSystemOptions.find(({ value }) => value === system).id;
      setIsValidating(true);

      const { codeData } = await dispatch(validateCode(code, systemId, apiKey));

      batch(() => {
        setValidatedCode(codeData);
        setIsValid(codeData != null);
        setIsValidating(false);
      });
    },
    [fieldValuesRef, dispatch]
  );

  useEffect(
    () => {
      fieldValuesRef.current = {
        code: codeFieldValue,
        system: systemFieldValue,
        apiKey
      };
    },
    [codeFieldValue, systemFieldValue, apiKey]
  );

  useEffect(() => {
    if (isValid == null || (prevCodeValue === codeFieldValue && prevSystemValue === systemFieldValue)) return;

    batch(() => {
      setValidatedCode(null);
      setIsValid(null);
      setIsValidating(false);
      dispatch(resetCodeValidation());
    });
  }, [codeFieldValue, prevCodeValue, systemFieldValue, prevSystemValue, isValid, dispatch]);

  if (authStatus !== 'loginSuccess') return null;

  return (
    <FastValidateVSACCode
      codeFieldName={codeFieldName}
      systemFieldName={systemFieldName}
      handleValidateCode={handleValidateCode}
      isValid={isValid}
      validatedCode={validatedCode}
      isValidating={isValidating}
      isMissingInput={codeFieldValue === '' || systemFieldValue == null}
    />
  );
});
