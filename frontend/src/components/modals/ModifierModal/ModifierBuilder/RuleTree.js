import _ from 'lodash';
import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import { Card, Button, CircularProgress, IconButton } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import ToggleSwitch from 'components/elements/Utils/ToggleSwitch';
import { Dropdown } from 'components/elements';
import { MOCK_getResourceInfo, MOCK_getOperatorsByInputType, MOCK_getTypeMapInfo } from '../mock/mockquery';
import { useFieldStyles, useTextStyles } from 'styles/hooks';
import useStyles from '../styles';

import OperatorInstance from './OperatorInstance';

import {
  addRule,
  addGroup,
  removeRuleByIndex,
  updateRuleType,
  updateConjunctionValue,
  createChildCallback
} from './treeOperations';

import {
  getBaseChoiceProperty,
  getConvertibleTypes,
  getPropertyChoices,
  getPropertyIsChoice,
  getPropertyRequiresChoice
} from './utils';

const RuleTree = ({ fhirVersion, inputType, rootTreeNode, setRootTreeNode, onReset }) => {
  const modalStyles = useStyles();
  const textStyles = useTextStyles();
  const fieldStyles = useFieldStyles();

  const [resource, setResource] = useState();
  const [conversionInfo, setConversionInfo] = useState();
  const [operatorsByInputType, setOperators] = useState([]);

  useEffect(() => {
    // Convert the input type to the name format used by query datafiles.
    let resourceType = _.upperFirst(inputType.startsWith('list_of') ? inputType.slice(8, -1) : inputType);
    resourceType = resourceType
      .split('_')
      .map(inputTypeWord => _.upperFirst(inputTypeWord))
      .join('');
    // Get preliminary information about the resource, and type conversion maps.
    // If the resource type happens to be observation, also fetch component.
    MOCK_getResourceInfo(fhirVersion, resourceType).then(resourceInfo => {
      if (resourceType === 'Observation') {
        MOCK_getResourceInfo(fhirVersion, 'Observation.component').then(componentInfo => {
          let combinedObservation = { ...resourceInfo, component: componentInfo };
          setResource(combinedObservation);
        });
      } else setResource(resourceInfo);
    });
    MOCK_getTypeMapInfo(fhirVersion).then(typeMapInfo => setConversionInfo(typeMapInfo));
    // Sensitivity list set to changes in fhirVersion and inputType
  }, [fhirVersion, inputType]);

  const render = (currentTreeNode, updateCurrentNode, removeCurrentGroup, depth = 0) => {
    // Assign indices to the rules so we can break them up and still edit them in order.
    // Break them up into children and siblings.
    const rulesWithIndices = currentTreeNode.rules.map((rule, index) => ({ ...rule, index: index }));
    const siblingRules = rulesWithIndices.filter(rule => rule.conjunctionType === undefined);
    const childGroups = rulesWithIndices.filter(rule => rule.conjunctionType !== undefined);

    // Update a rule within the current node's rule array by index.
    // Here we update the resourceProperty field.
    const updateResourceProperty = (index, propertyName) => {
      let typeSpecifier;
      if (getPropertyIsChoice(resource, propertyName)) {
        // If it is a derivative property (e.g. onsetDateTime), we must get its typeSpecifier manually
        const baseProperty = getBaseChoiceProperty(resource, propertyName);
        typeSpecifier = baseProperty.typeSpecifier.elementType.find(choice => choice.name === propertyName)
          .typeSpecifier;
      } else if (getPropertyRequiresChoice(resource, propertyName)) {
        // If it is a choice property (e.g. onset[X]), we update the resource property name and return.
        // The application will then render the choice dropdown.
        let updatedNode = _.cloneDeep(currentTreeNode);
        updatedNode.rules[index] = { ...updatedNode.rules[index], resourceProperty: propertyName };
        updateCurrentNode(updatedNode);
        return;
      } else if (
        propertyName.startsWith('Observation.component.value') &&
        propertyName !== 'Observation.component.value'
      ) {
        typeSpecifier = resource.component.properties
          .find(property => 'value' === property.name)
          .typeSpecifier.elementType.find(subProperty => `Observation.component.${subProperty.name}` === propertyName)
          .typeSpecifier;
        typeSpecifier.type = 'ListTypeSpecifier';
      } else if (propertyName.startsWith('Observation.component')) {
        typeSpecifier = resource.component.properties.find(
          property => `Observation.component.${property.name}` === propertyName
        ).typeSpecifier;
        typeSpecifier.type = 'ListTypeSpecifier';
      } else {
        // Otherwise, if the type is normal and non-choice, just directly find its type specifier.
        typeSpecifier = resource.properties.find(property => property.name === propertyName).typeSpecifier;
      }
      // Once typeSpecifier is found, find its implicit conversions, then request operators for the conversions.
      let { type, elementType } = typeSpecifier;

      let operatorRequests = [];
      getConvertibleTypes(conversionInfo.FHIRToSystem, type, elementType).forEach(conversion => {
        operatorRequests.push(MOCK_getOperatorsByInputType(conversion.type, conversion.elementType));
      });

      // Resolve all promises, flattening the found operators, then adding them to the ones
      // the frontend might already know about, then making them unique with a set.
      // Also, add in hard-coded operator for predefined-concepts.
      Promise.all(operatorRequests).then(operatorBundles => {
        let updatedOperators = { ...operatorsByInputType };
        updatedOperators[propertyName] = [...new Set(operatorBundles.flat())];
        // If we detect that our input type is a FHIR.code, System.Coding, or System.concept
        // Then we need to ensure that the resource has predefined codes before allowing the user
        // to use 'predefinedConceptComparision' aka 'Is ... (N values)'
        let predefinedConceptComparisonIndex = updatedOperators[propertyName].findIndex(operator =>
          operator.id.startsWith('predefinedConceptComparison')
        );
        // Get the resource property, taking into account if it happens to be a choice property or not.
        let resourceProperty;
        if (getPropertyIsChoice(resource, propertyName)) {
          resourceProperty = getBaseChoiceProperty(resource, propertyName).typeSpecifier.elementType.find(
            property => property.name === propertyName
          );
        } else if (propertyName.startsWith('Observation.component')) {
          // A special case for observation.component.
          resourceProperty = resource.component.properties.find(
            property => `Observation.component.${property.name}` === propertyName
          );
        } else {
          resourceProperty = resource.properties.find(property => property.name === propertyName);
        }
        if (predefinedConceptComparisonIndex !== -1 && resourceProperty.predefinedCodes !== undefined) {
          // Update the human readable name to reflect the number of values you can choose.
          updatedOperators[propertyName][
            predefinedConceptComparisonIndex
          ].name = `Is ... (${resourceProperty.predefinedCodes.length} values)`;
          // Add the selection values to the operator
          updatedOperators[propertyName][predefinedConceptComparisonIndex].userSelectedOperands[0][
            'selectionValues'
          ] = _.cloneDeep(resourceProperty.predefinedCodes);
        }
        // Otherwise remove it from the list.
        else if (predefinedConceptComparisonIndex !== -1) {
          updatedOperators[propertyName].splice(predefinedConceptComparisonIndex, 1);
        }
        setOperators(updatedOperators);
      });

      // Finally, update the node with the new selected resource property.
      let updatedNode = _.cloneDeep(currentTreeNode);
      updatedNode.rules[index] = { ...updatedNode.rules[index], resourceProperty: propertyName };
      updateCurrentNode(updatedNode);
    };

    return resource ? (
      <Card className={clsx(depth % 2 === 0 ? modalStyles.cardDark : modalStyles.cardLight, modalStyles.statementCard)}>
        <div key={depth} className={clsx(modalStyles.indent, modalStyles.topIndent)}>
          <div id="padding-group" className={modalStyles.lineGroup}>
            <div className={clsx(modalStyles.linePadding, modalStyles.lineStubTop)}>
              {depth !== 0 && <div className={modalStyles.lineChild}></div>}
            </div>
            <ToggleSwitch
              value={currentTreeNode.conjunctionType === 'and'}
              onToggle={() => updateConjunctionValue(currentTreeNode, updateCurrentNode)}
              useLabel
            />
            <IconButton onClick={removeCurrentGroup} className={modalStyles.deleteStatement}>
              <ClearIcon />
            </IconButton>
          </div>

          {siblingRules.map(rule => {
            return (
              <div id="rule-container" key={rule.index}>
                <div className={modalStyles.lineSpacer}></div>
                <div className={clsx(modalStyles.lineGroup, modalStyles.lineConnector)}>
                  <div className={modalStyles.lineStubMid}></div>
                  <Dropdown
                    className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
                    id="property-select"
                    label={'Select Property'}
                    labelKey="name"
                    onChange={event => {
                      updateResourceProperty(rule.index, event.target.value);
                    }}
                    options={
                      getPropertyIsChoice(resource, rule.resourceProperty) ||
                      rule.resourceProperty?.startsWith('Observation.component')
                        ? resource.properties.concat([{ name: rule.resourceProperty }])
                        : resource.properties
                    }
                    value={rule.resourceProperty}
                    valueKey="name"
                  />
                  {rule.resourceProperty && getPropertyRequiresChoice(resource, rule.resourceProperty) && (
                    <Dropdown
                      className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
                      id="choicetype-select"
                      label={'Select Property Type'}
                      labelKey="name"
                      onChange={event =>
                        updateResourceProperty(
                          rule.index,
                          rule.resourceProperty.startsWith('Observation.component')
                            ? `Observation.component.${event.target.value}`
                            : event.target.value
                        )
                      }
                      options={getPropertyChoices(resource, rule.resourceProperty)}
                      value={rule.ruleType}
                      valueKey="name"
                    />
                  )}
                  {rule.resourceProperty && rule.resourceProperty === 'component' && (
                    <Dropdown
                      className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
                      id="component-select"
                      label={'Select Component'}
                      labelKey="name"
                      onChange={event =>
                        updateResourceProperty(rule.index, `Observation.component.${event.target.value}`)
                      }
                      options={resource.component.properties}
                      value={rule.ruleType}
                      valueKey="name"
                    />
                  )}
                  {operatorsByInputType[rule.resourceProperty] !== undefined &&
                    rule.resourceProperty !== 'component' && (
                      <Dropdown
                        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
                        id="operator-select"
                        label={'Select Operator'}
                        labelKey="name"
                        onChange={event =>
                          updateRuleType(currentTreeNode, updateCurrentNode, rule.index, event.target.value)
                        }
                        options={operatorsByInputType[rule.resourceProperty]}
                        value={rule.ruleType}
                        valueKey="id"
                      />
                    )}
                  <IconButton onClick={() => removeRuleByIndex(currentTreeNode, updateCurrentNode, rule.index)}>
                    <ClearIcon />
                  </IconButton>
                </div>
                {rule.ruleType && (
                  <div className={modalStyles.lineContentPane}>
                    <div className={modalStyles.indent}>
                      <OperatorInstance
                        rule={rule}
                        updateRule={updatedRule =>
                          createChildCallback(currentTreeNode, updateCurrentNode, rule.index, updatedRule)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className={modalStyles.lineSpacer}></div>
          {childGroups.map(group => {
            return (
              <div id="group-container" key={group.index}>
                <div className={modalStyles.lineConnector}>
                  <div className={modalStyles.lineParent}></div>
                  <div className={modalStyles.indent}>
                    {render(
                      group,
                      updatedNode => createChildCallback(currentTreeNode, updateCurrentNode, group.index, updatedNode),
                      () => removeRuleByIndex(currentTreeNode, updateCurrentNode, group.index),
                      depth + 1
                    )}
                  </div>
                </div>
                <div className={modalStyles.lineSpacer}></div>
              </div>
            );
          })}

          <div className={clsx(modalStyles.lineGroup, modalStyles.bottomIndent)}>
            <div className={clsx(modalStyles.linePadding, modalStyles.lineStubLow)}></div>
            <Button
              onClick={() => addRule(currentTreeNode, updateCurrentNode)}
              className={modalStyles.textButton}
              color="primary"
              disableTouchRipple={true}
            >
              <span className={textStyles.bold}>ADD RULE</span>
            </Button>
            <Button
              onClick={() => addGroup(currentTreeNode, updateCurrentNode)}
              className={modalStyles.textButton}
              color="primary"
              disableTouchRipple={true}
            >
              <span className={textStyles.bold}>ADD GROUP</span>
            </Button>
          </div>
        </div>
      </Card>
    ) : (
      <CircularProgress />
    );
  };
  return render(rootTreeNode, setRootTreeNode, onReset);
};
export default RuleTree;
