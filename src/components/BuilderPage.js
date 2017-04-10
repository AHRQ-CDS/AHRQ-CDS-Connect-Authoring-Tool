import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import BuilderSubPalette from './BuilderSubPalette';
import BuilderPalette from './BuilderPalette';
import BuilderTarget from './BuilderTarget';
import groups from '../data/groupings';
import axios from 'axios';

class BuilderPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedGroup: null,
      droppedElements: [],
    };

    this.setDroppedElements = this.setDroppedElements.bind(this);
    this.getAllElements = this.getAllElements.bind(this);
  }

  getAllElements() {
    let allElements = [];
    axios.get('http://localhost:3001/api/ageRange')
      .then(result => {
        allElements = result.data;
        this.exportFile(allElements);
      });
  }

  exportFile(allElements) {
    let cqlText = '';

    // TODO: This will come from the inputs in the "Save" modal eventually.
    let libraryName = 'AgeRangeAuthoringDemo';
    let versionNumber = 1;
    let dataModel = "FHIR version '1.0.2'";
    let context = 'Patient';

    let initialCQL = `library ${libraryName} version '${versionNumber}' \n\n`;
    initialCQL += `using ${dataModel} \n\n`;
    initialCQL += `context ${context} \n\n`;
    cqlText += initialCQL;

    // TODO: Some of this will be removed and put into separate templates eventually.
    for(let i=0; i<allElements.length; i++) {
      cqlText += `define AgeRange: AgeInYears()>=${allElements[i].low} and AgeInYears()<=${allElements[i].high} \n`
    }

    let saveElement = document.createElement('a');
    saveElement.href = 'data:text/plain,' + encodeURIComponent(cqlText);
    saveElement.download = `${libraryName}.cql`;
    saveElement.click();
  }

  componentDidMount() {
    if (this.props.match) {
      this.setSelectedGroup(this.props.match.params.group);
    }
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
          <h2 className="builder__heading">Model title that's kind of long</h2>

          <div className="builder__buttonbar">
            <button onClick={this.getAllElements} className="builder__savebutton is-unsaved">Save</button>
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
