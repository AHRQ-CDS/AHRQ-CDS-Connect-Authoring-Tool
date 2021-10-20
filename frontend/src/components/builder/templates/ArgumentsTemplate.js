import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { Box, Divider, Stack } from '@mui/material';
import { Block as BlockIcon } from '@mui/icons-material';

import EditorsTemplate from './EditorsTemplate';
import ElementCardLabel from 'components/elements/ElementCard/ElementCardLabel';
import { Dropdown } from 'components/elements';
import { isSupportedEditorType } from 'components/builder/editors/utils';
import { getBaseElementById, getBaseElementName, getBaseElementsByType } from 'components/builder/base-elements/utils';
import { getParameterById, getParametersByType } from 'components/builder/parameters/utils';
import { getExternalCqlByType } from 'components/builder/external-cql/utils';
import { fetchExternalCqlList } from 'queries/external-cql';
import { changeToCase } from 'utils/strings';

const ArgumentTemplate = ({ argumentLabel, argumentType, argumentValue, handleUpdateArgument, isNested }) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { baseElements, parameters } = artifact;
  const query = { artifactId: artifact._id };
  const { data: externalCqlList } = useQuery(['externalCql', query], () => fetchExternalCqlList(query), {
    enabled: artifact._id != null
  });

  const sourceOptions = [
    {
      value: 'baseElement',
      label: 'Base Element',
      isDisabled: getBaseElementsByType(baseElements, argumentType).length === 0
    },
    { value: 'editor', label: 'Editor', isDisabled: !isSupportedEditorType(argumentType) },
    {
      value: 'externalCql',
      label: 'External CQL',
      isDisabled: getExternalCqlByType(externalCqlList, argumentType).length === 0
    },
    { value: 'parameter', label: 'Parameter', isDisabled: getParametersByType(parameters, argumentType).length === 0 }
  ];

  const matchingParameters = getParametersByType(parameters, argumentType).map(parameter => ({
    value: parameter.uniqueId,
    label: parameter.name
  }));

  const matchingBaseElements = getBaseElementsByType(baseElements, argumentType).map(baseElement => ({
    value: baseElement.uniqueId,
    label: getBaseElementName(baseElement)
  }));

  const matchingExternalCQL = getExternalCqlByType(externalCqlList, argumentType).map(externalCQLElement => ({
    value: `"${externalCQLElement.libraryName}"."${externalCQLElement.elementName}"`,
    label: `${externalCQLElement.elementName} | ${
      externalCQLElement.type === 'function' ? 'function(0) | ' : ''
    } ${argumentType}`,
    type: externalCQLElement.type,
    library: externalCQLElement.libraryName,
    element: externalCQLElement.elementName
  }));

  const getLibraryOptions = matchingExternalCQL => {
    const uniqueLibraryNames = [...new Set(matchingExternalCQL.map(elem => elem.library))];
    return uniqueLibraryNames.map(name => ({ value: `${name}`, label: name }));
  };

  const handleSelectArgument = argSource => {
    // if base element source is selected and there is exactly one base element, select it
    if (argSource === 'baseElement' && matchingBaseElements.length === 1)
      handleUpdateArgument({
        argSource,
        selected: matchingBaseElements[0].value,
        elementName: matchingBaseElements[0].label
      });
    // else if externalCql source is selected and there is exactly one library, select it
    else if (argSource === 'externalCql' && getLibraryOptions(matchingExternalCQL).length === 1)
      handleUpdateArgument({
        argSource,
        selected: getLibraryOptions(matchingExternalCQL)[0].value
      });
    // else if parameter source is selected and there is exactly one parameter, select it
    else if (argSource === 'parameter' && matchingParameters.length === 1)
      handleUpdateArgument({
        argSource,
        selected: matchingParameters[0].value,
        elementName: matchingParameters[0].label
      });
    // else select the source
    else handleUpdateArgument({ argSource, type: argumentType });
  };

  return (
    <Stack direction="row">
      <ElementCardLabel label={argumentLabel} mt="15px" />

      <Stack width="100%">
        <Dropdown
          Footer={
            sourceOptions.some(sourceOption => sourceOption.isDisabled) && (
              <>
                <BlockIcon fontSize="small" sx={{ marginRight: '5px' }} />
                No available elements
              </>
            )
          }
          label="Argument Source"
          onChange={event => handleSelectArgument(event.target.value)}
          options={sourceOptions}
          renderItem={option => (
            <>
              {option.label}
              {option.isDisabled && <BlockIcon fontSize="small" />}
            </>
          )}
          sx={{ width: { xs: '200px', xxl: '300px' } }}
          value={argumentValue?.argSource || ''}
        />
        {argumentValue?.argSource === 'editor' && (
          <EditorsTemplate
            handleUpdateEditor={newSelection => handleUpdateArgument({ ...argumentValue, selected: newSelection })}
            type={argumentType}
            value={argumentValue?.selected}
          />
        )}
        {(argumentValue?.argSource === 'baseElement' || argumentValue?.argSource === 'parameter') && (
          <Dropdown
            label={argumentValue.argSource === 'baseElement' ? 'Base Element' : 'Parameter'}
            onChange={event => {
              handleUpdateArgument({
                ...argumentValue,
                selected: event.target.value,
                elementName:
                  argumentValue.argSource === 'baseElement'
                    ? getBaseElementName(getBaseElementById(baseElements, event.target.value))
                    : getParameterById(parameters, event.target.value).name
              });
            }}
            options={argumentValue.argSource === 'baseElement' ? matchingBaseElements : matchingParameters}
            sx={{ width: { xs: '400px', xxl: '600px' } }}
            value={argumentValue?.selected || ''}
          />
        )}
        {argumentValue?.argSource === 'externalCql' && (
          <Dropdown
            label="External CQL Library"
            onChange={event => {
              handleUpdateArgument({
                ...argumentValue,
                selected: event.target.value
              });
            }}
            options={getLibraryOptions(matchingExternalCQL)}
            sx={{ width: { xs: '400px', xxl: '600px' } }}
            value={argumentValue?.selected || ''}
          />
        )}
        {argumentValue?.argSource === 'externalCql' && argumentValue?.selected && argumentValue?.selected !== '' && (
          <Dropdown
            label="Definition, function, or parameter"
            onChange={event => {
              handleUpdateArgument({
                ...argumentValue,
                elementName: event.target.value,
                elementType: matchingExternalCQL.find(elem => elem.value === event.target.value).type
              });
            }}
            options={matchingExternalCQL.filter(elem => elem.library === argumentValue.selected)}
            sx={{ width: { xs: '400px', xxl: '600px' } }}
            value={argumentValue?.elementName || ''}
          />
        )}

        <Box color="common.grayLight" fontSize="0.7em" textAlign="right">
          Argument Type: {changeToCase(argumentType, 'capitalCase')}
        </Box>

        <Divider sx={{ marginBottom: '10px' }} />
      </Stack>
    </Stack>
  );
};

ArgumentTemplate.propTypes = {
  argumentLabel: PropTypes.string.isRequired,
  argumentType: PropTypes.string.isRequired,
  argumentValue: PropTypes.object,
  handleUpdateArgument: PropTypes.func.isRequired,
  isNested: PropTypes.bool
};

export default ArgumentTemplate;
