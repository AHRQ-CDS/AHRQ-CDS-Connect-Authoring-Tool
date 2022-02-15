import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { Card, CardContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import pluralize from 'pluralize';
import _ from 'lodash';

import ElementSelectActions from './ElementSelectActions';
import ElementSelectDropdown from './ElementSelectDropdown';
import { getElementEntries, generateElement } from './utils';
import { sortAlphabeticallyByKey } from 'utils/sort';
import { changeToCase } from 'utils/strings';
import { fetchExternalCqlList } from 'queries/external-cql';
import fetchTemplates from 'queries/fetchTemplates';
import useStyles from './styles';

export const VSAC_OPTIONS = [
  'allergyIntolerances',
  'conditions',
  'device',
  'encounters',
  'immunizations',
  'medicationStatements',
  'medicationRequests',
  'observations',
  'procedures',
  'serviceRequest'
];

const ElementSelect = ({ excludeListOperations = false, handleAddElement, isDisabled, parentElementId }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSuboption, setSelectedSuboption] = useState(null);
  const [selectedCqlOption, setSelectedCqlOption] = useState(null);
  const [showVSACSelect, setShowVSACSelect] = useState(false);
  const artifact = useSelector(state => state.artifacts.artifact);
  const query = { artifactId: artifact._id };
  const { data: externalCqlList } = useQuery(['externalCql', query], () => fetchExternalCqlList(query));
  const { data: elementTemplates } = useQuery('templates', () => fetchTemplates(), { staleTime: Infinity });
  const styles = useStyles();

  const elementOptions = useMemo(() => {
    if (!elementTemplates) return [];
    const filterOut = ['Medications', 'Operations', excludeListOperations && 'List Operations'].filter(Boolean);
    const versionLockMap = {
      serviceRequest: ['4.0.0', '4.0.1', '4.0.x']
    };

    const result = elementTemplates
      .filter(template => !template.suppress && !filterOut.includes(template.name))
      .map(template => {
        const value = changeToCase(template.name, 'camelCase');
        const options = getElementEntries({
          entryType: value,
          artifact,
          elementTemplates,
          externalCqlList,
          parentElementId
        });
        const hasEmptyList = options?.length === 0;
        const isVersionLocked =
          artifact.fhirVersion !== '' && !(versionLockMap[value]?.includes(artifact.fhirVersion) ?? true);

        return {
          hasEmptyList,
          isDisabled: hasEmptyList || isVersionLocked,
          isVersionLocked,
          label: VSAC_OPTIONS.includes(value) ? pluralize.singular(template.name) : template.name,
          options,
          value,
          vsacAuthRequired: Boolean(VSAC_OPTIONS.includes(value))
        };
      });

    // add medication statement and medication request
    const medicationOptions = [
      { isDisabled: false, label: 'Medication Statement', value: 'medicationStatement', vsacAuthRequired: true },
      { isDisabled: false, label: 'Medication Request', value: 'medicationRequest', vsacAuthRequired: true }
    ];

    return result.concat(medicationOptions).sort(sortAlphabeticallyByKey('label'));
  }, [artifact, elementTemplates, excludeListOperations, externalCqlList, parentElementId]);

  const handleClearOptions = () => {
    setSelectedOption(null);
    setSelectedSuboption(null);
    setSelectedCqlOption(null);
    setShowVSACSelect(false);
  };

  const handleSelectOption = optionValue => {
    setSelectedSuboption(null);
    setSelectedCqlOption(null);
    const option = elementOptions.find(option => option.value === optionValue);
    setSelectedOption(option);
    setShowVSACSelect(!!option.vsacAuthRequired);
  };

  const handleSelectElement = (selectedElement, vsacType) => {
    let templateName;
    if (['And', 'Or'].includes(selectedElement.value)) templateName = 'Operations';
    else if (['medicationRequest', 'medicationStatement'].includes(selectedOption.value)) templateName = 'Medications';
    else templateName = changeToCase(selectedOption.value, 'capitalCase');
    const template = _.cloneDeep(elementTemplates.find(template => template.name === templateName));

    const element = generateElement({
      artifact,
      cqlOption: selectedOption.value === 'externalCql' ? selectedElement : null,
      externalCqlList,
      option: selectedOption.value,
      subOption: selectedSuboption?.value || selectedElement.value,
      template,
      vsacCode: vsacType === 'codes' ? selectedElement : null,
      vsacValueSet: vsacType === 'valueSets' ? selectedElement : null,
      vsacType
    });

    handleAddElement(element);
    handleClearOptions();
  };

  const handleSelectSuboption = suboptionValue => {
    const suboption = selectedOption.options.find(option => option.value === suboptionValue);
    if (suboption?.options) {
      setSelectedSuboption(suboption);
      setSelectedCqlOption(null);
    } else {
      handleSelectElement(suboption);
    }
  };

  return (
    <Card>
      <CardContent>
        <div className={styles.elementSelect}>
          <div className={styles.elementSelectGroup}>
            <div className={styles.elementSelectLabel}>New element:</div>

            <div className={styles.elementSelectDropdowns}>
              <ElementSelectDropdown
                handleSelectOption={handleSelectOption}
                isDisabled={isDisabled}
                label="Element type"
                options={elementOptions || []}
                showFooter
                value={selectedOption?.value || ''}
              />

              {selectedOption && !selectedOption.vsacAuthRequired && (
                <ElementSelectDropdown
                  handleSelectOption={handleSelectSuboption}
                  label={selectedOption.value === 'baseElements' ? 'Base Element' : `${selectedOption.label} Element`}
                  options={selectedOption.options || []}
                  value={selectedSuboption?.value || ''}
                />
              )}

              {selectedSuboption && (
                <ElementSelectDropdown
                  handleSelectOption={handleSelectElement}
                  label="Definition, function, or parameter"
                  options={selectedSuboption.options || []}
                  value={selectedCqlOption?.value || ''}
                />
              )}
            </div>
          </div>

          {selectedOption && (
            <IconButton aria-label="close" onClick={() => handleClearOptions()} size="large">
              <CloseIcon />
            </IconButton>
          )}
        </div>
      </CardContent>

      {showVSACSelect && <ElementSelectActions handleSelectElement={handleSelectElement} />}
    </Card>
  );
};

ElementSelect.propTypes = {
  excludeListOperations: PropTypes.bool,
  handleAddElement: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  parentElementId: PropTypes.string
};

export default ElementSelect;
