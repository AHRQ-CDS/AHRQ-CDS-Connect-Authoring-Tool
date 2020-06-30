import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

export default class Banner extends Component {
  handleClose = (event) => {
    const { close } = this.props;
    if (close) close(event);
  }

  render() {
    const { type, close, children } = this.props;

    return (
      <div className={`banner ${type}`}>
        <div className="message"><FontAwesomeIcon icon={faExclamationCircle} /> {children}</div>
        {close && <FontAwesomeIcon className="close-icon" icon={faTimes} onClick={event => this.handleClose(event)}/>}
      </div>
    );
  }
}

Banner.propTypes = {
  type: PropTypes.string, // "notification" or "warning"
  close: PropTypes.func,
  children: PropTypes.string.isRequired
};

Banner.defaultProps = {
  type: 'notification',
  close: null
};
