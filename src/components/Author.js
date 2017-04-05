import React, { Component } from 'react';

class Author extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toBeUpdated: false,
      name: '',
      text: '',
    };

		// Binding all our functions to this class
    this.deleteAuthor = this.deleteAuthor.bind(this);
    this.updateAuthor = this.updateAuthor.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleAuthorUpdate = this.handleAuthorUpdate.bind(this);
  }

  updateAuthor(e) {
    e.preventDefault();
		// Brings up the update field when we click on the update link
    this.setState({ toBeUpdated: !this.state.toBeUpdated });
  }

  handleAuthorUpdate(e) {
    e.preventDefault();
    const id = this.props.uniqueID;
		// If author or text changed, set it. If not, leave it null
		// and our PUT request will ignore it
    const name = (this.state.name) ? this.state.name : null;
    const text = (this.state.text) ? this.state.text : null;
    const author = { name, text };
    this.props.onAuthorUpdate(id, author);
    this.setState({
      toBeUpdated: !this.state.toBeUpdated,
      name: '',
      text: '',
    });
  }

  deleteAuthor(e) {
    e.preventDefault();
    const id = this.props.uniqueID;
    this.props.onAuthorDelete(id);
    console.log('oops author deleted');
  }

  handleTextChange(e) {
    this.setState({ text: e.target.value });
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  render() {
    return (
      <div>
        <strong>{ this.props.name }</strong>:
        { this.props.text }
        <a href='#' onClick={ this.updateAuthor }>update</a>
        <a href='#' onClick={ this.deleteAuthor }>delete</a>
        { (this.state.toBeUpdated)
        	? (<form onSubmit={ this.handleAuthorUpdate }>
        	<input type='text'
        		placeholder='Update name...'
        		value={ this.state.name }
        		onChange={ this.handleNameChange } />
        	<input type='text'
        		placeholder='Update your text...'
        		value={ this.state.text }
        		onChange={ this.handleTextChange } />
        	<input type='submit'
        		value='Update' />
        	</form>)
        	: null}
      </div>

    );
  }
}

export default Author;
