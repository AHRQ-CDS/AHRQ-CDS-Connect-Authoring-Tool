import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import ElementTypeahead from './ElementTypeahead';
import Config from '../../../config';

const API_BASE = Config.api.baseUrl;

class BuilderPalette extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuExpanded: false
    };
  }

  componentWillMount() {
    axios.get(`${API_BASE}/config/templates`)
      .then((result) => {
        this.setState({ groups: result.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  renderActiveLink() {
    return (
      <button
        id="palette-active-group"
        aria-label="Change displayed category"
        className={this.state.menuExpanded ? 'is-expanded' : ''}
        onClick={() => this.setState({ menuExpanded: !this.state.menuExpanded })}>
        <FontAwesome fixedWidth name={this.props.selectedGroup ? this.props.selectedGroup.icon : 'question-circle'} />
        {this.props.selectedGroup ? this.props.selectedGroup.name : 'Find elements'}
        <FontAwesome className='fa-fw dropdown' name='caret-down' />
      </button>
    );
  }

  renderMenu() {
    if (this.props.groups == null) { return null; }
    return this.props.groups.filter(g => !g.suppress).map((g) => {
      const location = `/build/${g.id}`;
      return (
        <li role="menuitem" key={g.name}>
          <NavLink
            onClick={() => this.setState({ menuExpanded: false })}
            tabIndex={this.state.menuExpanded ? '0' : '-1'}
            to={location}>
            <FontAwesome fixedWidth name={g.icon} />
            {g.name}
          </NavLink>
        </li>
      );
    });
  }

  render() {
    if (this.props.groups == null) { return null; }
    return (
      <nav className="builder__palette" aria-label="Element menu">
        <ul
          id="builder__palette-menu"
          role="menubar"
          aria-hidden={this.state.menuExpanded ? 'true' : 'false'}
          >
          <li role="menuitem" aria-haspopup="true">
            {this.renderActiveLink()}
            <ul
              role='menu'
              aria-hidden={this.state.menuExpanded ? 'false' : 'true'}
              aria-expanded={this.state.menuExpanded ? 'true' : 'false'}>
              {this.renderMenu()}
            </ul>
            <ElementTypeahead
              groups={this.props.groups}
              selectedGroup={this.props.selectedGroup}
              templateInstances={this.props.templateInstances}
              updateTemplateInstances={this.props.updateTemplateInstances}
            />
          </li>
        </ul>
      </nav>
    );
  }
}

export default BuilderPalette;
