import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const CodeDetailsTable = ({ codeData }) => {
  return (
    <TableContainer>
      <Table aria-label="code details table">
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Code System</TableCell>
            <TableCell>Display</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell>{codeData.code}</TableCell>
            <TableCell>{codeData.systemName}</TableCell>
            <TableCell>{codeData.display}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

CodeDetailsTable.propTypes = {
  codeData: PropTypes.shape({
    code: PropTypes.string.isRequired,
    systemName: PropTypes.string.isRequired,
    display: PropTypes.string.isRequired
  })
};

export default CodeDetailsTable;
