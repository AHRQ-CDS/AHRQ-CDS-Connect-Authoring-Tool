import React, { Component } from 'react';

class SaveButton extends Component {
  saveTextFile() {
    let finalText = 'String to save!';

    let saveElement = document.createElement('a');
    saveElement.href = 'data:text/plain,' + encodeURIComponent(finalText);
    saveElement.download = 'SaveMe.txt';
    saveElement.click();
  }

  render() {
    return (
      <button onClick={this.saveTextFile}>
        Save
      </button>
    )
  }
}

export default SaveButton;