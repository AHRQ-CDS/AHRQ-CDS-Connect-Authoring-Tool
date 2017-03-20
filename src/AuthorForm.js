import React, { Component } from 'react';

class AuthorForm extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', text: '' };
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleAuthorChange(e) {
    this.setState({ author: e.target.value });
  }
  handleTextChange(e) {
    this.setState({ text: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log(`${this.state.name} said "${this.state.text}"`)
    //we will be tying this into the POST method in a bit
  }
  render() {
    return (
      <form onSubmit={ this.handleSubmit }>
        <input
          type='text'
          placeholder='Your name…'
          value={ this.state.name }
          onChange={ this.handleAuthorChange } />
        <input
          type='text'
          placeholder='Say something…'
          value={ this.state.text }
          onChange={ this.handleTextChange } />
        <input
          type='submit'
          value='Post' />
      </form>
    );
  }
}

export default AuthorForm;
