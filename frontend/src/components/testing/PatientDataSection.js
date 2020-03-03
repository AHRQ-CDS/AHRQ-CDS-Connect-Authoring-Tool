import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Collapse, Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

export default class PatientDataSection extends Component {
  constructor(props) {
    super(props);

    this.state = { collapse: false };
  }

  toggle = (event) => {
    event.preventDefault();

    this.setState({ collapse: !this.state.collapse });
  }

  renderHeader = (title, data) => {
    const chevronIcon = this.state.collapse ? 'chevron-down' : 'chevron-right';

    return (
      <div
        className="patient-data-section__header"
        onClick={event => this.toggle(event)}
        onKeyPress={event => this.toggle(event)}
        role="button"
        tabIndex={0}>
        <div className="header-title">{title} ({data.length})</div>
        <div className="header-divider"></div>
        <Button onClick={this.toggle} className="header-button" aria-label="Expand or Collapse">
          <FontAwesome name={chevronIcon} />
        </Button>
      </div>
    );
  }

  renderTable = (type, data) => {
    const isOther = this.props.title === 'Other';

    return (
      <Table className="patient-data-section__table">
        <thead>
          {isOther && data.length > 0 && <tr><th>Resource type</th></tr>}
          {!isOther && <tr>{Object.keys(data[0]).map((key, index) => <th key={index}>{key}</th>)}</tr>}
        </thead>

        <tbody>
          {isOther && data.map((resource, index) => <tr key={index}>
            <td>{resource.resource} ({resource.count})
          </td></tr>)}
          {!isOther && data.map((element, index) =>
            <tr key={index}>
              {Object.keys(data[0]).map((key, indx) => <td key={indx}>{element[key]}</td>)}
            </tr>)
          }
        </tbody>
      </Table>
    );
  }

  render() {
    const { title, data } = this.props;
    if (data.length === 0) return null;

    return (
      <div className="patient-data-section">
        {this.renderHeader(title, data)}

        <Collapse isOpen={this.state.collapse}>
          {data && this.renderTable(title, data)}
        </Collapse>
      </div>
    );
  }
}

PatientDataSection.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array
};
