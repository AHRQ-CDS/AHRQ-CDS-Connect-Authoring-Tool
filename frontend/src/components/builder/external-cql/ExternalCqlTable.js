import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';

import ExternalCqlTableRow from './ExternalCqlTableRow';
import { loadArtifact, saveArtifact } from 'actions/artifacts';
import { deleteExternalCql } from 'queries/external-cql';
import { sortByName, sortByVersion, sortByDateEdited } from 'utils/sort';
import { useTextStyles } from 'styles/hooks';

const ExternalCqlTable = ({ externalCqlList }) => {
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(3);
  const [sortAsc, setSortAsc] = useState(true);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const textStyles = useTextStyles();
  const artifact = useSelector(state => state.artifacts.artifact);
  const librariesInUse = useSelector(state => state.artifacts.librariesInUse);
  const deleteMutation = useMutation(deleteExternalCql, {
    onSuccess: () => {
      queryClient.invalidateQueries('externalCql');
      queryClient.invalidateQueries('modifiers');
      dispatch(loadArtifact(artifact._id)); // TODO: switch to query once artifact actions are removed from redux
    }
  });
  const handleDeleteLibrary = async library => {
    await dispatch(saveArtifact(artifact)); // TODO: switch to query once artifact actions are removed from redux
    deleteMutation.mutate({ library });
  };

  const columns = [
    { columnName: 'Library', columnSortHandler: sortByName },
    { columnName: 'Version', columnSortHandler: sortByVersion },
    {
      columnName: (
        <>
          FHIR<sup>®</sup>&nbsp;Version
        </>
      ),
      columnSortHandler: sortByVersion
    },
    { columnName: 'Last Updated', columnSortHandler: sortByDateEdited }
  ];

  const handleRequestSort = columnIndex => {
    setSelectedColumnIndex(columnIndex);
    setSortAsc(columnIndex === selectedColumnIndex ? !sortAsc : true);
  };

  const getActiveSort = () => {
    const activeSort = columns[selectedColumnIndex].columnSortHandler;
    return (a, b) => (sortAsc ? 1 : -1) * activeSort(a, b);
  };

  const isADependency = library =>
    externalCqlList.some(externalCqlLibrary =>
      externalCqlLibrary.details.dependencies.some(
        dependency => dependency.path === library.name && dependency.version === library.version
      )
    );

  const disableDeleteMessage = library => {
    if (librariesInUse.includes(library.name)) return 'To delete this library, first remove all references to it.';
    else if (isADependency(library)) return 'To delete this library, first remove all libraries that depend on it.';
    else return null;
  };

  return externalCqlList.length > 0 ? (
    <TableContainer>
      <Table aria-label="external cql table">
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
          {externalCqlList.sort(getActiveSort()).map(library => (
            <TableRow key={library._id}>
              <ExternalCqlTableRow
                disableDeleteMessage={disableDeleteMessage(library)}
                library={library}
                handleDeleteLibrary={handleDeleteLibrary}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <div>No external CQL libraries to show.</div>
  );
};

ExternalCqlTable.propTypes = {
  externalCqlList: PropTypes.array.isRequired
};

export default ExternalCqlTable;
