import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@material-ui/core';

import ArtifactTableRow from './ArtifactTableRow';
import { sortByName, sortByVersion, sortByDateEdited, sortByDateCreated } from 'utils/artifactSort';
import artifactProps from 'prop-types/artifact';

const ArtifactTable = ({ artifacts, handleDeleteArtifact, handleUpdateArtifact }) => {
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(2);
  const [sortAsc, setSortAsc] = useState(true);

  const columns = [
    { columnName: 'Artifact Name', columnSortHandler: sortByName },
    { columnName: 'Version', columnSortHandler: sortByVersion },
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
                  direction={selectedColumnIndex !== index || sortAsc ? 'asc' : 'desc'}
                  active={selectedColumnIndex === index}
                  onClick={() => handleRequestSort(index)}
                  style={{ whiteSpace: 'nowrap' }}
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
