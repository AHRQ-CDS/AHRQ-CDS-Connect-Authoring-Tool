import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesome from 'react-fontawesome';

import { loadArtifacts, addArtifact, deleteArtifact, updateAndSaveArtifact } from '../actions/artifacts';
import artifactProps from '../prop-types/artifact';

import NewArtifactModal from '../components/artifact/NewArtifactModal';
import ArtifactTable from '../components/artifact/ArtifactTable';

class Artifact extends Component {
  constructor(props) {
    super(props);

    this.state = { showNewArtifactModal: false };
  }

  UNSAFE_componentWillMount() { // eslint-disable-line camelcase
    this.props.loadArtifacts();
  }

  openNewArtifactModal = () => {
    this.setState({ showNewArtifactModal: true });
  }

  closeNewArtifactModal = () => {
    this.setState({ showNewArtifactModal: false });
  }

  renderArtifactsTable() {
    const { artifacts } = this.props;

    if (artifacts && artifacts.length > 0) {
      return (
        <ArtifactTable
          artifacts={artifacts}
          deleteArtifact={this.props.deleteArtifact}
          updateAndSaveArtifact={this.props.updateAndSaveArtifact} />
      );
    }

    return <div>No artifacts to show.</div>;
  }

  render() {
    return (
      <div className="artifact" id="maincontent">
        <div className="artifact-wrapper">
          <button className="primary-button"
            onClick={() => this.openNewArtifactModal()}
            aria-label="Create New Artifact">
            <FontAwesome name="plus" /> Create New Artifact
          </button>

          {this.renderArtifactsTable()}
        </div>

        <NewArtifactModal
          addArtifact={this.props.addArtifact}
          showModal={this.state.showNewArtifactModal}
          closeModal={this.closeNewArtifactModal} />
      </div>
    );
  }
}

Artifact.propTypes = {
  artifacts: PropTypes.arrayOf(artifactProps),
  loadArtifacts: PropTypes.func.isRequired,
  addArtifact: PropTypes.func.isRequired,
  deleteArtifact: PropTypes.func.isRequired,
  updateAndSaveArtifact: PropTypes.func.isRequired
};

// these props are used for dispatching actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadArtifacts,
    addArtifact,
    deleteArtifact,
    updateAndSaveArtifact
  }, dispatch);
}

// these props come from the application's state when it is started
function mapStateToProps(state) {
  return {
    artifacts: state.artifacts.artifacts
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Artifact);
