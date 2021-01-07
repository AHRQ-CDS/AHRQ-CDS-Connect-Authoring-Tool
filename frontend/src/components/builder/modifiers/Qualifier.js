import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { Visibility as VisibilityIcon } from '@material-ui/icons';
import { UncontrolledTooltip } from 'reactstrap';

import VSACAuthenticationModal from '../VSACAuthenticationModal';
import ElementModal from '../ElementModal';
import CodeSelectModal from '../CodeSelectModal';
import { Dropdown } from 'components/elements';

const options = [
  { value: 'value is a code from', label: 'value is a code from' },
  { value: 'value is the code', label: 'value is the code' }
];

/* eslint-disable jsx-a11y/no-onchange */
export default class Qualifier extends Component {
  viewValueSetDetails = (valueSet) => {
    if (!this.props.vsacApiKey) {
      return (
        <span className='element-select__modal element-modal disabled'>
          <span id={`LoginTooltip-${this.props.template.uniqueId}-qualifier`}>
            <IconButton aria-label="view" disabled color="primary">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </span>

          <UncontrolledTooltip target={`LoginTooltip-${this.props.template.uniqueId}-qualifier`} placement="left">
            Authenticate VSAC to view details
          </UncontrolledTooltip>
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
        vsacApiKey={this.props.vsacApiKey}
        selectedElement={valueSet}
        useIconButton={true}
        viewOnly={true}
      />
    );
  }

  handleChange = event => {
    const selectedOption = options.find(option => option.value === event.target.value);

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

    if (!this.props.vsacApiKey && !hasSelectedCode && !hasSelectedVS) {
      return (
        <div className="modifier-button">
          <VSACAuthenticationModal
            loginVSACUser={this.props.loginVSACUser}
            setVSACAuthStatus={this.props.setVSACAuthStatus}
            vsacIsAuthenticating={this.props.vsacIsAuthenticating}
            vsacStatus={this.props.vsacStatus}
            vsacStatusText={this.props.vsacStatusText}
          />
        </div>
      );
    } else if (this.props.qualifier === 'value is a code from' && !hasSelectedVS) {
      return (
        <div className="modifier-button">
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
            vsacApiKey={this.props.vsacApiKey}
          />
        </div>
      );
    } else if (this.props.qualifier === 'value is the code' && !hasSelectedCode) {
      return (
        <div className="modifier-button">
          <CodeSelectModal
            className="element-select__modal"
            template={this.props.template}
            vsacApiKey={this.props.vsacApiKey}
            isValidatingCode={this.props.isValidatingCode}
            isValidCode={this.props.isValidCode}
            codeData={this.props.codeData}
            validateCode={this.props.validateCode}
            resetCodeValidation={this.props.resetCodeValidation}
            updateModifier={this.handleCodeAdded}
          />
        </div>
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
      <div className="element-field-display">{selection}</div>
    );
  }

  renderValueSetViewButton() {
    if (!this.props.template) { return null; }

    const qualifierMod = this.props.template.modifiers.find(mod => mod.id === 'Qualifier');
    const hasSelectedVS = qualifierMod.values.valueSet != null;

    if (hasSelectedVS) {
      return (
        <div className="element-field-buttons">
          {this.viewValueSetDetails(qualifierMod.values.valueSet)}
        </div>
      );
    }

    return null;
  }

  render() {
    const { qualifier } = this.props;

    return (
      <div className="modifier qualifier-modifier">
        <Dropdown
          className="field-input field-input-lg"
          id="qualifier"
          label="Qualifier"
          onChange={this.handleChange}
          options={options}
          value={qualifier}
        />

        {this.renderButton()}
        {this.renderQualifierSelection()}
        {this.renderValueSetViewButton()}
      </div>
    );
  }
}

Qualifier.propTypes = {
  codeData: PropTypes.object,
  getVSDetails: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isRetrievingDetails: PropTypes.bool.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  loginVSACUser: PropTypes.func.isRequired,
  qualifier: PropTypes.string,
  resetCodeValidation: PropTypes.func.isRequired,
  searchVSACByKeyword: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  template: PropTypes.object.isRequired,
  updateAppliedModifier: PropTypes.func.isRequired,
  updateInstance: PropTypes.func.isRequired,
  validateCode: PropTypes.func.isRequired,
  vsacApiKey: PropTypes.string,
  vsacDetailsCodes: PropTypes.array.isRequired,
  vsacDetailsCodesError: PropTypes.string.isRequired,
  vsacIsAuthenticating: PropTypes.bool.isRequired,
  vsacSearchCount: PropTypes.number.isRequired,
  vsacSearchResults: PropTypes.array.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string
};
