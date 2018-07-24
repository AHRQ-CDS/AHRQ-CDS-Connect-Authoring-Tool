import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PatientDataSection extends Component {
  renderHeader = title => {
    return (
      <div className="patient-view__header">
        <div className="header-title">{title}</div>
        <div className="header-divider"></div>
      </div>
    );
  }

  render() {
    const { resource } = this.props;

    return (
      <div className="patient-data-section">
        {resource}
      </div>
    );
  }
}

PatientDataSection.propTypes = {
  resource: PropTypes.string.isRequired
};
