import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { Visibility as VisibilityIcon } from '@material-ui/icons';
import {
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import searchVSACByKeyword from 'queries/searchVSACByKeyword';
import { useInteractiveStyles, useTextStyles } from 'styles/hooks';

const ValueSetSearchResultsTable = ({ keyword, setSearchCount, setSelectedValueSet, handleSaveValueSetSelection }) => {
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

  const handleViewValueSetDetails = (event, valueSet) => {
    event.stopPropagation();
    setSelectedValueSet({ name: valueSet.name, oid: valueSet.oid });
  };

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
                  onClick={() => handleSaveValueSetSelection({ name: valueSet.name, oid: valueSet.oid })}
                >
                  <TableCell>
                    <div>{valueSet.name}</div>
                    <div className={textStyles.subtext}>{valueSet.oid}</div>
                  </TableCell>
                  <TableCell>{valueSet.steward}</TableCell>
                  <TableCell>
                    <div className={textStyles.noWrap}>
                      {valueSet.codeCount}
                      <IconButton
                        aria-label="View Value Set"
                        color="primary"
                        onClick={event => handleViewValueSetDetails(event, { name: valueSet.name, oid: valueSet.oid })}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
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
  setSelectedValueSet: PropTypes.func.isRequired,
  handleSaveValueSetSelection: PropTypes.func.isRequired
};

export default memo(ValueSetSearchResultsTable);
