import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@material-ui/core';

import ArtifactTableRow from './ArtifactTableRow';
import { sortByName, sortByVersion, sortByDateEdited, sortByDateCreated } from 'utils/sort';
import artifactProps from 'prop-types/artifact';
import { useTextStyles } from 'styles/hooks';

const ArtifactTable = ({ artifacts, handleDeleteArtifact, handleDuplicateArtifact, handleUpdateArtifact }) => {
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(3);
  const [sortAsc, setSortAsc] = useState(true);
  const textStyles = useTextStyles();

  const columns = [
    { columnName: 'Artifact Name', columnSortHandler: sortByName },
    { columnName: 'Version', columnSortHandler: sortByVersion },
    { columnName: 'FHIR Version', columnSortHandler: sortByVersion },
    { columnName: 'Last Changed', columnSortHandler: sortByDateEdited },
    { columnName: 'Date Created', columnSortHandler: sortByDateCreated }
  ];

  const handleRequestSort = columnIndex => {
    setSelectedColumnIndex(columnIndex);
    setSortAsc(columnIndex === selectedColumnIndex ? !sortAsc : true);
  };

  const getActiveSort = () => {
    const activeSort = columns[selectedColumnIndex].columnSortHandler;
    return (a, b) => (sortAsc ? 1 : -1) * activeSort(a, b);
  };

  return (
    <TableContainer>
      <Table aria-label="artifact table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index}>
                <TableSortLabel
                  id={index}
                  className={textStyles.noWrap}
                  direction={selectedColumnIndex !== index || sortAsc ? 'asc' : 'desc'}
                  active={selectedColumnIndex === index}
                  onClick={() => handleRequestSort(index)}
                >
                  {column.columnName}
                </TableSortLabel>
              </TableCell>
            ))}

            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {artifacts.sort(getActiveSort()).map(artifact => (
            <TableRow key={artifact._id}>
              <ArtifactTableRow
                artifact={artifact}
                handleDeleteArtifact={handleDeleteArtifact}
                handleDuplicateArtifact={handleDuplicateArtifact}
                handleUpdateArtifact={handleUpdateArtifact}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ArtifactTable.propTypes = {
  artifacts: PropTypes.arrayOf(artifactProps).isRequired,
  handleDeleteArtifact: PropTypes.func.isRequired,
  handleUpdateArtifact: PropTypes.func.isRequired
};

export default ArtifactTable;
