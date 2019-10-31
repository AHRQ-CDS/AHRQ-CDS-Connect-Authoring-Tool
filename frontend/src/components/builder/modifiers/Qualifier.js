import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';

import VSACAuthenticationModal from '../VSACAuthenticationModal';
import ElementModal from '../ElementModal';
import CodeSelectModal from '../CodeSelectModal';
import StyledSelect from '../../elements/StyledSelect';

const options = [
  { value: 'value is a code from', label: 'value is a code from' },
  { value: 'value is the code', label: 'value is the code' }
];

/* eslint-disable jsx-a11y/no-onchange */
export default class Qualifier extends Component {
  viewValueSetDetails = (valueSet) => {
    if (!this.props.vsacFHIRCredentials.password) {
      return (
        <span className='element-select__modal element-modal disabled'>
          <span>
            <span
              id={`LoginTooltip-${this.props.template.uniqueId}-qualifier`}>
              <FontAwesome name="eye" />
            </span>
            <UncontrolledTooltip target={`LoginTooltip-${this.props.template.uniqueId}-qualifier`} placement="left">
              Authenticate VSAC to view details
            </UncontrolledTooltip>
          </span>
        </span>
      );
    }
    return (
      <ElementModal
        className="element-select__modal"
        updateElement={this.props.updateInstance}
        searchVSACByKeyword={this.props.searchVSACByKeyword}
        isSearchingVSAC={this.props.isSearchingVSAC}
        vsacSearchResults={this.props.vsacSearchResults}
        vsacSearchCount={this.props.vsacSearchCount}
        template={this.props.template}
        getVSDetails={this.props.getVSDetails}
        isRetrievingDetails={this.props.isRetrievingDetails}
        vsacDetailsCodes={this.props.vsacDetailsCodes}
        vsacDetailsCodesError={this.props.vsacDetailsCodesError}
        vsacFHIRCredentials={this.props.vsacFHIRCredentials}
        selectedElement={valueSet}
        useIconButton={true}
        iconForButton={'eye'}
        viewOnly={true}
      />
    );
  }

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
    this.props.updateAppliedModifier(this.props.index, { code });
  }

  renderButton = () => {
    if (!this.props.template) { return null; }

    const qualifierMod = this.props.template.modifiers.find(mod => mod.id === 'Qualifier');
    const hasSelectedVS = qualifierMod.values.valueSet != null;
    const hasSelectedCode = qualifierMod.values.code != null;

    if (this.props.vsacFHIRCredentials.username == null && !hasSelectedCode && !hasSelectedVS) {
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
          vsacDetailsCodesError={this.props.vsacDetailsCodesError}
          vsacFHIRCredentials={this.props.vsacFHIRCredentials}
        />
      );
    } else if (this.props.qualifier === 'value is the code' && !hasSelectedCode) {
      return (
        <CodeSelectModal
          className="element-select__modal"
          template={this.props.template}
          vsacFHIRCredentials={this.props.vsacFHIRCredentials}
          isValidatingCode={this.props.isValidatingCode}
          isValidCode={this.props.isValidCode}
          codeData={this.props.codeData}
          validateCode={this.props.validateCode}
          resetCodeValidation={this.props.resetCodeValidation}
          updateModifier={this.handleCodeAdded}
        />
      );
    }

    return null;
  }

  renderQualifierSelection() {
    if (!this.props.template) { return null; }

    const qualifierMod = this.props.template.modifiers.find(mod => mod.id === 'Qualifier');
    const hasSelectedVS = qualifierMod.values.valueSet != null;
    const hasSelectedCode = qualifierMod.values.code != null;

    if (!qualifierMod) { return null; }

    let selection = '';
    if (hasSelectedVS) {
      const qualifierValueSet = qualifierMod.values.valueSet;
      selection = `${qualifierValueSet.name} (${qualifierValueSet.oid})`;
    } else if (hasSelectedCode) {
      const qualifierCode = qualifierMod.values.code;
      selection = `${qualifierCode.codeSystem.name} (${qualifierCode.code})
        ${qualifierCode.display === '' ? '' : ` - ${qualifierCode.display}`}`;
    }

    return (
      <div className="selected-qualifier">{selection}</div>
    );
  }

  renderValueSetViewButton() {
    if (!this.props.template) { return null; }

    const qualifierMod = this.props.template.modifiers.find(mod => mod.id === 'Qualifier');
    const hasSelectedVS = qualifierMod.values.valueSet != null;

    if (hasSelectedVS) {
      return (
        <div className="vs-info__buttons align-right col-2">
          {this.viewValueSetDetails(qualifierMod.values.valueSet)}
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <div className="qualifier row">
        <div className="d-flex flex-wrap col-10">
          <StyledSelect
            className="Select"
            name="Qualifier"
            aria-label="Qualifier"
            title="Qualifier"
            placeholder="choose qualifier"
            value={options.find(({ value }) => value === this.props.qualifier)}
            onChange={this.handleChange}
            options={options}
          />

          {this.renderButton()}
          {this.renderQualifierSelection()}
        </div>

        {this.renderValueSetViewButton()}
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
  vsacDetailsCodesError: PropTypes.string.isRequired,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  vsacFHIRCredentials: PropTypes.object,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired
};
