import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import { UncontrolledTooltip } from 'reactstrap';


import ElementModal from '../ElementModal';

export default class ValueSetTemplate extends Component {
  viewValueSetDetails = (valueSet) => {
    if (!this.props.vsacFHIRCredentials.password) {
      return (
        <span className='element-select__modal element-modal disabled'>
          <span>
          <span
              id="LoginTooltip">
              <FontAwesome name="eye"/>
            </span>
            <UncontrolledTooltip target="LoginTooltip" placement="left">
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
        selectedElement={this.props.valueSet}
        useIconButton={true}
        iconForButton={'eye'}
        viewOnly={true}
        vsacFHIRCredentials={this.props.vsacFHIRCredentials}
      />
    );
  }

  deleteValueSet = (valueSetToDelete) => {
    const templateInstanceClone = _.cloneDeep(this.props.templateInstance);
    if (templateInstanceClone.parameters[1] && templateInstanceClone.parameters[1].valueSets) {
      const updatedValueSets = templateInstanceClone.parameters[1].valueSets;
      const indexOfVSToRemove = updatedValueSets.findIndex(vs =>
        (vs.name === valueSetToDelete.name && vs.oid === valueSetToDelete.oid));
      updatedValueSets.splice(indexOfVSToRemove, 1);
      const arrayToUpdate = [
        { [templateInstanceClone.parameters[1].id]: updatedValueSets, attributeToEdit: 'valueSets' }
      ];
      this.props.updateInstance(arrayToUpdate);
    }
  }

  handleQualifierChange = (selectedQualifier) => {
    this.props.updateAppliedModifier(this.props.index, { value: selectedQualifier ? selectedQualifier.value : null });
  }

  render() {
    const { vsacParameter, valueSet, index } = this.props;

    return (
      <div className="row vs-info">
        <div className="col-3 bold align-right vs-info__label">
          Value Set{vsacParameter.valueSets.length > 1 ? ` ${index + 1}` : ''}:
        </div>

        <div className="col-9 row vs-info__info">
          <div className="col-10">
            {` ${valueSet.name} (${valueSet.oid})`}
          </div>

          <div className="col-2 align-right vs-info__buttons">
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
  index: PropTypes.number.isRequired,
  vsacParameter: PropTypes.object.isRequired,
  valueSet: PropTypes.object.isRequired,
  updateInstance: PropTypes.func.isRequired,
  searchVSACByKeyword: PropTypes.func.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  vsacSearchResults: PropTypes.array.isRequired,
  vsacSearchCount: PropTypes.number.isRequired,
  templateInstance: PropTypes.object.isRequired,
  getVSDetails: PropTypes.func.isRequired,
  isRetrievingDetails: PropTypes.bool.isRequired,
  vsacDetailsCodes: PropTypes.array.isRequired
};
