import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import {
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

import fetchValueSetDetails from 'queries/fetchValueSetDetails';
import { useTextStyles } from 'styles/hooks';

const ValueSetDetailsTable = ({ valueSetOid }) => {
  const textStyles = useTextStyles();
  const apiKey = useSelector(state => state.vsac.apiKey);

  const query = { oid: valueSetOid, apiKey };
  const { isLoading, isSuccess, data, error } = useQuery(
    ['valueSetDetails', query],
    () => fetchValueSetDetails(query),
    { retry: false }
  );

  return (
    <>
      {error && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}

      {isSuccess && (
        <TableContainer>
          <Table aria-label="value set details table">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell className={textStyles.noWrap}>Code System</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.map(code => (
                <TableRow key={code.code}>
                  <TableCell>{code.code}</TableCell>
                  <TableCell>{code.displayName}</TableCell>
                  <TableCell>{code.codeSystemName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

ValueSetDetailsTable.propTypes = {
  valueSetOid: PropTypes.string.isRequired
};

export default memo(ValueSetDetailsTable);
