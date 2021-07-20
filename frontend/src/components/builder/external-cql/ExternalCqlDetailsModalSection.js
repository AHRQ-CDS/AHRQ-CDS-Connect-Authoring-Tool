import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

import { changeToCase } from 'utils/strings';

const ExternalCqlDetailsModalSection = ({ definitions, title }) => {
  return (
    <Accordion expanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="external-cql-section-content"
        id="external-cql-section-header"
      >
        <>
          {title} ({definitions.length})
        </>
      </AccordionSummary>

      <AccordionDetails>
        {definitions && (
          <TableContainer>
            <Table aria-label="external cql details table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  {title === 'Functions' && <TableCell>Arguments</TableCell>}
                  <TableCell>Return Type</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {definitions.map((definition, index) => (
                  <TableRow key={index}>
                    <TableCell>{definition.name}</TableCell>
                    {title === 'Functions' && (
                      <TableCell>{definition.operand.map(op => op.name).join(' | ')}</TableCell>
                    )}
                    <TableCell>
                      {definition.displayReturnType
                        ? definition.displayReturnType
                        : changeToCase(definition.calculatedReturnType, 'capitalCase')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

ExternalCqlDetailsModalSection.propTypes = {
  definitions: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
};

export default ExternalCqlDetailsModalSection;
