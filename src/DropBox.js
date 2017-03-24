import React, { Component } from 'react';

class DropBox extends Component {
  allowDrop(event) {
    event.preventDefault();
  }

  onDrop(event) {
    event.preventDefault();
    console.log("drop event");
    let data = event.dataTransfer.getData('text');
    event.target.appendChild(document.getElementById(data));
  }

  render() {
    let divStyle = {
      width: '350px',
      height: '70px',
      padding: '10px',
      border: '1px solid'
    }

    return (
      <div onDragOver={this.allowDrop}
        onDrop={this.onDrop}
        style={divStyle}>
      BOX
      </div>
    )
  }
}

export default DropBox;