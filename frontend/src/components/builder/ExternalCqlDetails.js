import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Button } from 'reactstrap';

import Modal from '../elements/Modal';
import renderDate from '../../utils/dates';

import ExternalCqlDetailsSection from './ExternalCqlDetailsSection';

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

  renderHeader = (title, data) => {
    const chevronIcon = this.state.collapse ? 'chevron-down' : 'chevron-right';

    return (
      <div
        className="external-cql-details__header"
        onClick={event => this.toggle(event)}
        onKeyPress={event => this.toggle(event)}
        role="button"
        tabIndex={0}>
        <div className="header-title">{title} ({data.length})</div>
        <div className="header-divider"></div>
        <Button onClick={this.toggle} className="header-button"><FontAwesome name={chevronIcon} /></Button>
      </div>
    );
  }

  render() {
    const { openModal, closeModal, externalCqlLibraryDetails, isLoadingExternalCqlDetails } = this.props;

    if (isLoadingExternalCqlDetails || externalCqlLibraryDetails === null) return <div>Loading...</div>;
    const parameters = externalCqlLibraryDetails.details.parameters;
    const functions = externalCqlLibraryDetails.details.functions;
    const definitions = externalCqlLibraryDetails.details.definitions;

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

          <div className="library-details">
            <ExternalCqlDetailsSection title="Parameters" definitions={parameters} />
            <ExternalCqlDetailsSection title="Functions" definitions={functions} />
            <ExternalCqlDetailsSection title="Define" definitions={definitions} />
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
