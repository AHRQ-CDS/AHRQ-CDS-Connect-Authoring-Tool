import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import {
  Edit as EditIcon,
  GetApp as GetAppIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

import artifactProps from 'prop-types/artifact';
import useStyles from './styles';
import { ArtifactModal } from 'components/artifact';
import { CQLModal, ELMErrorModal } from 'components/modals';

const WorkspaceHeader = ({ handleDownloadArtifact, handleSaveArtifact, statusMessage }) => {
  const styles = useStyles();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [showArtifactModal, setShowArtifactModal] = useState(false);
  const [showElmErrorModal, setShowElmErrorModal] = useState(false);
  const [elmErrors, setElmErrors] = useState([]);
  const [showCQLModal, setShowCQLModal] = useState(false);
  const [dataModel, setDataModel] = useState(null);
  const artifact = useSelector(state => state.artifacts.artifact);

  const handleMenuClick = event => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleCloseElmErrorModal = () => {
    setShowElmErrorModal(false);
    setElmErrors([]);
  };

  const handleDownload = async version => {
    setMenuAnchorEl(null);
    const { elmErrors } = await handleDownloadArtifact(artifact, { name: 'FHIR', version });
    if (elmErrors) {
      setElmErrors(elmErrors);
      if (elmErrors.length > 0) {
        setShowElmErrorModal(true);
      }
    }
  };

  const handleViewCQL = version => {
    setMenuAnchorEl(null);
    setShowCQLModal(true);
    setDataModel({ name: 'FHIR', version });
  };

  const handleDataModelMenuSelected = async version => {
    switch (menuAnchorEl.id) {
      case 'view-cql':
        handleViewCQL(version);
        break;
      case 'download-cql':
        await handleDownload(version);
        break;
      default:
        // This shouldn't happen, but just in case, just close the menu.
        setMenuAnchorEl(null);
        break;
    }
  };

  let disableDSTU2 = false;
  let disableSTU3 = false;
  let disableR400 = false;
  let disableR401 = false;

  const artifactFHIRVersion = artifact?.fhirVersion ?? '';
  if (artifactFHIRVersion === '1.0.2') {
    disableSTU3 = true;
    disableR400 = true;
    disableR401 = true;
  } else if (artifactFHIRVersion === '3.0.0') {
    disableDSTU2 = true;
    disableR400 = true;
    disableR401 = true;
  } else if (artifactFHIRVersion === '4.0.0') {
    disableDSTU2 = true;
    disableSTU3 = true;
    disableR401 = true;
  } else if (artifactFHIRVersion === '4.0.1') {
    disableDSTU2 = true;
    disableSTU3 = true;
    disableR400 = true;
  } else if (artifactFHIRVersion === '4.0.x') {
    disableDSTU2 = true;
    disableSTU3 = true;
  }

  return (
    <>
      <header className={styles.header} aria-label="Workspace Header">
        <h2 className={styles.heading}>
          <IconButton
            className={styles.headerButton}
            aria-label="edit"
            onClick={() => setShowArtifactModal(true)}
            size="large"
          >
            <EditIcon />
          </IconButton>
          {artifact ? artifact.name : null}
        </h2>

        <div>
          <div className={styles.buttonBar}>
            <Button
              className={styles.buttonBarButton}
              aria-controls="download-menu"
              aria-haspopup="true"
              color="inherit"
              id="view-cql"
              onClick={handleMenuClick}
              startIcon={<VisibilityIcon />}
              variant="contained"
            >
              View CQL
            </Button>

            <Button
              className={styles.buttonBarButton}
              aria-controls="download-menu"
              aria-haspopup="true"
              color="inherit"
              id="download-cql"
              onClick={handleMenuClick}
              startIcon={<GetAppIcon />}
              variant="contained"
            >
              Download CQL
            </Button>

            <Menu
              anchorEl={menuAnchorEl}
              id="download-menu"
              keepMounted
              onClose={handleMenuClose}
              open={Boolean(menuAnchorEl)}
            >
              <MenuItem disabled={disableDSTU2} onClick={() => handleDataModelMenuSelected('1.0.2')}>
                FHIR<sup>®</sup> DSTU2
              </MenuItem>
              <MenuItem disabled={disableSTU3} onClick={() => handleDataModelMenuSelected('3.0.0')}>
                FHIR<sup>®</sup> STU3
              </MenuItem>
              <MenuItem disabled={disableR400} onClick={() => handleDataModelMenuSelected('4.0.0')}>
                FHIR<sup>®</sup> R4 (4.0.0)
              </MenuItem>
              <MenuItem disabled={disableR401} onClick={() => handleDataModelMenuSelected('4.0.1')}>
                FHIR<sup>®</sup> R4 (4.0.1)
              </MenuItem>
            </Menu>

            <Button
              className={styles.buttonBarButton}
              color="inherit"
              onClick={() => handleSaveArtifact(artifact, {})}
              startIcon={<SaveIcon />}
              variant="contained"
            >
              Save
            </Button>
          </div>

          {statusMessage && <div className={styles.statusMessage}>{statusMessage}</div>}
        </div>
      </header>

      {showArtifactModal && (
        <ArtifactModal
          artifactEditing={artifact}
          handleCloseModal={() => setShowArtifactModal(false)}
          handleUpdateArtifact={handleSaveArtifact}
        />
      )}

      {showElmErrorModal && <ELMErrorModal handleCloseModal={handleCloseElmErrorModal} errors={elmErrors} />}

      {showCQLModal && (
        <CQLModal handleCloseModal={() => setShowCQLModal(false)} artifact={artifact} dataModel={dataModel} />
      )}
    </>
  );
};

WorkspaceHeader.propTypes = {
  artifact: artifactProps,
  handleDownloadArtifact: PropTypes.func.isRequired,
  handleSaveArtifact: PropTypes.func.isRequired,
  statusMessage: PropTypes.string
};

export default WorkspaceHeader;
