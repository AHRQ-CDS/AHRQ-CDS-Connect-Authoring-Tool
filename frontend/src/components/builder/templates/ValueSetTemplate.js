import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';
import _ from 'lodash';

import ElementModal from '../ElementModal';
import { getFieldWithType } from '../../../utils/instances';

export default class ValueSetTemplate extends Component {
  viewValueSetDetails = (valueSet) => {
    if (!this.props.vsacFHIRCredentials.password) {
      return (
        <span className='element-select__modal element-modal disabled'>
          <span>
            <span id={`LoginTooltip-${this.props.templateInstance.uniqueId}`}>
              <FontAwesome name="eye"/>
            </span>

            <UncontrolledTooltip target={`LoginTooltip-${this.props.templateInstance.uniqueId}`} placement="left">
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
        template={this.props.templateInstance}
        getVSDetails={this.props.getVSDetails}
        isRetrievingDetails={this.props.isRetrievingDetails}
        vsacDetailsCodes={this.props.vsacDetailsCodes}
        vsacDetailsCodesError={this.props.vsacDetailsCodesError}
        selectedElement={this.props.valueSet}
        useIconButton={true}
        iconForButton="eye"
        viewOnly={true}
        vsacFHIRCredentials={this.props.vsacFHIRCredentials}
      />
    );
  }

  deleteValueSet = (valueSetToDelete) => {
    const templateInstanceClone = _.cloneDeep(this.props.templateInstance);
    const templateInstanceVsacField = getFieldWithType(templateInstanceClone.fields, '_vsac');
    if (templateInstanceVsacField && templateInstanceVsacField.valueSets) {
      const updatedValueSets = templateInstanceVsacField.valueSets;
      const indexOfVSToRemove = updatedValueSets.findIndex(vs =>
        (vs.name === valueSetToDelete.name && vs.oid === valueSetToDelete.oid));
      updatedValueSets.splice(indexOfVSToRemove, 1);
      const arrayToUpdate = [
        { [templateInstanceVsacField.id]: updatedValueSets, attributeToEdit: 'valueSets' }
      ];
      this.props.updateInstance(arrayToUpdate);
    }
  }

  handleQualifierChange = (selectedQualifier) => {
    this.props.updateAppliedModifier(this.props.index, { value: selectedQualifier ? selectedQualifier.value : null });
  }

  render() {
    const { vsacField, valueSet, index } = this.props;

    return (
      <div className="vs-info">
        <div className="bold align-right vs-info__label">
          Value Set{vsacField.valueSets.length > 1 ? ` ${index + 1}` : ''}:
        </div>

        <div className="vs-info__info">
          <div className="vs-info__text">
            {` ${valueSet.name} (${valueSet.oid})`}
          </div>

          <div className="align-right vs-info__buttons">
            {this.viewValueSetDetails(valueSet)}

            <span
              role="button"
              id="delete-valueset"
              tabIndex="0"
              onClick={() => this.deleteValueSet(valueSet)}
              onKeyPress={(e) => {
                e.which = e.which || e.keyCode;
                if (e.which === 13) this.deleteValueSet(valueSet);
              }}>
              <FontAwesome name="close" className="delete-valueset-button" />
            </span>
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
  vsacSearchResults: PropTypes.array.isRequired,
};
