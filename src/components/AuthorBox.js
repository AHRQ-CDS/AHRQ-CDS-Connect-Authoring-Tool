import React, { Component } from 'react';
import axios from 'axios';
import AuthorList from './AuthorList';
import AuthorForm from './AuthorForm';

class AuthorBox extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.loadAuthorsFromServer = this.loadAuthorsFromServer.bind(this);
    this.handleAuthorSubmit = this.handleAuthorSubmit.bind(this);
    this.handleAuthorDelete = this.handleAuthorDelete.bind(this);
    this.handleAuthorUpdate = this.handleAuthorUpdate.bind(this);
  }

  loadAuthorsFromServer() {
    axios.get(this.props.url)
      .then(res => {
        this.setState({ data: res.data });
      });
  }
  handleAuthorSubmit(author) {
    let authors = this.state.data;
    author.id = Date.now();
    let newAuthors = authors.concat([author]);
    this.setState({ data: newAuthors });
    axios.post(this.props.url, author)
      .catch(err => {
        console.error(err);
        this.setState({ data: authors });
      });
  }

  handleAuthorDelete(id) {
    axios.delete(`${this.props.url}/${id}`)
      .then(res => {
        console.log("Author deleted");
      })
      .catch(err => {
        console.error(err);
      });
  }

  handleAuthorUpdate(id, author) {
    // Sends the author id and new name/text to our api
    axios.put(`${this.props.url}/${id}`, author)
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.loadAuthorsFromServer();
    this.loadInterval = setInterval(this.loadAuthorsFromServer, this.props.pollInterval);
  }

  componentWillUnmount () {
    this.loadInterval && clearInterval(this.loadInterval);
    this.loadInterval = false;
  }

  render() {
    return (
      <div>
        <h2>Authors:</h2>
        <AuthorList data={ this.state.data }
          onAuthorDelete={this.handleAuthorDelete}
          onAuthorUpdate={this.handleAuthorUpdate} />
        <AuthorForm onAuthorSubmit={ this.handleAuthorSubmit } />
      </div>
    );
  }
}

export default AuthorBox;
