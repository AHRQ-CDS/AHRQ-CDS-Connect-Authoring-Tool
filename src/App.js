import React, { Component } from 'react';
import AuthorBox from './AuthorBox';
import '../node_modules/font-awesome/css/font-awesome.css';
import './styles/App.css';

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
      </div>
    );
  }
}

export default App;
