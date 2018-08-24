import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false
    };
  }

  toggleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
  }

  handleLogoutClick = () => {
    this.props.clearExecuteResults();
    this.props.onLogoutClick();
    this.props.history.push('/');
  }

  render() {
    const { authUser } = this.props;

    return (
      <div className="logout">
        <Dropdown isOpen={this.state.showMenu} toggle={this.toggleMenu} className="logout__authname">
          <DropdownToggle caret>{authUser}</DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.handleLogoutClick}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

Logout.propTypes = {
  authUser: PropTypes.string.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  clearExecuteResults: PropTypes.func.isRequired
};

const LogoutWithRouter = withRouter(Logout);

export default LogoutWithRouter;
