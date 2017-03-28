import React, { Component } from 'react';

class Item extends Component {
  dragStarted(event) {
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
        Adult
      </div>
    )
  }
}

export default Item;