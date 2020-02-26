import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Table, Collapse, Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

export default class ExternalCqlDetailsSection extends Component {
  constructor(props) {
    super(props);

    this.state = { expand: true };
  }

  toggle = (event) => {
    event.preventDefault();

    this.setState({ expand: !this.state.expand });
  }

  renderHeader = (title, definitions) => {
    const chevronIcon = this.state.expand ? 'chevron-down' : 'chevron-right';

    return (
      <div
        className="external-cql-details-section__header"
        onClick={event => this.toggle(event)}
        onKeyPress={event => this.toggle(event)}
        role="button"
        tabIndex={0}>
        <div className="header-title">{title} ({definitions.length})</div>
        <div className="header-divider"></div>
        <Button onClick={this.toggle} className="header-button" aria-label="Expand or Collapse">
          <FontAwesome name={chevronIcon} />
        </Button>
      </div>
    );
  }

  renderTable = (type, definitions) => (
      <Table className="external-cql-details-section__table">
        <thead>
          <tr>
            <th scope="col" className="details-table__tablecell">Name</th>
            <th scope="col" className="details-table__tablecell">Return Type</th>
          </tr>
        </thead>

        <tbody>
          {definitions.map((definition, i) =>
            <tr key={i}>
              <td className="details-table__tablecell" data-th="Name">
                <div>{definition.name}</div>
              </td>

              <td className="details-table__tablecell" data-th="Return Type">
                <div>
                  {definition.displayReturnType
                    ? definition.displayReturnType
                    : _.startCase(definition.calculatedReturnType)}
                </div>
              </td>
            </tr>)}
        </tbody>
      </Table>
  )

  render() {
    const { title, definitions } = this.props;
    if (definitions.length === 0) return null;

    return (
      <div className="external-cql-details-section">
        {this.renderHeader(title, definitions)}

        <Collapse isOpen={this.state.expand}>
          {definitions && this.renderTable(title, definitions)}
        </Collapse>
      </div>
    );
  }
}

ExternalCqlDetailsSection.propTypes = {
  title: PropTypes.string.isRequired,
  definitions: PropTypes.array
};
