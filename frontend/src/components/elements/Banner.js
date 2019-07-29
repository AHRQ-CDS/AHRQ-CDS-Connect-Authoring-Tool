import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

export default class Banner extends Component {
  handleClose = (event) => {
    const { close } = this.props;
    if (close) close(event);
  }

  render() {
    const { type, close, children } = this.props;

    return (
      <div className={`banner ${type}`}>
        <div className="message"><FontAwesome name="exclamation-circle" /> {children}</div>
        {close && <FontAwesome className="close-icon" name="times" onClick={event => this.handleClose(event)}/>}
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
