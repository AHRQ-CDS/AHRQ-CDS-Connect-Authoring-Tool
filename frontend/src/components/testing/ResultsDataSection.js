import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

export default class ResultsDataSection extends Component {
  renderBoolean = (bool) => {
    if (bool) return <FontAwesomeIcon icon={faCheck} className="boolean-check" />;
    return <FontAwesomeIcon icon={faTimes} className="boolean-x" />;
  }

  renderTable = results => (
    <Table className="patient-data-section__table">
      <tbody>
        <tr>
          <td>MeetsInclusionCriteria</td>
          <td data-th="MeetsInclusionCriteria">
            {results.MeetsInclusionCriteria != null
              ? this.renderBoolean(results.MeetsInclusionCriteria)
              : 'No Value'
            }
          </td>
        </tr>

        <tr>
          <td>MeetsExclusionCriteria</td>
          <td data-th="MeetsExclusionCriteria">
            {results.MeetsExclusionCriteria != null
              ? this.renderBoolean(results.MeetsExclusionCriteria)
              : 'No Value'
            }
          </td>
        </tr>

        <tr>
          <td>Recommendation</td>
          <td>
            {results.Recommendation != null
              ? results.Recommendation.toString()
              : 'No Value'
            }
          </td>
        </tr>

        <tr>
          <td>Rationale</td>
          <td>
            {results.Rationale != null
              ? results.Rationale.toString()
              : 'No Value'
            }
          </td>
        </tr>

        <tr>
          <td>Errors</td>
          <td>
            {results.Errors != null
              ? results.Errors.toString()
              : 'No Value'
            }
          </td>
        </tr>
      </tbody>
    </Table>
  );

  render() {
    const { title, results } = this.props;
    if (results.length === 0) return null;

    return (
      <div className="patient-data-section">
        <Accordion defaultExpanded className="results-data-section">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="results-data-section-content"
            id="results-data-section-header"
          >
            <div className="results-data-section__header">
              <div className="header-title">{title}</div>
              <div className="header-divider"></div>
            </div>
          </AccordionSummary>

          <AccordionDetails>
            {results && this.renderTable(results)}
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }
}

ResultsDataSection.propTypes = {
  title: PropTypes.string.isRequired,
  results: PropTypes.object.isRequired
};
