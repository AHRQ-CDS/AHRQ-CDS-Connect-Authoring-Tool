import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

import ArtifactTableRow from './ArtifactTableRow';
import { sortMostRecent } from 'utils/sort';
import artifactProps from 'prop-types/artifact';

const ArtifactTable = ({ artifacts, handleDeleteArtifact, handleUpdateArtifact }) => (
  <TableContainer>
    <Table aria-label="artifact table">
      <TableHead>
        <TableRow>
          <TableCell>Artifact Name</TableCell>
          <TableCell>Version</TableCell>
          <TableCell>Last Updated</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {artifacts.sort(sortMostRecent).map(artifact => (
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

ArtifactTable.propTypes = {
  artifacts: PropTypes.arrayOf(artifactProps).isRequired,
  handleDeleteArtifact: PropTypes.func.isRequired,
  handleUpdateArtifact: PropTypes.func.isRequired
};

export default ArtifactTable;
