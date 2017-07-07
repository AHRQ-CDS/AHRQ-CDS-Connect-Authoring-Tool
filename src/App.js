/* eslint-disable import/first */
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../node_modules/font-awesome/css/font-awesome.css';
import './styles/App.css';
import 'react-select/dist/react-select.css';

export default () => (
  <div>
    <h1>Welcome to the CDS Authoring Tool</h1>
    <p>Build your first Clinicial Decision Support artifact by clicking <NavLink to="/build">here</NavLink>.</p>
  </div>
);
