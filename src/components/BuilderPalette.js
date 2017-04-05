import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { NavLink } from 'react-router-dom';
import groups from '../data/groupings';

class BuilderPalette extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuExpanded: false
    }
  }

  renderActiveLink() {
    return (
      <button
        id="palette-active-group"
        aria-label="Change displayed category"
        className={this.state.menuExpanded ? "is-expanded" : ""}
        onClick={() => this.setState({ menuExpanded: !this.state.menuExpanded })}>
        <FontAwesome fixedWidth name={this.props.selectedGroup ? this.props.selectedGroup.icon : 'question-circle'} />
        {this.props.selectedGroup ? this.props.selectedGroup.name : 'Find elements'}
        <FontAwesome className='fa-fw dropdown' name='caret-down' />
      </button>
    );
  }

  renderMenu() {
    return groups.map((g) => {
      const location = `/build/${g.id}`;
      return (
        <li role="menuitem" key={g.name}>
          <NavLink
            onClick={() => this.setState({ menuExpanded: false })}
            tabIndex={this.state.menuExpanded ? "0" : "-1"}
            to={location}>
            <FontAwesome fixedWidth name={g.icon} />
            {g.name}
          </NavLink>
        </li>
      );
    });
  }


  render() {
    return (
      <nav className="builder__palette" role="navigation" aria-label="Element menu">
        <ul
          id="builder__palette-menu"
          role="menubar"
          aria-hidden={this.state.menuExpanded ? "true" : "false"}
          >
          <li role="menuitem" aria-haspopup="true">
            {this.renderActiveLink()}
            <ul
              role='menu'
              aria-hidden={this.state.menuExpanded ? "false" : "true"}
              aria-expanded={this.state.menuExpanded ? "true" : "false"}>
              {this.renderMenu()}
            </ul>
          </li>
        </ul>
      </nav>
    );
  }
}

export default BuilderPalette;
