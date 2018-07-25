import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Collapse, Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

export default class PatientDataSection extends Component {
  constructor(props) {
    super(props);

    this.state = { collapse: false };
  }

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }

  renderHeader = (title) => {
    const chevronIcon = this.state.collapse ? 'chevron-down' : 'chevron-right';

    return (
      <div className="patient-data-section__header">
        <div className="header-title">{title}</div>
        <div className="header-divider"></div>
        <Button onClick={this.toggle} className="header-button"><FontAwesome name={chevronIcon} /></Button>
      </div>
    );
  }

  renderTable = (type, data) => {
    const keys = Object.keys(data[0]);

    return (
      <Table className="patient-data-section__table">
        <thead>
          <tr>
            {keys.map((key, i) => <th key={i}>{key}</th>)}
          </tr>
        </thead>

        <tbody>
          {data.map((element, i) =>
            <tr key={i}>
              {keys.map((key, j) => <td key={j}>{element[key]}</td>)}
            </tr>)
          }
        </tbody>
      </Table>
    );
  }

  render() {
    const { title, data } = this.props;

    return (
      <div className="patient-data-section">
        {this.renderHeader(title)}

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
