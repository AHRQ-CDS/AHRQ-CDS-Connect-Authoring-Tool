import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@material-ui/core';
import { Close as CloseIcon, Visibility as VisibilityIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { ValueSetSelectModal } from 'components/modals';
import { useFieldStyles } from 'styles/hooks';

const ValueSetListTemplate = ({ handleDeleteValueSet, valueSets }) => {
  const [showValueSetViewModal, setShowValueSetViewModal] = useState(false);
  const [valueSetToView, setValueSetToView] = useState(null);
  const vsacApiKey = useSelector(state => state.vsac.apiKey);
  const fieldStyles = useFieldStyles();

  const handleViewValueSet = valueSet => {
    setValueSetToView(valueSet);
    setShowValueSetViewModal(true);
  };

  return (
    <>
      {valueSets.map((valueSet, index) => (
        <div key={`value-set-${index}`} id="value-set-list-template">
          <div className={fieldStyles.field}>
            <div className={clsx(fieldStyles.fieldLabel, fieldStyles.fieldLabelTall)} id="value-set-label">
              Value Set{valueSets.length > 1 ? ` ${index + 1}` : ''}:
            </div>

            <div className={fieldStyles.fieldDetails}>
              <div className={fieldStyles.fieldDisplay}>{` ${valueSet.name} (${valueSet.oid})`}</div>

              <div className={clsx(fieldStyles.fieldButtons, fieldStyles.fieldButtonsAlignCenter)}>
                {!Boolean(vsacApiKey) && (
                  <Tooltip arrow title="Authenticate VSAC to view details" placement="left">
                    <span>
                      <IconButton aria-label="View Value Set" disabled color="primary">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}

                {Boolean(vsacApiKey) && (
                  <IconButton aria-label="View Value Set" color="primary" onClick={() => handleViewValueSet(valueSet)}>
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
              savedValueSet={valueSetToView}
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
