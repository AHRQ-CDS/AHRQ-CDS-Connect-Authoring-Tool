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
      return <BuilderSubPalette group={this.state.selectedGroup} />;
    } else {
      return <p>Pick a collection</p>;
    }
  }

  render() {
    return (
      <div className="builder">
        <BuilderPalette />
        {this.renderSidebar()}
        <BuilderTarget />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(BuilderPage);
