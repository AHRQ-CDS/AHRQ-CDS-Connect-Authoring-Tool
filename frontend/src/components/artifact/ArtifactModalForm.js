import React, { memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, useFormikContext } from 'formik';
import { Button } from '@mui/material';
import clsx from 'clsx';

import { TextField } from 'components/fields';
import cpgFields, { versionHelperText, cpgScoreHelperText } from './cpgFields';
import { getCpgCompleteCount } from 'utils/fields';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const ArtifactModalForm = memo(({ setSubmitDisabled }) => {
  const [openForm, setOpenForm] = useState(false);
  const { values, isValid } = useFormikContext();
  const { cpgTotalCount, cpgCompleteCount } = getCpgCompleteCount(values);
  const cpgPercentage = Math.floor((cpgCompleteCount / cpgTotalCount) * 100);
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  const toggleForm = useCallback(() => {
    setOpenForm(isOpen => !isOpen);
  }, []);

  useEffect(() => setSubmitDisabled(!isValid), [isValid, setSubmitDisabled]);

  return (
    <Form className={styles.artifactForm}>
      <TextField name="name" label="Artifact Name" required={true} />
      <TextField name="version" label="Version" helperText={versionHelperText} />

      <div className={fieldStyles.field}>
        <label className={fieldStyles.fieldLabel} htmlFor="cpg-score">
          CPG Score:
        </label>

        <div id="cpg-score" className={fieldStyles.fieldInput}>
          <div className={styles.cpgPercentage}>
            <div className={styles.cpgPercentageComplete} style={{ width: `${cpgPercentage}%` }}>
              <div className={clsx(styles.cpgPercentageLabel, cpgPercentage === 0 && styles.cpgPercentageLabelZero)}>
                {cpgPercentage}%
              </div>
            </div>
          </div>

          <div className={fieldStyles.helperText}>{cpgScoreHelperText}</div>
        </div>
      </div>

      <div className={styles.cpgButton}>
        <Button color="primary" onClick={toggleForm} variant="contained">
          {openForm ? 'Hide CPG Fields' : 'Show CPG Fields'}
        </Button>
      </div>

      {openForm &&
        cpgFields.map(field => {
          const FormComponent = field.component;
          return <FormComponent key={field.name} isCpgField {...field} />;
        })}
    </Form>
  );
});

ArtifactModalForm.propTypes = {
  setSubmitDisabled: PropTypes.func.isRequired
};

export default ArtifactModalForm;
