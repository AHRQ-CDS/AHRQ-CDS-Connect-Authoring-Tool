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
    const isOther = this.props.title === 'Other';

    return (
      <Table className="patient-data-section__table">
        <thead>
          {isOther && data.length > 0 && <tr><th>Resource type</th></tr>}
          {!isOther && <tr>{Object.keys(data[0]).map((key, index) => <th key={index}>{key}</th>)}</tr>}
        </thead>

        <tbody>
          {isOther && data.map((resource, index) => <tr key={index}><td>{resource}</td></tr>)}
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
