import React, { Component } from 'react';
import AuthorList from './AuthorList';
import AuthorForm from './AuthorForm';
import DATA from '../data';

class AuthorBox extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }
  render() {
    return (
      <div>
        <h2>Authors:</h2>
        <AuthorList data={ DATA }/>
        <AuthorForm />
      </div>
    );
  }
}

export default AuthorBox;
