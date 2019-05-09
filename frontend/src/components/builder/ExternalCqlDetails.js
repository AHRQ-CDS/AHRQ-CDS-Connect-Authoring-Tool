import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import Modal from '../elements/Modal';
import renderDate from '../../utils/dates';

export default class ExternalCqlDetails extends Component {
  componentDidMount() {
    const { externalCqlLibrary, loadExternalCqlLibraryDetails } = this.props;
    loadExternalCqlLibraryDetails(externalCqlLibrary._id);
  }

  getFhirVersion = (version) => {
    if (version === '1.0.2') return '1.0.2 (DSTU2)';
    if (version.startsWith('3.0.')) return `${version} (STU3)`;
    return version;
  }

  render() {
    const { openModal, closeModal, externalCqlLibraryDetails, isLoadingExternalCqlDetails } = this.props;

    if (isLoadingExternalCqlDetails || externalCqlLibraryDetails === null) return <div>Loading...</div>;

    return (
      <Modal
        modalTitle="View External CQL Details"
        modalId="view-details-modal"
        modalTheme="light"
        modalSubmitButtonText="Close"
        hasSecondaryButton={false}
        handleShowModal={openModal}
        handleCloseModal={closeModal}
        handleSaveModal={closeModal}>
        <div className="external-cql-table__modal modal__content external-cql-details">
          <div className="library-name">
            <FontAwesome name="file" className="library-name-icon" /> {externalCqlLibraryDetails.name}
          </div>

          <div className="library-meta">
            <div className="library-meta-item">
              <div className="item-label">Uploaded</div>
              <div className="item-value">{renderDate(externalCqlLibraryDetails.createdAt)}</div>
            </div>

            <div className="library-meta-item">
              <div className="item-label">Version</div>
              <div className="item-value">{externalCqlLibraryDetails.version}</div>
            </div>

            <div className="library-meta-item">
              <div className="item-label">FHIR Version</div>
              <div className="item-value">{this.getFhirVersion(externalCqlLibraryDetails.fhirVersion)}</div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

ExternalCqlDetails.propTypes = {
  openModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  externalCqlLibrary: PropTypes.object,
  externalCqlLibraryDetails: PropTypes.object,
  loadExternalCqlLibraryDetails: PropTypes.func.isRequired,
  isLoadingExternalCqlDetails: PropTypes.bool.isRequired
};
