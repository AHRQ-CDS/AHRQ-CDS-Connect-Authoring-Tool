import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton } from '@material-ui/core';
import {
  Check as CheckIcon,
  List as ListIcon,
  LocalHospital as LocalHospitalIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon
} from '@material-ui/icons';
import { UncontrolledTooltip } from 'reactstrap';
import _ from 'lodash';

import { CodeSelectModal, ValueSetSelectModal, VSACAuthenticationModal } from 'components/modals';
import { Dropdown } from 'components/elements';
import { getFieldWithType, getFieldWithId } from 'utils/instances';

const options = [
  { value: 'value is a code from', label: 'value is a code from' },
  { value: 'value is the code', label: 'value is the code' }
];

/* eslint-disable jsx-a11y/no-onchange */
export default class Qualifier extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCodeSelectModal: false,
      showValueSetSelectModal: false,
      showValueSetViewModal: false,
      showVSACAuthenticationModal: false
    };
  }

  openVSACAuthenticationModal = () => {
    this.setState({ showVSACAuthenticationModal: true });
  }

  closeVSACAuthenticationModal = () => {
    this.setState({ showVSACAuthenticationModal: false });
  }

  openValueSetSelectModal = () => {
    this.setState({ showValueSetSelectModal: true });
  }

  closeValueSetSelectModal = () => {
    this.setState({ showValueSetSelectModal: false });
  }

  openValueSetViewModal = () => {
    this.setState({ showValueSetViewModal: true });
  }

  closeValueSetViewModal = () => {
    this.setState({ showValueSetViewModal: false });
  }

  openCodeSelectModal = () => {
    this.setState({ showCodeSelectModal: true });
  }

  closeCodeSelectModal = () => {
    this.setState({ showCodeSelectModal: false });
  }

  handleSelectValueSet = (template, valueSet) => {
    const selectedTemplate = _.cloneDeep(template);
    const vsacField = getFieldWithType(selectedTemplate.fields, '_vsac');
    const nameField = getFieldWithId(selectedTemplate.fields, 'element_name');
    const valueSetsToAdd = vsacField?.valueSets || [];
    valueSetsToAdd.push(valueSet);

    // Create array of which field to update, the new value to set, and the attribute to update (value is default)
    const arrayToUpdate = [
      { [vsacField.id]: valueSetsToAdd, attributeToEdit: 'valueSets' },
      { [vsacField.id]: true, attributeToEdit: 'static' }
    ];

    // Only set name of element if there isn't one already
    if (!nameField.value) arrayToUpdate.push({ [nameField.id]: valueSet.name });
    this.handleVSAdded(arrayToUpdate);
  }

  viewValueSetDetails = valueSet => {
    const { template, vsacApiKey } = this.props;
    const { showValueSetSelectModal } = this.state;

    if (!Boolean(vsacApiKey)) {
      return (
        <span className='element-select__modal element-modal disabled'>
          <span id={`LoginTooltip-${template.uniqueId}-qualifier`}>
            <IconButton aria-label="view" disabled color="primary">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </span>

          <UncontrolledTooltip target={`LoginTooltip-${template.uniqueId}-qualifier`} placement="left">
            Authenticate VSAC to view details
          </UncontrolledTooltip>
        </span>
      );
    }

    return (
      <>
        <IconButton aria-label="View Value Set" color="primary" onClick={this.openValueSetSelectModal}>
          <VisibilityIcon fontSize="small" />
        </IconButton>

        {showValueSetSelectModal && (
          <ValueSetSelectModal
            handleCloseModal={this.closeValueSetSelectModal}
            handleSelectValueSet={valueSet => this.handleSelectValueSet(template, valueSet)}
            readOnly
            savedValueSet={valueSet}
          />
        )}
      </>
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
    const { qualifier, template, vsacApiKey } = this.props;
    const { showCodeSelectModal, showValueSetViewModal, showVSACAuthenticationModal } = this.state;

    if (!template) { return null; }

    const qualifierMod = template.modifiers.find(mod => mod.id === 'Qualifier');
    const hasSelectedVS = qualifierMod.values.valueSet != null;
    const hasSelectedCode = qualifierMod.values.code != null;

    if (!Boolean(vsacApiKey) && !hasSelectedCode && !hasSelectedVS) {
      return (
        <div className="modifier-button">
          <Button
            color="primary"
            disabled={Boolean(vsacApiKey)}
            onClick={this.openVSACAuthenticationModal}
            variant="contained"
            startIcon={Boolean(vsacApiKey) ? <CheckIcon /> : <LockIcon />}
          >
            {Boolean(vsacApiKey) ? 'VSAC Authenticated' : 'Authenticate VSAC' }
          </Button>

          {showVSACAuthenticationModal && (
            <VSACAuthenticationModal handleCloseModal={this.closeVSACAuthenticationModal} />
          )}
        </div>
      );
    } else if (qualifier === 'value is a code from' && !hasSelectedVS) {
      return (
        <div className="modifier-button">
          <Button color="primary" onClick={this.openValueSetViewModal} startIcon={<ListIcon />} variant="contained">
            Select Value Set
          </Button>

          {showValueSetViewModal && (
            <ValueSetSelectModal
              handleCloseModal={this.closeValueSetViewModal}
              handleSelectValueSet={valueSet => this.handleVSAdded(valueSet)}
            />
          )}
        </div>
      );
    } else if (qualifier === 'value is the code' && !hasSelectedCode) {
      return (
        <div className="modifier-button">
          <Button
            color="primary"
            onClick={this.openCodeSelectModal}
            startIcon={<LocalHospitalIcon />}
            variant="contained"
          >
            Add Code
          </Button>

          {showCodeSelectModal && (
            <CodeSelectModal
              handleCloseModal={this.closeCodeSelectModal}
              handleSelectCode={codeData => this.handleCodeAdded(codeData)}
            />
          )}
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
    if (!this.props.template) return null;

    const qualifierMod = this.props.template.modifiers.find(mod => mod.id === 'Qualifier');
    const hasSelectedVS = qualifierMod.values.valueSet != null;

    if (hasSelectedVS) return this.viewValueSetDetails(qualifierMod.values.valueSet);

    return null;
  }

  render() {
    const { qualifier } = this.props;

    return (
      <div className="modifier qualifier-modifier">
        <div className="field-input-group">
          <Dropdown
            className="field-input field-input-lg"
            id="qualifier"
            label="Qualifier"
            onChange={this.handleChange}
            options={options}
            value={qualifier}
          />

          {this.renderValueSetViewButton()}
        </div>

        {this.renderButton()}
        {this.renderQualifierSelection()}
      </div>
    );
  }
}

Qualifier.propTypes = {
  index: PropTypes.number.isRequired,
  qualifier: PropTypes.string,
  template: PropTypes.object.isRequired,
  updateAppliedModifier: PropTypes.func.isRequired,
  vsacApiKey: PropTypes.string
};
