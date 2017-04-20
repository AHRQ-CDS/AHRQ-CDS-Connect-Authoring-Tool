import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import axios from 'axios';

import BuilderSubPalette from './BuilderSubPalette';
import BuilderPalette from './BuilderPalette';
import BuilderTarget from './BuilderTarget';
import groups from '../data/groupings';

function exportFile(allElements) {
  let cqlText = '';

  // TODO: This will come from the inputs in the "Save" modal eventually.
  const libraryName = 'AgeRangeAuthoringDemo';
  const versionNumber = 1;
  const dataModel = "FHIR version '1.0.2'";
  const context = 'Patient';

  let initialCQL = `library ${libraryName} version '${versionNumber}' \n\n`;
  initialCQL += `using ${dataModel} \n\n`;
  initialCQL += `context ${context} \n\n`;
  cqlText += initialCQL;

  // TODO: Some of this will be removed and put into separate templates eventually.
  for (const element of allElements) {
    var paramContext = {}
    for (const parameter of element.parameters) {
      paramContext[parameter.id] = parameter.value
    }

    cqlText += function(cql){
      // eval the cql template with the context we created above
      // this allows the variable in the template to resolve
      return eval('`'+cql+'`');
    }.call(paramContext,element.cql) + "\n";
  }

  const saveElement = document.createElement('a');
  saveElement.href = `data:text/plain,${encodeURIComponent(cqlText)}`;
  saveElement.download = `${libraryName}.cql`;
  saveElement.click();
}


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
  }

  componentDidMount() {
    if (this.props.match) {
      this.setSelectedGroup(this.props.match.params.group);
      if (this.props.match.params.id) {
        // fetch the relevant artifact from the server.
        const id = this.props.match.params.id;
        axios.get(`http://localhost:3001/api/artifacts/${id}`)
          .then((res) => {
            this.setState({ artifact: res.data });
          });
      } else {
        this.setState({ artifact: null });
      }
    }
  }

  downloadCQL() {
    // let allElements = [];
    // axios.get('http://localhost:3001/api/TemplateInstance')
    //   .then((result) => {
    //     allElements = result.data;
    //     exportFile(allElements);
    //   });
    exportFile(this.state.droppedElements)
  }

  saveArtifact() {
    var artifact = {
      name: 'foo',
      templateInstances: this.state.droppedElements
    }
    // TODO: This needs to be extracted to somewhere better
    const url = 'http://localhost:3001/api';

    axios.post(`${url}/Artifact`, artifact)
      .then((result) => {
        // TODO:
        // capture artifact and ID
        // notification on save
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
          droppedElements={this.state.droppedElements} />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(BuilderPage);
