import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates as batch } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faSpinner, faCheck, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useField } from 'formik';

import TextField from './TextField';
import SelectField from './SelectField';
import { validateCode, resetCodeValidation } from '../../actions/vsac';

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
    <div className="validate-vsac-code">
      <div className="validate-vsac-code__form">
        <TextField name={codeFieldName} label="Code" />

        <SelectField
          name={systemFieldName}
          label="System"
          options={codeSystemOptions}
        />

        {isValid === false &&
          <div className="form__group flex-col-1">
            <label className="label" htmlFor="code-invalid">{''}</label>
            <div id="code-invalid">
              <FontAwesomeIcon icon={faExclamationTriangle} /> Unable to validate code and/or code system.
            </div>
          </div>
        }

        {!validatedCode &&
          <button
            type="button"
            className="primary-button pull-right"
            onClick={handleValidateCode}
            aria-label="Authenticate VSAC"
            disabled={isValidating || isMissingInput}
          >
            {(!isValid && !isValidating) && <>Validate</>}
            {isValidating && <><FontAwesomeIcon icon={faSpinner} spin /> Validate</>}
            {(isValid && validatedCode) && <><FontAwesomeIcon icon={faCheck} /> Validated</>}
          </button>
        }

        {isValid && validatedCode &&
          <div className="form__group flex-col-1">
            <label className="label" htmlFor="code-display">Display:</label>
            <div id="code-display">
              {validatedCode.display}
              <span className="validated-text"><FontAwesomeIcon icon={faCheckCircle} /> Validated</span>
            </div>
          </div>
        }
      </div>
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
  const username = useSelector(state => state.vsac.username);
  const password = useSelector(state => state.vsac.password);
  const fieldValuesRef = useRef({
    username: username,
    password: password,
    code: codeFieldValue,
    system: systemFieldValue,
  });

  const handleValidateCode = useCallback(
    async () => {
      const { code, system, username, password } = fieldValuesRef.current;

      if (!system || !code || !username || !password) return;
      const systemId = codeSystemOptions.find(({ value }) => value === system).id;
      setIsValidating(true);

      const { codeData } = await dispatch(validateCode(code, systemId, username, password));

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
        username,
        password
      };
    },
    [codeFieldValue, systemFieldValue, username, password]
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
