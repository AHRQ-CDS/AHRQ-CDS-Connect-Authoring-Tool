import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { Close as CloseIcon, Visibility as VisibilityIcon } from '@material-ui/icons';
import { UncontrolledTooltip } from 'reactstrap';
import _ from 'lodash';

import { ValueSetSelectModal } from 'components/modals';
import { getFieldWithType, getFieldWithId } from 'utils/instances';

export default class ValueSetTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = { showValueSetSelectModal: false };
  }

  openValueSetSelectModal = () => {
    this.setState({ showValueSetSelectModal: true });
  }

  closeValueSetSelectModal = () => {
    this.setState({ showValueSetSelectModal: false });
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
    this.updateInstance(arrayToUpdate);
  }

  viewValueSetDetails = () => {
    const { templateInstance, valueSet, vsacApiKey } = this.props;
    const { showValueSetSelectModal } = this.state;

    if (!vsacApiKey) {
      return (
        <span className="element-select__modal element-modal disabled">
          <span id={`LoginTooltip-${templateInstance.uniqueId}`}>
            <IconButton aria-label="view" disabled color="primary">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </span>

          <UncontrolledTooltip target={`LoginTooltip-${templateInstance.uniqueId}`} placement="left">
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
            handleSelectValueSet={newValueSet => this.handleSelectValueSet(templateInstance, newValueSet)}
            readOnly
            savedValueSet={valueSet}
          />
        )}
      </>
    );
  };

  deleteValueSet = valueSetToDelete => {
    const templateInstanceClone = _.cloneDeep(this.props.templateInstance);
    const templateInstanceVsacField = getFieldWithType(templateInstanceClone.fields, '_vsac');
    if (templateInstanceVsacField && templateInstanceVsacField.valueSets) {
      const updatedValueSets = templateInstanceVsacField.valueSets;
      const indexOfVSToRemove = updatedValueSets.findIndex(
        vs => vs.name === valueSetToDelete.name && vs.oid === valueSetToDelete.oid
      );
      updatedValueSets.splice(indexOfVSToRemove, 1);
      const arrayToUpdate = [{ [templateInstanceVsacField.id]: updatedValueSets, attributeToEdit: 'valueSets' }];
      this.props.updateInstance(arrayToUpdate);
    }
  };

  handleQualifierChange = selectedQualifier => {
    this.props.updateAppliedModifier(this.props.index, { value: selectedQualifier ? selectedQualifier.value : null });
  };

  render() {
    const { vsacField, valueSet, index } = this.props;

    return (
      <div className="element-field vs-info">
        <div className="element-field-label">Value Set{vsacField.valueSets.length > 1 ? ` ${index + 1}` : ''}:</div>

        <div className="element-field-details vs-info__info">
          <div className="element-field-display vs-info__text">{` ${valueSet.name} (${valueSet.oid})`}</div>

          <div className="element-field-buttons">
            {this.viewValueSetDetails()}

            <IconButton
              aria-label={`delete value set ${valueSet.name}`}
              color="primary"
              onClick={() => this.deleteValueSet(valueSet)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}

ValueSetTemplate.propTypes = {
  index: PropTypes.number.isRequired,
  templateInstance: PropTypes.object.isRequired,
  updateInstance: PropTypes.func.isRequired,
  valueSet: PropTypes.object.isRequired,
  vsacField: PropTypes.object.isRequired
};
