import { React, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel} from '@material-ui/core';

import ArtifactTableRow from './ArtifactTableRow';
import { sortByName, sortByVersion, sortByDateEdited, sortByDateCreated } from 'utils/artifactSort';
import artifactProps from 'prop-types/artifact';


const ArtifactTable = ({ artifacts, handleDeleteArtifact, handleUpdateArtifact }) => {

  const [ selectedColumn, setSelectedColumn ] = useState(0);
  const [ columnOrder, setColumnOrder ] = useState("asc");

  const createColumn = (columnName, columnSortHandler) => {
    return { columnName : columnName, columnSortHandler : columnSortHandler};
  };

  const columns = [];
  columns.push(createColumn("Artifact Name", sortByName));
  columns.push(createColumn("Version", sortByVersion));
  columns.push(createColumn("Last Changed", sortByDateEdited));
  columns.push(createColumn("Date Created", sortByDateCreated));

  const handleLabelClick = ( id ) => {
    console.log("Selected Column:", id);

    if (parseInt(id) === selectedColumn) {
      setColumnOrder(columnOrder === "asc" ? "desc" : "asc");
    } else {
        setSelectedColumn(parseInt(id));
        setColumnOrder("asc");
    }
  };

  const isActiveColumn = ( columnIndex ) => (selectedColumn === columnIndex ? true : false);

  const getActiveSort = () => {
    const activeSort = columns[selectedColumn].columnSortHandler;
    return (a, b) => {
        return (columnOrder === "asc" ? 1 : -1) * activeSort(a,b);
    };
  };



  return (
    <TableContainer>
      <Table aria-label="artifact table">
        <TableHead>
          <TableRow>

            {
              columns.map((column, index) => {
                return (
                  <TableCell key={index} padding="none">
                  <TableSortLabel 
                    id={index}
                    direction={isActiveColumn(index) ? columnOrder : "asc"}
                    active={isActiveColumn(index)}
                    onClick={() => handleLabelClick(index)}>
                      {column.columnName}
                  </TableSortLabel>
                </TableCell>
                );
              })
            }

            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {artifacts.map((art) => console.log(art))}
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
