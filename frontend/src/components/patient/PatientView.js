import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Inspector from 'react-inspector';
import { Table, Collapse } from 'reactstrap';

import getProperty from '../../utils/getProperty';
import patientProps from '../../prop-types/patient';

import PatientDataSection from './PatientDataSection';

const RESOURCE_KEYS = {
  'Patient': {
    'Family name': 'name.firstObject.family.firstObject',
    'Given name': 'name.firstObject.given.firstObject'
  },
  'Organization': {
    'Name': 'name',
    'Type': 'type.coding.firstObject.display',
    'Street address': 'address.firstObject.line.firstObject',
    'City': 'address.firstObject.city',
    'State': 'address.firstObject.state',
    'Zip code': 'address.firstObject.postalCode',
    'Phone': 'telecom.firstObject.value'
  },
  'Encounter': {
    'Type': 'type.firstObject.coding.text',
    'Start date': 'period.start',
    'End date': 'period.end',
    'Status': 'status'
  },
  'Observation': {
    'Category': 'category.text',
    'Type': 'code.text',
    'Value': 'valueQuantity.value',
    'Unit': 'valueQuantity.unit'
  },
  'Immunization': {
    'Vaccine': 'vaccineCode.text',
    'Date': 'date',
    'Status': 'completed'
  },
  'Claim': {
    'Type': 'type',
    'First item': 'item.firstObject.type.display'
  },
  'Procedure': {
    'Procedure': 'code.text',
    'Date': 'code.performedDateTime'
  }
};

export default class PatientView extends Component {
  constructor(props) {
    super(props);

    this.state = { collapse: false };
  }

  extractData = resourceType => {
    const { patient } = this.props;
    const resources = patient.patient.entry.filter(entry => entry.resource.resourceType === resourceType);

    let data = [];
    resources.forEach((resource) => {
      let row = {};
      Object.keys(RESOURCE_KEYS[resourceType]).forEach(key => {
        row[key] = getProperty(resource.resource, RESOURCE_KEYS[resourceType][key]);
      });
      data.push(row);
    });

    return data;
  }

  renderHeader = title => {
    return (
      <div className="patient-view__header">
        <div className="header-title">{title}</div>
        <div className="header-divider"></div>
      </div>
    );
  }

  renderData = (type, data) => {
    const keys = Object.keys(RESOURCE_KEYS[type]);

    return (
      <Table className="section-data-element">
        <thead>
          <tr>
            {keys.map((key, i) => <th key={i}>{key}</th>)}
          </tr>
        </thead>

        <tbody>
          {data.map((element, i) =>
            <tr key={i}>
              {keys.map((key, j) => <td key={j}>{element[key]}</td>)}
            </tr>
          )}
        </tbody>
      </Table>
    );
  }

  renderSection = type => {
    const data = this.extractData(type);

    return (
      <div className="patient-view__section">
        {this.renderHeader(type)}
        {data &&
          <div className="section-data">
            {this.renderData(type, data)}
          </div>
        }
      </div>
    );
  }

  render() {
    const { patient } = this.props;

    return (
      <div className="patient-view">
        <PatientDataSection resource='Patient' />

        {this.renderSection('Patient')}
        {this.renderSection('Organization')}
        {this.renderSection('Encounter')}
        {this.renderSection('Observation')}
        {this.renderSection('Immunization')}
        {this.renderSection('Claim')}
        {this.renderSection('Procedure')}

        <hr/>
        <Inspector data={this.props.patient}/>
      </div>
    );
  }
}

PatientView.propTypes = {
  patient: patientProps
};
