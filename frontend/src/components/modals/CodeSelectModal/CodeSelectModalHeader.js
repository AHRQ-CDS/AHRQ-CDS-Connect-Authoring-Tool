import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { Dropdown, Link } from 'components/elements';
import codeSystemOptions from 'data/codeSystemOptions';
import useStyles from '../styles';

const CodeSelectModalHeader = ({
  code,
  codeSystem,
  isValidating,
  onValidate,
  otherCodeSystem,
  setCode,
  setCodeSystem,
  setOtherCodeSystem
}) => {
  const styles = useStyles();

  const handleValidate = useCallback(
    event => {
      event.preventDefault();
      onValidate();
    },
    [onValidate]
  );

  return (
    <>
      {codeSystem === 'Other' && (
        <Alert severity="info">
          Code systems should use their canonical URL. See{' '}
          <Link
            external
            href="http://hl7.org/fhir/uv/cpg/STU1/libraries.html#code-systems"
            text="FHIR® Clinical Guidelines"
          />{' '}
          for more information.
        </Alert>
      )}

      <div className={styles.searchContainer}>
        <form onSubmit={handleValidate} className={styles.form}>
          <TextField
            className={styles.formInput}
            fullWidth
            id="select-code-code"
            label="Code"
            onChange={event => setCode(event.target.value)}
            value={code}
            variant="outlined"
          />

          <Dropdown
            className={styles.formInput}
            id="select-code-system"
            label="Code system"
            onChange={event => setCodeSystem(event.target.value)}
            options={codeSystemOptions}
            value={codeSystem || ''}
          />

          {codeSystem === 'Other' && (
            <TextField
              className={styles.formInput}
              fullWidth
              id="select-code-system-url"
              label="System URI"
              onChange={event => setOtherCodeSystem(event.target.value)}
              value={otherCodeSystem}
              variant="outlined"
            />
          )}

          <Button color="primary" disabled={isValidating} type="submit" variant="contained">
            Validate
          </Button>
        </form>
      </div>
    </>
  );
};

CodeSelectModalHeader.propTypes = {
  isValidating: PropTypes.bool.isRequired,
  onValidate: PropTypes.func.isRequired
};

export default CodeSelectModalHeader;
