import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { Close as CloseIcon, Visibility as VisibilityIcon } from '@material-ui/icons';
import { UncontrolledTooltip } from 'reactstrap';
import _ from 'lodash';

import ElementModal from '../ElementModal';
import { getFieldWithType } from 'utils/instances';

export default class ValueSetTemplate extends Component {
  viewValueSetDetails = valueSet => {
    if (!this.props.vsacApiKey) {
      return (
        <span className="element-select__modal element-modal disabled">
          <span id={`LoginTooltip-${this.props.templateInstance.uniqueId}`}>
            <IconButton aria-label="view" disabled color="primary">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </span>

          <UncontrolledTooltip target={`LoginTooltip-${this.props.templateInstance.uniqueId}`} placement="left">
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
        template={this.props.templateInstance}
        getVSDetails={this.props.getVSDetails}
        isRetrievingDetails={this.props.isRetrievingDetails}
        vsacDetailsCodes={this.props.vsacDetailsCodes}
        vsacDetailsCodesError={this.props.vsacDetailsCodesError}
        selectedElement={this.props.valueSet}
        useIconButton={true}
        viewOnly={true}
        vsacApiKey={this.props.vsacApiKey}
      />
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
            {this.viewValueSetDetails(valueSet)}

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
  getVSDetails: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isRetrievingDetails: PropTypes.bool.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  searchVSACByKeyword: PropTypes.func.isRequired,
  templateInstance: PropTypes.object.isRequired,
  updateInstance: PropTypes.func.isRequired,
  valueSet: PropTypes.object.isRequired,
  vsacDetailsCodes: PropTypes.array.isRequired,
  vsacDetailsCodesError: PropTypes.string,
  vsacField: PropTypes.object.isRequired,
  vsacSearchCount: PropTypes.number.isRequired,
  vsacSearchResults: PropTypes.array.isRequired
};
