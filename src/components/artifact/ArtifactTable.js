import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import axios from 'axios';

function renderDate(datetime) {
  if (datetime) {
    return moment(datetime).fromNow();
  }
}

function sortArtifacts(a, b) {
  // most recently updated at top
  if (a.updatedAt > b.updatedAt || (a.updatedAt && !b.updatedAt)) {
    return -1;
  } else if (a.updatedAt < b.updatedAt || (!a.updatedAt && b.updatedAt)) {
    return 1;
  } else {
    return 0;
  }
}

class ArtifactTable extends Component {
  constructor(props) {
    super(props);
    this.state = { artifacts: props.artifacts };
    this.deleteArtifact = this.deleteArtifact.bind(this);
    this.renderTableRow = this.renderTableRow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.artifacts) { return; }
    if (this.state.artifacts !== nextProps.artifacts) {
      this.setState({ artifacts: nextProps.artifacts });
    }
  }

  deleteArtifact(id) {
    axios.delete(`http://localhost:3001/api/artifacts/${id}`)
      .then((res) => {
        let list = this.state.artifacts;
        const index = list.findIndex((a) => { return a._id === id; })

        const artifacts = [
          ...list.slice(0, index),
          ...list.slice(index + 1),
        ];

        this.setState({ artifacts });
        console.log('Artifact deleted');
      })
      .catch((err) => {
        console.error(err);
      });
  }

  renderTableRow(artifact) {
    return (
      <tr key={artifact._id}>
        <td className="artifacts__tablecell-wide"
          data-th="Artifact Name">
          <Link to={`${this.props.match.path}/${artifact._id}/build`}>
            {artifact.name}
          </Link>
        </td>
        <td className="artifacts__tablecell-short"
          data-th="Version">
          {artifact.version}
        </td>
        <td data-th="Updated">{renderDate(artifact.updatedAt)}</td>
        <td data-th="">
          <button className="danger-button"
            onClick={() => this.deleteArtifact(artifact._id)}>
            Delete
          </button>
        </td>
      </tr>
    );
  }

  render() {
    return (
      <table className="artifacts__table">
        <thead>
          <tr>
            <th scope="col" className="artifacts__tablecell-wide">Artifact Name</th>
            <th scope="col" className="artifacts__tablecell-short">Version</th>
            <th scope="col">Updated</th>
            <td></td>
          </tr>
        </thead>
        <tbody>
        {this.state.artifacts.sort(sortArtifacts).map(this.renderTableRow)}
        </tbody>
      </table>
    );
  }
}

export default ArtifactTable;
