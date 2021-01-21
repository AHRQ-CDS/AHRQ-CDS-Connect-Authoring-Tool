import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import searchVSACByKeyword from 'queries/searchVSACByKeyword';
import { useInteractiveStyles, useTextStyles } from 'styles/hooks';

const ValueSetSearchResultsTable = ({ keyword, setSearchCount, setSelectedValueSet }) => {
  const apiKey = useSelector(state => state.vsac.apiKey);
  const textStyles = useTextStyles();
  const interactiveStyles = useInteractiveStyles();

  const query = { keyword, apiKey };
  const { isLoading, isSuccess, data, error } = useQuery(
    ['searchVSACByKeyword', query],
    () => searchVSACByKeyword(query),
    { enabled: keyword != null }
  );
  const searchResultCount = data?.count;

  useEffect(() => {
    if (searchResultCount != null) setSearchCount(searchResultCount);
  }, [searchResultCount, setSearchCount]);

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      {isLoading && <CircularProgress />}

      {isSuccess && (
        <TableContainer>
          <Table aria-label="value set search results table">
            <TableHead>
              <TableRow>
                <TableCell>Name/OID</TableCell>
                <TableCell>Steward</TableCell>
                <TableCell className={textStyles.noWrap}>Codes</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.results?.map(valueSet => (
                <TableRow
                  className={interactiveStyles.pointer}
                  hover
                  key={valueSet.oid}
                  onClick={() => setSelectedValueSet({ name: valueSet.name, oid: valueSet.oid })}
                >
                  <TableCell>
                    <div>{valueSet.name}</div>
                    <div className={textStyles.subtext}>{valueSet.oid}</div>
                  </TableCell>
                  <TableCell>{valueSet.steward}</TableCell>
                  <TableCell>{valueSet.codeCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

ValueSetSearchResultsTable.propTypes = {
  keyword: PropTypes.string,
  setSearchCount: PropTypes.func.isRequired,
  setSelectedValueSet: PropTypes.func.isRequired
};

export default memo(ValueSetSearchResultsTable);
