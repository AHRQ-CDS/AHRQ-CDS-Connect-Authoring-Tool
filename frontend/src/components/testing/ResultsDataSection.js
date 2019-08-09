import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Collapse, Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

export default class ResultsDataSection extends Component {
  constructor(props) {
    super(props);

    this.state = { expand: false };
  }

  toggle = (event) => {
    event.preventDefault();

    this.setState({ expand: !this.state.expand });
  }

  renderBoolean = (bool) => {
    if (bool) return <FontAwesome name="check" className="boolean-check" />;
    return <FontAwesome name="close" className="boolean-x" />;
  }

  renderHeader = (title) => {
    const chevronIcon = this.state.expand ? 'chevron-down' : 'chevron-right';

    return (
      <div
        className="patient-data-section__header"
        onClick={event => this.toggle(event)}
        onKeyPress={event => this.toggle(event)}
        role="button"
        tabIndex={0}>
        <div className="header-title">{title}</div>
        <Button onClick={this.toggle} className="header-button"><FontAwesome name={chevronIcon} /></Button>
      </div>
    );
  }

  renderTable = results => (
      <Table className="patient-data-section__table">
        <tbody>
          <tr>
            <td>
              MeetsInclusionCriteria
            </td>
            <td data-th="MeetsInclusionCriteria">
              {results.MeetsInclusionCriteria != null
                ? this.renderBoolean(results.MeetsInclusionCriteria)
                : 'No Value'}
            </td>
          </tr>
          <tr>
            <td>
              MeetsExclusionCriteria
            </td>
            <td data-th="MeetsExclusionCriteria">
              {results.MeetsExclusionCriteria != null
                ? this.renderBoolean(results.MeetsExclusionCriteria)
                : 'No Value'}
            </td>
          </tr>
          <tr>
            <td>
              Recommendation
            </td>
            <td>
              {results.Recommendation != null
                ? results.Recommendation.toString()
                : 'No Value'}
            </td>
          </tr>
          <tr>
            <td>
              Rationale
            </td>
            <td>
              {results.Rationale != null
                ? results.Rationale.toString()
                : 'No Value'}
            </td>
          </tr>
          <tr>
            <td>
              Errors
            </td>
            <td>
              {results.Errors != null
                ? results.Errors.toString()
                : 'No Value'}
            </td>
          </tr>
        </tbody>
      </Table>
  )

  render() {
    const { title, results } = this.props;
    if (results.length === 0) return null;

    return (
      <div className="patient-data-section">
        {this.renderHeader(title, results)}

        <Collapse isOpen={this.state.expand}>
          {results && this.renderTable(results)}
        </Collapse>
      </div>
    );
  }
}

ResultsDataSection.propTypes = {
  title: PropTypes.string.isRequired,
  results: PropTypes.object.isRequired
};
