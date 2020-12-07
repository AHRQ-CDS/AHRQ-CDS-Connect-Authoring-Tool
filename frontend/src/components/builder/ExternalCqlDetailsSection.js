import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { Table } from 'reactstrap';
import _ from 'lodash';

export default class ExternalCqlDetailsSection extends Component {
  renderTable = (type, definitions) => (
    <Table className="external-cql-details-section__table">
      <thead>
        <tr>
          <th scope="col" className="details-table__tablecell">Name</th>
          {type === 'Functions' && <th scope="col" className="details-table__tablecell">Arguments</th>}
          <th scope="col" className="details-table__tablecell">Return Type</th>
        </tr>
      </thead>

      <tbody>
        {definitions.map((definition, i) =>
          <tr key={i}>
            <td className="details-table__tablecell" data-th="Name">
              <div>{definition.name}</div>
            </td>

            {type === 'Functions' && <td className="details-table__tablecell" data-th="Arguments">
              <div>{definition.operand.map(op => op.name).join(' | ')}</div>
            </td>}

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
  );

  render() {
    const { title, definitions } = this.props;
    if (definitions.length === 0) return null;

    return (
      <div className="external-cql-details-section">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="external-cql-details-content"
            id="external-cql-details-header"
          >
            <div className="external-cql-details-section__header">
              <div className="header-title">{title} ({ definitions.length })</div>
              <div className="header-divider"></div>
            </div>
          </AccordionSummary>

          <AccordionDetails>
            {definitions && this.renderTable(title, definitions)}
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }
}

ExternalCqlDetailsSection.propTypes = {
  title: PropTypes.string.isRequired,
  definitions: PropTypes.array
};
