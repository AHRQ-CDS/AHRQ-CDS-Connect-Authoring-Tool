import React from 'react';
import ReactDOM from 'react-dom';
import axe from 'react-axe';
import App from './App';

beforeEach(() => axe(React, ReactDOM, 1000));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div); // not sure how this plays with react-router if at all
});
