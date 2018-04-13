import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import VSACAuthenticationModal from '../VSACAuthenticationModal';
import ElementModal from '../ElementModal';
import CodeSelectModal from '../CodeSelectModal';

/* eslint-disable jsx-a11y/no-onchange */
export default class Qualifier extends Component {
  handleChange = (selectedOption) => {
    this.props.updateAppliedModifier(this.props.index, {
      qualifier: selectedOption ? selectedOption.value : null,
      valueSet: null,
      code: null
    });
  }

  handleVSAdded = (valueSet) => {
    this.props.updateAppliedModifier(this.props.index, { valueSet });
  }

  handleCodeAdded = (code) => {
    this.props.updateAppliedModifier(this.props.index, { code: [code] });
  }

  renderButton = () => {
    const qualifierMod = this.props.template.modifiers.find(mod => mod.id === 'Qualifier');
    const hasSelectedVS = qualifierMod.values.valueSet != null;
    const hasSelectedCode = qualifierMod.values.code != null;

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
    } else if (this.props.qualifier === 'value is a code from' && !hasSelectedVS) {
      return (
        <ElementModal
          className="element-select__modal"
          updateModifier={this.handleVSAdded}
          searchVSACByKeyword={this.props.searchVSACByKeyword}
          isSearchingVSAC={this.props.isSearchingVSAC}
          vsacSearchResults={this.props.vsacSearchResults}
          vsacSearchCount={this.props.vsacSearchCount}
          getVSDetails={this.props.getVSDetails}
          isRetrievingDetails={this.props.isRetrievingDetails}
          vsacDetailsCodes={this.props.vsacDetailsCodes}
        />
      );
    } else if (this.props.qualifier === 'value is the code' && !hasSelectedCode) {
      return (
        <CodeSelectModal
          className="element-select__modal"
          updateModifier={this.handleCodeAdded}
        />
      );
    }

    return null;
  }

  renderQualifierSelection() {
    const qualifierMod = this.props.template.modifiers.find(mod => mod.id === 'Qualifier');
    const hasSelectedVS = qualifierMod.values.valueSet != null;
    const hasSelectedCode = qualifierMod.values.code != null;

    if (!qualifierMod) { return null; }

    let selection = '';
    if (hasSelectedVS) {
      const qualifierValueSet = qualifierMod.values.valueSet;
      selection = `${qualifierValueSet.name} (${qualifierValueSet.oid})`;
    } else if (hasSelectedCode) {
      const qualifierCode = qualifierMod.values.code[0];
      selection = `${qualifierCode.codeSystem.name} (${qualifierCode.code})`;
    }

    return (
      <div className="selected-qualifier">{selection}</div>
    );
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
        {this.renderQualifierSelection()}
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
