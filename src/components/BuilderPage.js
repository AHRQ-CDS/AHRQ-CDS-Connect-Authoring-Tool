import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import axios from 'axios';
import update from 'immutability-helper';
import BuilderSubPalette from './BuilderSubPalette';
import BuilderPalette from './BuilderPalette';
import BuilderTarget from './BuilderTarget';
import groups from '../data/groupings';

class BuilderPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedGroup: null,
      droppedElements: [],
      artifact: null
    };

    this.setDroppedElements = this.setDroppedElements.bind(this);
    this.saveArtifact = this.saveArtifact.bind(this);
    this.downloadCQL = this.downloadCQL.bind(this);
    this.updateSingleElement = this.updateSingleElement.bind(this);
  }

  componentDidMount() {
    if (this.props.match) {
      this.setSelectedGroup(this.props.match.params.group);
      if (this.props.match.params.id) {
        // fetch the relevant artifact from the server.
        const id = this.props.match.params.id;
        axios.get(`http://localhost:3001/api/artifacts/${id}`)
          .then((res) => {
            this.setState({ artifact: res.data[0] });
          });
      } else {
        this.setState({ artifact: null });
      }
    }
  }

  downloadCQL() {
    const artifact = {
      name: 'foo foo',
      template_instances: this.state.droppedElements
    };

    axios.post('http://localhost:3001/api/cql', artifact)
      .then((result) => {
        const cqlData = result.data; 
        const saveElement = document.createElement('a');
        saveElement.href = `data:${cqlData.type},${encodeURIComponent(cqlData.text)}`;
        saveElement.download = `${cqlData.filename}.cql`;
        saveElement.click();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  saveArtifact() {
    const artifact = {
      name: 'foo',
      template_instances: this.state.droppedElements
    };
    // TODO: This needs to be extracted to somewhere better
    const url = 'http://localhost:3001/api';

    axios.post(`${url}/artifacts`, artifact)
      .then((result) => {
        // TODO:
        // capture artifact and ID
        // notification on save
        console.log('Added Artifact')
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.match) { return; }
    if (this.props.match.params.group !== nextProps.match.params.group) {
      this.setSelectedGroup(nextProps.match.params.group);
    }
  }

  setSelectedGroup(groupId) {
    const group = groups.find(g => parseInt(g.id, 10) === parseInt(groupId, 10));
    if (group) {
      this.setState({ selectedGroup: group });
    } else {
      this.setState({ selectedGroup: null });
    }
  }

  setDroppedElements(elements) {
    this.setState({ droppedElements: elements });
  }

  updateSingleElement(instanceId, state) {
    const elements = this.state.droppedElements;
    const elementIndex = elements.findIndex((element) => {
      // get relevant element
      return element.uniqueId === instanceId;
    });

    if (elementIndex !== undefined) {
      // get relevant parameter
      const paramIndex = elements[elementIndex].parameters.findIndex((param) => {
        return state.hasOwnProperty(param.id) === true;
      });

      // edit element with new value using immutability-helper
      const editedElements = update(elements, {
        [elementIndex]: {
          parameters: {
            [paramIndex]: {
              value: { $set: state[elements[elementIndex].parameters[paramIndex].id] }
            }
          }
        }
      });

      // merge back into droppedElements
      this.setState({ droppedElements: editedElements });
    }
  }

  renderSidebar() {
    if (this.state.selectedGroup) {
      return <BuilderSubPalette
        selectedGroup={this.state.selectedGroup}
        updateDroppedElements={this.setDroppedElements}
        droppedElements={this.state.droppedElements} />;
    }
    return null;
  }

  render() {
    return (
      <div className="builder">
        <header className="builder__header">
          <h2 className="builder__heading">{this.state.artifact ? this.state.artifact.name : 'Untitled Artifact'}</h2>
          <div className="builder__buttonbar">
            <button onClick={this.saveArtifact} className="builder__savebutton is-unsaved">Save</button>
            <button onClick={this.downloadCQL} className="builder__cqlbutton is-unsaved">CQL</button>
            <button className="builder__deletebutton">Delete</button>
          </div>
        </header>
        <div className="builder__sidebar">
          <BuilderPalette selectedGroup={this.state.selectedGroup} />
          {this.renderSidebar()}
        </div>
        <BuilderTarget
          updateDroppedElements={this.setDroppedElements}
          updateSingleElement={this.updateSingleElement}
          droppedElements={this.state.droppedElements} />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(BuilderPage);
