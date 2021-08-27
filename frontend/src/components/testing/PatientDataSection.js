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
import clsx from 'clsx';

import { useTextStyles } from 'styles/hooks';

const PatientDataSection = ({ data, title }) => {
  const textStyles = useTextStyles();

  if (data.length === 0) return null;

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="patient-data-section-content"
        id="patient-data-section-header"
      >
        <>
          {title} ({data.length})
        </>
      </AccordionSummary>

      <AccordionDetails>
        {data && (
          <TableContainer>
            <Table aria-label="patient data section table" size="small">
              <TableHead>
                {title === 'Other' && data.length > 0 && (
                  <TableRow>
                    <TableCell className={textStyles.fontSizeSmall}>Resource type</TableCell>
                  </TableRow>
                )}

                {title !== 'Other' && (
                  <TableRow>
                    {Object.keys(data[0]).map((key, index) => (
                      <TableCell key={index} className={clsx(textStyles.noWrap, textStyles.fontSizeSmall)}>
                        {key}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableHead>

              <TableBody>
                {title === 'Other' &&
                  data.map((resource, index) => (
                    <TableRow key={index}>
                      <TableCell className={textStyles.fontSizeSmall}>
                        {resource.resource} ({resource.count})
                      </TableCell>
                    </TableRow>
                  ))}

                {title !== 'Other' &&
                  data.map((element, index) => (
                    <TableRow key={index}>
                      {Object.keys(data[0]).map((key, index) => (
                        <TableCell key={index} className={textStyles.fontSizeSmall}>
                          {element[key]}
                        </TableCell>
                      ))}
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

PatientDataSection.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
};

export default PatientDataSection;
