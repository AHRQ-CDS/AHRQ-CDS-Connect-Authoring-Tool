import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import VSACAuthenticationModal from '../VSACAuthenticationModal';
import ElementModal from '../ElementModal';
import CodeSelectModal from '../CodeSelectModal';

/* eslint-disable jsx-a11y/no-onchange */
export default class Qualifier extends Component {
  handleChange = (selectedOption) => {
    console.debug('selectedOption: ', selectedOption);
    this.props.updateAppliedModifier(this.props.index, { qualifier: selectedOption ? selectedOption.value : null });
  }

  renderButton = () => {
    if (this.props.timeLastAuthenticated < new Date() - 27000000) {
      return (
        <div id="vsac-controls">
          <VSACAuthenticationModal
            loginVSACUser={this.props.loginVSACUser}
            setVSACAuthStatus={this.props.setVSACAuthStatus}
            vsacStatus={this.props.vsacStatus}
            vsacStatusText={this.props.vsacStatusText}
          />
        </div>
      );
    } else if (this.props.qualifier === 'value is a code from') {
      return (
        <ElementModal
          className="element-select__modal"
          updateElement={this.props.updateInstance}
          searchVSACByKeyword={this.props.searchVSACByKeyword}
          isSearchingVSAC={this.props.isSearchingVSAC}
          vsacSearchResults={this.props.vsacSearchResults}
          vsacSearchCount={this.props.vsacSearchCount}
          template={this.props.templateInstance}
          getVSDetails={this.props.getVSDetails}
          isRetrievingDetails={this.props.isRetrievingDetails}
          vsacDetailsCodes={this.props.vsacDetailsCodes}
        />
      );
    } else if (this.props.qualifier === 'value is the code') {
      return (
        <CodeSelectModal
          className="element-select__modal"
          updateElement={this.props.updateInstance}
          template={this.props.templateInstance}
        />
      );
    }

    return null;
  }

  render() {
    return (
      <div className="qualifier">
        <Select
          name="Qualifier"
          aria-label="Qualifier"
          title="Qualifier"
          placeholder="choose qualifier"
          value={this.props.qualifier}
          onChange={this.handleChange}
          options={[
            { value: 'value is a code from', label: 'value is a code from' },
            { value: 'value is the code', label: 'value is the code' }
          ]}
        />

        {this.renderButton()}
      </div>
    );
  }
}

Qualifier.propTypes = {
  index: PropTypes.number.isRequired,
  qualifier: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired,
  updateInstance: PropTypes.func.isRequired,
  searchVSACByKeyword: PropTypes.func.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  vsacSearchResults: PropTypes.array.isRequired,
  vsacSearchCount: PropTypes.number.isRequired,
  template: PropTypes.object.isRequired,
  getVSDetails: PropTypes.func.isRequired,
  isRetrievingDetails: PropTypes.bool.isRequired,
  vsacDetailsCodes: PropTypes.array.isRequired,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string
};
