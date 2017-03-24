import React, { Component } from 'react';

class Item extends Component {
  dragStarted(event) {
    // JULIA Why does this get called so often when you pass event in on this.dragStarted(event)
    console.log("started drag")
    event.dataTransfer.setData('text', event.target.id);
  }

  render() {
    let style = {
      padding: '10px'
    }

    return (
      <div style={style}
        id='itemDiv'
        draggable='true'
        onDragStart={this.dragStarted}>
        Test item to drag
      </div>
    )
  }
}

export default Item;