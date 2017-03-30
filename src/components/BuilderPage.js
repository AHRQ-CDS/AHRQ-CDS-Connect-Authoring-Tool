import React, { Component } from 'react';
import BuilderSubPalette from './BuilderSubPalette';
import BuilderPalette from './BuilderPalette';
import groups from '../data/groupings';

class BuilderPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedGroup: null
    }
  }

  allowDrop(event) {
    event.preventDefault();
  }

  onDrop(event) {
    event.preventDefault();
    let id = event.dataTransfer.getData('elementId');
    event.target.appendChild(document.getElementById(id));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match != nextProps.match && this.props.match.params.group != nextProps.match.params.group) {
      const g = nextProps.match.params.group;
      console.log(g);
      const group = groups.find(group => group.id == g);
      if (group) {
        this.setState({ selectedGroup: group });
      } else {
        this.setState({ selectedGroup: null });
      }
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

        <section className="main"
          onDragOver={this.allowDrop}
          onDrop={this.onDrop}>
          Drop content here.
        </section>
      </div>
    );
  }
}

export default BuilderPage;
