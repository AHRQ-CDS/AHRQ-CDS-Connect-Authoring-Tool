import React, { Component } from 'react';

class Author extends Component {
  render() {
    return (
      <p>
        <strong>{ this.props.name }</strong> 
        { this.props.text }
      </p>

    );
  }
}

export default Author;
