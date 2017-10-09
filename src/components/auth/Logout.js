import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = { showMenu: false };
  }

  toggleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
  }

  render() {
    const { authUser, onLogoutClick } = this.props;

    return (
      <div className="logout">
        <Dropdown isOpen={this.state.showMenu} toggle={this.toggleMenu} className="logout__authname">
          <DropdownToggle caret>{authUser}</DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={onLogoutClick}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

Logout.propTypes = {
  authUser: PropTypes.string.isRequired,
  onLogoutClick: PropTypes.func.isRequired
};
