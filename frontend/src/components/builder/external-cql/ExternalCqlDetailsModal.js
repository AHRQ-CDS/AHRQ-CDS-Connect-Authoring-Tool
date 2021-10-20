import React from 'react';
import PropTypes from 'prop-types';
import { InsertDriveFile as InsertDriveFileIcon } from '@mui/icons-material';

import ExternalCqlDetailsModalSection from './ExternalCqlDetailsModalSection';
import { KeyValueList, Modal } from 'components/elements';
import { renderDate } from 'utils/dates';
import useStyles from './styles';

const ExternalCqlDetailsModal = ({ handleCloseModal, library }) => {
  const styles = useStyles();
  const parameters = library.details.parameters;
  const functions = library.details.functions;
  const definitions = library.details.definitions;

  const getFhirVersion = version => {
    if (version === '1.0.2') return '1.0.2 (DSTU2)';
    if (version.startsWith('3.0.')) return `${version} (STU3)`;
    if (version.startsWith('4.0.')) return `${version} (R4)`;
    return version;
  };

  const metaData = [
    { key: 'Uploaded', value: renderDate(library.createdAt) },
    { key: 'Version', value: library.version },
    {
      key: (
        <>
          FHIR<sup>®</sup> Version
        </>
      ),
      value: getFhirVersion(library.fhirVersion)
    }
  ];

  return (
    <Modal
      closeButtonText="Close"
      handleCloseModal={handleCloseModal}
      handleSaveModal={handleCloseModal}
      hasCancelButton
      hideSubmitButton
      isOpen
      maxWidth="xl"
      title="View External CQL Details"
    >
      <>
        <div className={styles.libraryCard}>
          <InsertDriveFileIcon fontSize="large" /> {library.name}
        </div>

        <div className={styles.libraryMetaData}>
          <KeyValueList list={metaData} />
        </div>

        <div>
          {parameters?.length > 0 && <ExternalCqlDetailsModalSection title="Parameters" definitions={parameters} />}
          {functions?.length > 0 && <ExternalCqlDetailsModalSection title="Functions" definitions={functions} />}
          {definitions?.length > 0 && <ExternalCqlDetailsModalSection title="Define" definitions={definitions} />}
        </div>
      </>
    </Modal>
  );
};

ExternalCqlDetailsModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  library: PropTypes.object.isRequired
};

export default ExternalCqlDetailsModal;
