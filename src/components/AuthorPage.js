import React, { Component } from 'react';
import AuthorBox from './AuthorBox';

class AuthorPage extends Component {
  render() {
    return (
      <AuthorBox
        url='http://localhost:3001/api/authors'
        pollInterval={2000}
      />
    );
  }
}

export default AuthorPage;
