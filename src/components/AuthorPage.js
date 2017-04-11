import React from 'react';
import AuthorBox from './AuthorBox';

export default () => (
  <AuthorBox
    url='http://localhost:3001/api/authors'
    pollInterval={2000}
  />
);
