import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Autocomplete } from '@material-ui/lab';
import { Button, Chip, Tooltip } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import clsx from 'clsx';
import { useFieldStyles } from 'styles/hooks';
import useStyles from '../../styles';
import { CodeSelectModal, VSACAuthenticationModal } from 'components/modals';
import { useSelector } from 'react-redux';
import { Lock as LockIcon } from '@material-ui/icons';

const ConceptEditor = ({ onChange, value }) => {
  const [showVSACAuthModal, setShowVSACAuthModal] = useState(false);
  const vsacApiKey = useSelector(state => state.vsac.apiKey);

  const [showConceptModal, setShowConceptModal] = useState(false);
  const fieldStyles = useFieldStyles();
  const modalStyles = useStyles();

  return (
    <>
      {Boolean(vsacApiKey) && (
        <>
          <div className={modalStyles.verticalAlign}>
            <Autocomplete
              className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputSm, modalStyles.noMarginBottom)}
              disableClearable
              disabled
              freeSolo
              multiple
              options={[]}
              onChange={(event, values) => onChange(values)}
              renderInput={params => <TextField {...params} label="Concept(s)" variant="outlined" />}
              renderTags={tags => {
                return tags.map((tag, index) => (
                  <>
                    <Tooltip arrow title={tag.display || tag.code || ''}>
                      <Chip
                        className={modalStyles.conceptChip}
                        label={tag.display || tag.code}
                        onClick={() => {
                          setShowConceptModal(true);
                        }}
                        onDelete={() => onChange(undefined)}
                      ></Chip>
                    </Tooltip>
                  </>
                ));
              }}
              value={value ? [value] : []}
            />
            <Tooltip
              arrow
              title={
                value !== undefined ? 'Only one concept is allowed for this resource. Another cannot be added.' : ''
              }
            >
              <Button
                className={modalStyles.compactTextButton}
                onClick={() => {
                  if (value === undefined) {
                    setShowConceptModal(true);
                  }
                }}
              >
                Add Concept
              </Button>
            </Tooltip>
          </div>

          {showConceptModal && (
            <CodeSelectModal
              handleCloseModal={() => setShowConceptModal(false)}
              handleSelectCode={concept => onChange(concept)}
              isConcept={true}
              initialValue={value}
            ></CodeSelectModal>
          )}
        </>
      )}

      {!Boolean(vsacApiKey) && (
        <>
          <Button
            color="primary"
            onClick={() => setShowVSACAuthModal(true)}
            variant="contained"
            startIcon={<LockIcon />}
          >
            Authenticate VSAC
          </Button>
          {showVSACAuthModal && <VSACAuthenticationModal handleCloseModal={() => setShowVSACAuthModal(false)} />}
        </>
      )}
    </>
  );
};

ConceptEditor.propTypes = {
  onChange: propTypes.func.isRequired,
  value: propTypes.object.isRequired
};
export default ConceptEditor;
