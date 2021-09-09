import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, IconButton } from '@material-ui/core';
import { Edit as EditIcon, LocalHospital as LocalHospitalIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { ValueSetSelectModal, VSACAuthenticationModal } from 'components/modals';
import { useSpacingStyles, useTextStyles } from 'styles/hooks';
import useStyles from './styles';

const ValueSetEditor = ({ handleUpdateEditor, value }) => {
  const [showValueSetSelectModal, setShowValueSetSelectModal] = useState(false);
  const [showVSACAuthModal, setShowVSACAuthModal] = useState(false);
  const vsacApiKey = useSelector(state => state.vsac.apiKey);
  const spacingStyles = useSpacingStyles();
  const textStyles = useTextStyles();
  const styles = useStyles();

  return (
    <div className={clsx(spacingStyles.marginTopHalf, spacingStyles.fullWidth)}>
      {value ? (
        <div className={styles.editorDisplayGroup}>
          <div className={styles.editorDisplay}>
            {value.name}
            <span className={clsx(spacingStyles.marginLeft, spacingStyles.marginRight, textStyles.subtext)}>
              (OID: {value.oid})
            </span>
          </div>

          <IconButton aria-label="edit value set" color="primary" onClick={() => setShowValueSetSelectModal(true)}>
            <EditIcon />
          </IconButton>
        </div>
      ) : (
        <Button
          color="primary"
          onClick={Boolean(vsacApiKey) ? () => setShowValueSetSelectModal(true) : () => setShowVSACAuthModal(true)}
          startIcon={Boolean(vsacApiKey) && <LocalHospitalIcon />}
          variant="contained"
        >
          {Boolean(vsacApiKey) ? 'Add Valueset' : 'Authenticate VSAC'}
        </Button>
      )}

      {showVSACAuthModal && <VSACAuthenticationModal handleCloseModal={() => setShowVSACAuthModal(false)} />}

      {showValueSetSelectModal && (
        <ValueSetSelectModal
          handleCloseModal={() => setShowValueSetSelectModal(false)}
          handleSelectValueSet={handleUpdateEditor}
        />
      )}
    </div>
  );
};

ValueSetEditor.propTypes = {
  handleUpdateEditor: PropTypes.func.isRequired,
  value: PropTypes.object
};

export default ValueSetEditor;
