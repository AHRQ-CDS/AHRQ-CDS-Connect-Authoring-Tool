import React, { Component } from 'react';
import BuilderSubPalette from './BuilderSubPalette';
import BuilderPalette from './BuilderPalette';
import BuilderTarget from './BuilderTarget';
import groups from '../data/groupings';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

class BuilderPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedGroup: null
    }
  }

  componentDidMount() {
    if (this.props.match) {
      this.setSelectedGroup(this.props.match.params.group);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match != nextProps.match && this.props.match.params.group != nextProps.match.params.group) {
      this.setSelectedGroup(nextProps.match.params.group);
    }
  }

  setSelectedGroup(groupId) {
    const group = groups.find(group => group.id == groupId);
    if (group) {
      this.setState({ selectedGroup: group });
    } else {
      this.setState({ selectedGroup: null });
    }
  }

  renderSidebar() {
    if (this.state.selectedGroup) {
      return <BuilderSubPalette selectedGroup={this.state.selectedGroup} />;
    } else {
      return null;
    }
  }

  exportFile() {
    let finalText = 'String to save!';

    let saveElement = document.createElement('a');
    saveElement.href = 'data:text/plain,' + encodeURIComponent(finalText);
    saveElement.download = 'SaveMe.txt';
    saveElement.click();
  }

  render() {
    return (
      <div className="builder">
        <header className="builder__header">
          <h2 className="builder__heading">Model title that's kind of long</h2>

          <div className="builder__buttonbar">
            <button onClick={this.exportFile} className="builder__savebutton is-unsaved">Save</button>
            <button className="builder__deletebutton">Delete</button>
          </div>
        </header>
        <div className="builder__sidebar">
          <BuilderPalette selectedGroup={this.state.selectedGroup} />
          {this.renderSidebar()}
        </div>
        <BuilderTarget />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(BuilderPage);
