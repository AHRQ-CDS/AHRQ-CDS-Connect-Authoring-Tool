import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@material-ui/core';
import { Close as CloseIcon, Visibility as VisibilityIcon } from '@material-ui/icons';

import { ValueSetSelectModal } from 'components/modals';
import useStyles from './styles';

const ValueSetListTemplate = ({ handleDeleteValueSet, valueSets }) => {
  const [showValueSetViewModal, setShowValueSetViewModal] = useState(false);
  const vsacApiKey = useSelector(state => state.vsac.apiKey);
  const styles = useStyles();

  return (
    <>
      {valueSets.map((valueSet, index) => (
        <div key={`value-set-${index}`} id="value-set-list-template">
          <div className={styles.templateField}>
            <div className={styles.templateFieldLabel} id="value-set-label">
              Value Set{valueSets.length > 1 ? ` ${index + 1}` : ''}:
            </div>

            <div className={styles.templateFieldDetails}>
              <div className={styles.templateFieldDisplay}>{` ${valueSet.name} (${valueSet.oid})`}</div>

              <div className={styles.templateFieldButtons}>
                {!Boolean(vsacApiKey) && (
                  <Tooltip arrow title="Authenticate VSAC to view details" placement="left">
                    <span className={styles.modifierButton}>
                      <IconButton aria-label="View Value Set" disabled color="primary">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}

                {Boolean(vsacApiKey) && (
                  <IconButton
                    aria-label="View Value Set"
                    color="primary"
                    onClick={() => setShowValueSetViewModal(true)}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                )}

                <IconButton
                  aria-label={`delete value set ${valueSet.name}`}
                  color="primary"
                  onClick={() => handleDeleteValueSet(valueSet)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          </div>

          {showValueSetViewModal && (
            <ValueSetSelectModal
              handleCloseModal={() => setShowValueSetViewModal(false)}
              readOnly
              savedValueSet={valueSet}
            />
          )}
        </div>
      ))}
    </>
  );
};

ValueSetListTemplate.propTypes = {
  handleDeleteValueSet: PropTypes.func.isRequired,
  valueSets: PropTypes.array.isRequired
};

export default ValueSetListTemplate;
