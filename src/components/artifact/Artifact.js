import React, { Component } from 'react';
import axios from 'axios';
import ArtifactForm from './ArtifactForm';
import ArtifactTable from './ArtifactTable';
import Config from '../../../config';
const API_BASE = Config.api.baseUrl;

class Artifact extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.loadArtifacts = this.loadArtifacts.bind(this);
    this.loadArtifacts();
  }

  loadArtifacts() {
    axios.get(`${API_BASE}/artifacts`).then((response) => {
      this.setState({ data: response.data });
    });
  }

  render() {
    return (
      <div>
        <ArtifactForm afterAddArtifact={this.loadArtifacts} buttonLabel={'Add new artifact'}/>
        { (this.state.data.length > 0)
          ? <ArtifactTable artifacts={this.state.data}
              match={this.props.match}
              afterAddArtifact={this.loadArtifacts}/>
          : <p>No artifacts to show.</p>}
      </div>
    );
  }
}

export default Artifact;
