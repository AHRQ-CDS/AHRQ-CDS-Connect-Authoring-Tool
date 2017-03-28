import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AuthorBox from './AuthorBox';
import Item from './Item';
import DropBox from './DropBox';
import SaveButton from './SaveButton';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <AuthorBox
          url='http://localhost:3001/api/authors'
          pollInterval={2000}
        />
        <div style={{padding: '10px'}}></div>
        <Item />
        <DropBox />
        <SaveButton />
      </div>
    );
  }
}

export default App;
