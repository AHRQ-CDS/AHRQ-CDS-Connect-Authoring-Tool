import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { loadArtifacts, addArtifact, deleteArtifact } from '../actions/artifacts';
import artifactProps from '../prop-types/artifact';

import ArtifactModal from '../components/artifact/ArtifactModal';
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
          deleteArtifact={this.props.deleteArtifact} />
      );
    }

    return <div>No artifacts to show.</div>;
  }

  render() {
    return (
      <div className="artifact" id="maincontent">
        <div className="artifact-wrapper">
          <Button
            color="primary"
            onClick={() => this.openNewArtifactModal()}
            startIcon={<AddIcon />}
            variant="contained"
          >
            Create New Artifact
          </Button>

          {this.renderArtifactsTable()}
        </div>

        <ArtifactModal
          showModal={this.state.showNewArtifactModal}
          closeModal={this.closeNewArtifactModal}
        />
      </div>
    );
  }
}

Artifact.propTypes = {
  artifacts: PropTypes.arrayOf(artifactProps),
  loadArtifacts: PropTypes.func.isRequired,
  addArtifact: PropTypes.func.isRequired,
  deleteArtifact: PropTypes.func.isRequired
};

// these props are used for dispatching actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadArtifacts,
    addArtifact,
    deleteArtifact
  }, dispatch);
}

// these props come from the application's state when it is started
function mapStateToProps(state) {
  return {
    artifacts: state.artifacts.artifacts
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Artifact);
