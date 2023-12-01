import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, IconButton } from '@mui/material';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import Parameter from './Parameter';
import { Tooltip } from 'components/elements';
import { getAllElements, getElementNames } from 'components/builder/utils';
import { useTabStyles } from 'styles/hooks';

const Parameters = ({ handleUpdateParameters }) => {
  const [showAllContent, setShowAllContent] = useState(true);
  const tabStyles = useTabStyles();
  const artifact = useSelector(state => state.artifacts.artifact);
  const { parameters } = artifact;
  const allElements = getAllElements(artifact) ?? [];
  const elementNames = getElementNames(allElements);

  useEffect(() => {
    if (parameters.length === 0) setShowAllContent(true);
  }, [parameters]);

  const addParameter = () => {
    const newParameter = {
      comment: null,
      name: null,
      type: 'boolean',
      uniqueId: uuidv4(),
      value: null
    };

    const parametersCopy = _.cloneDeep(parameters);
    parametersCopy.push(newParameter);
    handleUpdateParameters(parametersCopy);
  };

  const deleteParameter = index => {
    const parametersCopy = _.cloneDeep(parameters);
    parametersCopy.splice(index, 1);
    handleUpdateParameters(parametersCopy);
  };

  const updateParameter = (newParameter, index) => {
    const parametersCopy = _.cloneDeep(parameters);
    parametersCopy[index] = newParameter;
    handleUpdateParameters(parametersCopy);
  };

  return (
    <>
      {parameters.length > 1 && (
        <div className={tabStyles.tabButtons}>
          <Tooltip title="Expand All">
            <IconButton aria-label="expand all" onClick={() => setShowAllContent(true)} size="large">
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Collapse All">
            <IconButton aria-label="collapse all" onClick={() => setShowAllContent(false)} size="large">
              <ExpandLessIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      )}

      {parameters.map((parameter, index) => (
        <Parameter
          key={parameter.uniqueId}
          allElements={allElements}
          elementNames={elementNames}
          handleDeleteParameter={() => deleteParameter(index)}
          handleUpdateParameter={newParameter => updateParameter(newParameter, index)}
          parameter={parameter}
          setShowAllContent={setShowAllContent}
          showAllContent={showAllContent}
        />
      ))}

      <Button color="primary" onClick={addParameter} variant="contained">
        New parameter
      </Button>
    </>
  );
};

Parameters.propTypes = {
  handleUpdateParameters: PropTypes.func.isRequired
};

export default Parameters;
