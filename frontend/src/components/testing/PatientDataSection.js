import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { Table } from 'reactstrap';

export default class PatientDataSection extends Component {
  renderTable = (type, data) => {
    const isOther = this.props.title === 'Other';

    return (
      <Table className="patient-data-section__table">
        <thead>
          {isOther && data.length > 0 && <tr><th>Resource type</th></tr>}
          {!isOther && <tr>{Object.keys(data[0]).map((key, index) => <th key={index}>{key}</th>)}</tr>}
        </thead>

        <tbody>
          {isOther && data.map((resource, index) => (
            <tr key={index}>
              <td>{resource.resource} ({resource.count})</td>
            </tr>
          ))}

          {!isOther && data.map((element, index) => (
            <tr key={index}>
              {Object.keys(data[0]).map((key, index) => <td key={index}>{element[key]}</td>)}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  render() {
    const { title, data } = this.props;
    if (data.length === 0) return null;

    return (
      <div className="patient-data-section">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="patient-data-section-content"
            id="patient-data-section-header"
          >
            <div className="patient-data-section__header">
              <div className="header-title">{title} ({ data.length })</div>
              <div className="header-divider"></div>
            </div>
          </AccordionSummary>

          <AccordionDetails>
            {data && this.renderTable(title, data)}
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }
}

PatientDataSection.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array
};
