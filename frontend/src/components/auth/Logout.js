import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import Modal from '../elements/Modal';

class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      showConfirmLogoutModal: false
    };
  }

  toggleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
  }

  openConfirmLogoutModal = () => {
    this.setState({ showConfirmLogoutModal: true });
  }

  closeConfirmLogoutModal = () => {
    this.setState({ showConfirmLogoutModal: false });
  }

  handleLogoutClick = () => {
    this.props.onLogoutClick();
    window.setTimeout(() => this.props.history.push('/'), 10);
    this.closeConfirmLogoutModal();
  }

  renderConfirmLogoutModal() {
    return (
      <Modal
        modalTitle="Logout Confirmation"
        modalId="confirm-logout-modal"
        modalTheme="light"
        modalSubmitButtonText="Logout"
        handleShowModal={this.state.showConfirmLogoutModal}
        handleCloseModal={this.closeConfirmLogoutModal}
        handleSaveModal={this.handleLogoutClick}>

        <div className="logout-confirmation-modal modal__content">
          <h5>Are you sure you want to log out without saving your changes?</h5>
        </div>
      </Modal>
    );
  }

  render() {
    const { authUser, artifactSaved } = this.props;

    return (
      <div className="logout">
        <Dropdown isOpen={this.state.showMenu} toggle={this.toggleMenu} className="logout__authname">
          <DropdownToggle caret>{authUser}</DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={artifactSaved ? this.handleLogoutClick : this.openConfirmLogoutModal}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {this.renderConfirmLogoutModal()}
      </div>
    );
  }
}

Logout.propTypes = {
  authUser: PropTypes.string.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  artifactSaved: PropTypes.bool.isRequired
};

const LogoutWithRouter = withRouter(Logout);

export default LogoutWithRouter;
