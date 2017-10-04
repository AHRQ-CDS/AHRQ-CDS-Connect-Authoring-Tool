/* eslint-disable import/first */
import React from 'react';

import Header from './components/Header';
import Navbar from './components/Navbar';

import '../node_modules/font-awesome/css/font-awesome.css';
import './styles/App.css';
import 'react-select/dist/react-select.css';

const App = (props) => {
  const { children } = props; // eslint-disable-line

  return (
    <div className="app">
      <Header />
      <Navbar />
      {children}
    </div>
  );
};

App.displayName = 'App';

export default App;
