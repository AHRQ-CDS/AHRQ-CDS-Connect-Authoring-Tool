const config = require('../config');
const Artifact = require('../models/artifact');
const CQLLibrary = require('../models/cqlLibrary');
const { sendUnauthorized } = require('./common');
const _ = require('lodash');
const slug = require('slug');
const ejs = require('ejs');
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const busboy = require('busboy');
const { exportCQL, importCQL, RawCQL } = require('cql-merge');

const queryResources = {
  dstu2_resources: require('../data/query_builder/dstu2_resources.json'),
  stu3_resources: require('../data/query_builder/stu3_resources.json'),
  r4_resources: require('../data/query_builder/r4_resources.json'),
  operators: require('../data/query_builder/operators.json')
};

const templatePath = path.join(__dirname, '..', 'data', 'cql', 'templates');
const specificPath = path.join(__dirname, '..', 'data', 'cql', 'specificTemplates');
const modifierPath = path.join(__dirname, '..', 'data', 'cql', 'modifiers');
const rulePath = path.join(__dirname, '..', 'data', 'cql', 'rules');
const artifactPath = path.join(__dirname, '..', 'data', 'cql', 'artifact.ejs');
const specificMap = loadTemplates(specificPath);
const templateMap = loadTemplates(templatePath);
const modifierMap = loadTemplates(modifierPath);
const ruleMap = loadTemplates(rulePath);
// Each library will be included. Aliases are optional.

const getCQLValueString = externalCQLArgument => {
  switch (externalCQLArgument.type) {
    case 'integer':
    case 'boolean':
    case 'string':
      return externalCQLArgument.selected;
    case 'decimal':
      return parseFloat(externalCQLArgument.selected.str);
    case 'system_code':
    case 'system_concept':
      if (externalCQLArgument.selected.system && externalCQLArgument.selected.uri)
        if (
          this.codeSystemMap.get(externalCQLArgument.selected.system) &&
          externalCQLArgument.selected.system === 'Other'
        ) {
          let systemUID;
          let ctr = 0;
          do {
            ctr += 1;
            systemUID = externalCQLArgument.selected.system.concat(`_${ctr.toString()}`);
          } while (this.codeSystemMap.get(systemUID));
          this.codeSystemMap.set(systemUID, {
            name: systemUID,
            id: externalCQLArgument.selected.uri
          });
          if (externalCQLArgument.type === 'system_concept')
            return `Concept { Code '${externalCQLArgument.selected.code}' from "${systemUID}" }`;
          else return `Code '${externalCQLArgument.selected.code}' from "${systemUID}"`;
        } else {
          this.codeSystemMap.set(externalCQLArgument.selected.system, {
            name: externalCQLArgument.selected.system,
            id: externalCQLArgument.selected.uri
          });
        }
      return externalCQLArgument.selected.str;

    default:
      return externalCQLArgument.selected.str;
  }
};

const includeLibrariesDstu2 = [
  { name: 'FHIRHelpers', version: '1.0.2', alias: 'FHIRHelpers' },
  {
    name: 'AT_Internal_CDS_Connect_Commons_for_FHIRv102',
    version: '1.3.5',
    alias: 'C3F'
  },
  {
    name: 'AT_Internal_CDS_Connect_Conversions',
    version: '1',
    alias: 'Convert'
  }
];

const includeLibrariesStu3 = [
  { name: 'FHIRHelpers', version: '3.0.0', alias: 'FHIRHelpers' },
  {
    name: 'AT_Internal_CDS_Connect_Commons_for_FHIRv300',
    version: '1.0.4',
    alias: 'C3F'
  },
  {
    name: 'AT_Internal_CDS_Connect_Conversions',
    version: '1',
    alias: 'Convert'
  }
];

const includeLibrariesR400 = [
  { name: 'FHIRHelpers', version: '4.0.0', alias: 'FHIRHelpers' },
  {
    name: 'AT_Internal_CDS_Connect_Commons_for_FHIRv400',
    version: '1.0.5',
    alias: 'C3F'
  },
  {
    name: 'AT_Internal_CDS_Connect_Conversions',
    version: '1',
    alias: 'Convert'
  }
];

const includeLibrariesR401 = [
  { name: 'FHIRHelpers', version: '4.0.1', alias: 'FHIRHelpers' },
  {
    name: 'AT_Internal_CDS_Connect_Commons_for_FHIRv401',
    version: '1.1.1',
    alias: 'C3F'
  },
  {
    name: 'AT_Internal_CDS_Connect_Conversions',
    version: '1',
    alias: 'Convert'
  }
];

const includeLibrariesMap = {
  '1.0.2': includeLibrariesDstu2,
  '3.0.0': includeLibrariesStu3,
  '4.0.0': includeLibrariesR400,
  '4.0.1': includeLibrariesR401
};

const queryResourceMap = {
  list_of_observations: 'Observation',
  list_of_conditions: 'Condition',
  list_of_medication_statements: 'MedicationStatement',
  list_of_medication_requests: 'MedicationRequest',
  list_of_procedures: 'Procedure',
  list_of_allergy_intolerances: 'AllergyIntolerance',
  list_of_encounters: 'Encounter',
  list_of_immunizations: 'Immunization',
  list_of_devices: 'Device',
  list_of_service_requests: 'ServiceRequest'
};

const queryAliasMap = {
  list_of_observations: 'Ob',
  list_of_conditions: 'Co',
  list_of_medication_statements: 'MS',
  list_of_medication_requests: 'MR',
  list_of_procedures: 'Pr',
  list_of_allergy_intolerances: 'AI',
  list_of_encounters: 'En',
  list_of_immunizations: 'Im',
  list_of_devices: 'De',
  list_of_service_requests: 'SR'
};

// A flag to hold the FHIR version, so that it can be used
// in functions external to the artifact.
let fhirTarget;

module.exports = {
  objToZippedCql,
  objToViewableCql,
  objToELM,
  makeCQLtoELMRequest,
  formatCQL,
  buildCQL
};

function getFieldWithType(fields, type) {
  return fields.find(f => f.type.endsWith(type));
}

function getFieldWithId(fields, id) {
  return fields.find(f => f.id === id);
}

function loadTemplates(pathToTemplates) {
  const templates = {};
  // Loop through all the files in the temp directory
  fs.readdir(pathToTemplates, (err, files) => {
    if (err) {
      console.error('Could not list the directory.', err);
    }

    files.forEach((file, index) => {
      templates[file] = fs.readFileSync(path.join(pathToTemplates, file), 'utf-8');
    });
  });
  return templates;
}

// This creates the context EJS uses to create a union of queries using different valuesets
function createMultipleValueSetExpression(id, valuesets, type) {
  const groupedContext = {
    template: 'MultipleValuesetsExpression',
    name: id,
    valuesets,
    type
  };
  return groupedContext;
}

// This creates the context EJS uses to create a union of C3F function calls for comparing for a specific concept
function createMultipleConceptExpression(id, concepts, type) {
  const groupedContext = {
    name: id,
    concepts,
    type
  };
  return groupedContext;
}

// This creates the context EJS uses to simply union expression together and referencing that expression.
function unionExpressions(context, name, unionedElementsList) {
  let duplicateNameElements = unionedElementsList.filter(element => element.name.includes(name));
  const count = duplicateNameElements.length;
  let uniqueName = `${name}_union`;
  if (count > 0) {
    uniqueName = `${name}_union_${count}`;
  }

  const expressionToUnion = {
    name: uniqueName,
    expressionList: context.values
  };
  unionedElementsList.push(expressionToUnion);
  context.values = [`"${uniqueName}"`];
}

function addGroupedValueSetExpression(referencedElements, resourceMap, valuesets, type, context) {
  // Check for duplicate expression name and appened an integer if it is not unique
  let duplicateNameElements = referencedElements.filter(element => element.name.includes(valuesets.id));
  const count = duplicateNameElements.length;
  let uniqueName = `${valuesets.id}_valuesets`;
  if (count > 0) {
    uniqueName = `${valuesets.id}_valuesets_${count}`;
  }

  // Reference the grouped expression on the original element
  if (count > 0) {
    context.values = [`"${valuesets.id}_valuesets_${count}"`];
  } else {
    context.values = [`"${valuesets.id}_valuesets"`];
  }

  // Add value sets to be grouped onto the list of value sets defined at the top
  valuesets.valuesets.forEach(vs => {
    const count = getCountForUniqueExpressionName(vs, resourceMap, 'name', 'oid');
    if (count > 0) {
      vs.name = `${vs.name}_${count}`;
    }
  });

  // Create grouped expression
  const multipleValueSetExpression = createMultipleValueSetExpression(uniqueName, valuesets.valuesets, type);
  referencedElements.push(multipleValueSetExpression);
}

function addGroupedConceptExpression(referencedConceptElements, resourceMap, valuesets, type, context) {
  // Check for duplicated expression name and append an integer if it is not unique
  let duplicateNameElements = referencedConceptElements.filter(element => element.name.includes(valuesets.id));
  const count = duplicateNameElements.length;
  let uniqueName = `${valuesets.id}_concepts`;
  if (count > 0) {
    uniqueName = `${valuesets.id}_concepts_${count}`;
  }

  // Reference the grouped expression on the original element
  if (count > 0) {
    context.values.push(`"${valuesets.id}_concepts_${count}"`);
  } else {
    context.values.push(`"${valuesets.id}_concepts"`);
  }

  // Create grouped expression
  const multipleConceptExpression = createMultipleConceptExpression(uniqueName, valuesets.concepts, type);
  referencedConceptElements.push(multipleConceptExpression);
}

function isBaseElementUseChanged(element, baseElements) {
  const referenceField = getFieldWithType(element.fields, 'reference');
  if (!referenceField) {
    // This case should never happen because an element of type base element will never NOT have a reference field
    return true;
  }

  const nameField = getFieldWithId(element.fields, 'element_name');
  const commentField = getFieldWithId(element.fields, 'comment');

  const originalBaseElement = baseElements.find(baseEl => referenceField.value.id === baseEl.uniqueId);
  if (!originalBaseElement) {
    // This case should never happen because you can't delete base elements while in use.
    return true;
  }

  const originalBaseElementNameField = getFieldWithId(originalBaseElement.fields, 'element_name');
  if (nameField.value !== originalBaseElementNameField.value) {
    // If the name of the use of the base element and the original base element are different, it's been changed.
    return true;
  }
  if (element.modifiers.length > 0) {
    // If there are modifiers applied to the use of the base element, it's been changed.
    return true;
  }

  const originalCommentField = getFieldWithId(originalBaseElement.fields, 'comment');
  if (commentField.value !== originalCommentField.value) {
    // If the comment on the use of the base element and the original element are different, it's been changed.
    return true;
  }

  return false;
}

function isParameterUseChanged(element, parameters) {
  const referenceField = getFieldWithType(element.fields, 'reference');
  if (!referenceField) {
    // This case should never happen because an element of type parameter will never NOT have a reference field
    return true;
  }

  const nameField = getFieldWithId(element.fields, 'element_name');
  const commentField = getFieldWithId(element.fields, 'comment');

  const originalParameter = parameters.find(param => referenceField.value.id === param.uniqueId);
  if (!originalParameter) {
    // This case should never happen because you can't delete parameters while in use.
    return true;
  }

  if (nameField.value !== originalParameter.name) {
    // If the name of the use of the parameter and the original parameter are different, it's been changed.
    return true;
  }
  if (element.modifiers.length > 0) {
    // If there are modifiers applied to the use of the parameter, it's been changed.
    return true;
  }

  if (!_.isEqual(createCommentArray(commentField.value) || [], originalParameter.comment || [])) {
    // If the comment on the use of the parameter and the original parameter are different, it's been changed.
    return true;
  }

  return false;
}

function createCommentArray(comment) {
  if (!comment) {
    return;
  }

  const finalCommentArray = [];
  const commentArray = comment.split(/\n\r|\r\n|\r|\n/g);
  // Render each line in the comment
  commentArray.forEach(c => {
    let currentCommentString = c;
    // Break up long lines around the 100 character mark
    while (currentCommentString.length > 100) {
      let splitIndex = 100;
      let secondPart = currentCommentString.substring(splitIndex);
      // Don't split a line in the middle of a word
      while (!secondPart.startsWith(' ') && splitIndex < currentCommentString.length) {
        splitIndex += 1;
        secondPart = currentCommentString.substring(splitIndex);
      }
      const firstPart = currentCommentString.substring(0, splitIndex);
      // Get rid of the space on the new line. If splitIndex + 1 > currentCommentString.length, returns ''
      currentCommentString = currentCommentString.substring(splitIndex + 1);
      finalCommentArray.push(firstPart);
    }
    // Only push currentCommentString if it has content
    if (currentCommentString) finalCommentArray.push(currentCommentString);
  });
  return finalCommentArray;
}

// Class to handle all cql generation
class CqlArtifact {
  constructor(artifact) {
    this.name = slug(artifact.name ? artifact.name : 'untitled', {
      lower: false
    });
    this.version = artifact.version ? artifact.version : 1;
    this.dataModel = artifact.dataModel;
    if (this.dataModel.version === '4.0.x') {
      // default 4.0.x to to 4.0.1
      this.dataModel = _.cloneDeep(this.dataModel);
      this.dataModel.version = '4.0.1';
    }
    this.includeLibraries = this.dataModel.version ? includeLibrariesMap[this.dataModel.version] : includeLibrariesR401;
    this.includeLibraries = this.includeLibraries.concat(artifact.externalLibs || []);
    this.context = artifact.context && artifact.context.length ? artifact.context : 'Patient';
    this.inclusions = artifact.expTreeInclude;
    this.parameters = artifact.parameters;
    this.exclusions = artifact.expTreeExclude;
    this.subpopulations = artifact.subpopulations;
    this.baseElements = artifact.baseElements;
    this.recommendations = artifact.recommendations;
    this.errorStatement = artifact.errorStatement;

    fhirTarget = this.dataModel;

    this.initialize();
  }

  initialize() {
    this.resourceMap = new Map();
    this.codeSystemMap = new Map();
    this.codeMap = new Map();
    this.conceptMap = new Map();
    this.referencedElements = [];
    this.referencedConceptElements = [];
    this.unionedElements = [];
    this.contexts = [];
    this.conjunctions = [];
    this.conjunction_main = [];
    this.names = new Map();

    this.parameters.forEach(parameter => {
      const count = getCountForUniqueExpressionName(parameter, this.names, 'name', '', false);
      if (count > 0) {
        parameter.name = `${parameter.name}_${count}`;
      }
      if (parameter.value && parameter.value.unit) {
        parameter.value.unit = parameter.value.unit.replace(/'/g, "\\'");
      }

      if (parameter.type === 'system_code' || parameter.type === 'system_concept') {
        let system = _.get(parameter, 'value.system', '').replace(/'/g, "\\'");
        let uri = _.get(parameter, 'value.uri', '').replace(/'/g, "\\'");
        if (system && uri) {
          this.codeSystemMap.set(system, { name: system, id: uri });
        }
      }

      if (parameter.comment) {
        parameter.comment = createCommentArray(parameter.comment);
      }

      const parameterTypeMap = {
        boolean: 'Boolean',
        system_code: 'Code',
        system_concept: 'Concept',
        integer: 'Integer',
        datetime: 'DateTime',
        decimal: 'Decimal',
        system_quantity: 'Quantity',
        string: 'String',
        time: 'Time',
        interval_of_integer: 'Interval<Integer>',
        interval_of_datetime: 'Interval<DateTime>',
        interval_of_decimal: 'Interval<Decimal>',
        interval_of_quantity: 'Interval<Quantity>'
      };

      parameter.type = parameterTypeMap[parameter.type];
    });

    this.baseElements.forEach(baseElement => {
      let isBaseElementUseAndUnchanged = false;
      let isParameterUseAndUnchanged = false;
      if (baseElement.type === 'baseElement') {
        isBaseElementUseAndUnchanged = !isBaseElementUseChanged(baseElement, this.baseElements);
      }
      if (baseElement.type === 'parameter') {
        isParameterUseAndUnchanged = !isParameterUseChanged(baseElement, this.parameters);
      }
      const baseElementNameField = getFieldWithId(baseElement.fields, 'element_name');
      const count = getCountForUniqueExpressionName(baseElementNameField, this.names, 'value', '', false);
      if (!(isBaseElementUseAndUnchanged || isParameterUseAndUnchanged) && count > 0) {
        baseElementNameField.value = `${baseElementNameField.value}_${count}`;
      }

      if (baseElement.childInstances) {
        this.parseTree(baseElement);
      } else if (baseElement.type === 'parameter') {
        this.parseParameter(baseElement);
      } else {
        this.parseElement(baseElement);
      }
    });

    if (this.inclusions.childInstances.length) {
      this.parseTree(this.inclusions);
    }
    if (this.exclusions.childInstances.length) {
      this.parseTree(this.exclusions);
    }
    this.subpopulations.forEach(subpopulation => {
      const count = getCountForUniqueExpressionName(subpopulation, this.names, 'subpopulationName', '', false);
      if (count > 0) {
        // Update subpopulation's name and the other references to it
        subpopulation.subpopulationName = `${subpopulation.subpopulationName}_${count}`;
        this.checkOtherUses(subpopulation.subpopulationName, subpopulation.uniqueId);
      }
      if (!subpopulation.special) {
        // `Doesn't Meet Inclusion Criteria` and `Meets Exclusion Criteria` are special
        if (subpopulation.childInstances.length) {
          this.parseTree(subpopulation);
        }
      }
    });
  }

  checkOtherUses(name, id) {
    this.recommendations.forEach(recommendation => {
      recommendation.subpopulations.forEach(subpop => {
        if (subpop.uniqueId === id) {
          subpop.subpopulationName = name;
        }
      });
    });

    this.errorStatement.ifThenClauses.forEach(ifThenClause => {
      if (ifThenClause.ifCondition.uniqueId === id) {
        ifThenClause.ifCondition.value = `"${name}"`;
      }
      if (ifThenClause.statements) {
        ifThenClause.statements.ifThenClauses.forEach(ifThenClause => {
          if (ifThenClause.ifCondition.uniqueId === id) {
            ifThenClause.ifCondition.value = `"${name}"`;
          }
        });
      }
    });
  }

  setFieldContexts(elementDetails, valuesetQueryName, context) {
    if (elementDetails.concepts.length > 0) {
      const values = [];
      elementDetails.concepts.forEach(concept => {
        const conceptAdded = addConcepts(concept, this.codeSystemMap, this.codeMap, this.conceptMap);
        values.push(conceptAdded.name);
      });
      // Union multiple codes together.
      if (values.length > 1) {
        addGroupedConceptExpression(
          this.referencedConceptElements,
          this.resourceMap,
          elementDetails,
          valuesetQueryName,
          context
        );
        context.template = 'GenericStatement';
      } else {
        context.values = values;
      }
    }
    if (elementDetails.valuesets.length > 0) {
      let concepts = [];
      if (context.values.length > 0) {
        concepts = context.values;
      }
      // Union multiple value sets together.
      if (elementDetails.valuesets.length > 1) {
        addGroupedValueSetExpression(
          this.referencedElements,
          this.resourceMap,
          elementDetails,
          valuesetQueryName,
          context
        );
        context.template = 'GenericStatement';
        if (concepts.length > 0) {
          // If there is one concept, check to see if it is already a referenced/grouped element.
          if (concepts.length === 1 && !this.referencedConceptElements.find(el => `"${el.name}"` === concepts[0])) {
            addGroupedConceptExpression(
              this.referencedConceptElements,
              this.resourceMap,
              elementDetails,
              valuesetQueryName,
              context
            );
          } else {
            context.values = context.values.concat(concepts);
          }
          // If both value sets and concepts are applied, union the individual expression together to create valid CQL
          unionExpressions(context, elementDetails.id, this.unionedElements);
        }
      } else {
        // elementDetails.valuesets.length = 1;
        if (concepts.length > 0) {
          addGroupedValueSetExpression(
            this.referencedElements,
            this.resourceMap,
            elementDetails,
            valuesetQueryName,
            context
          );
          // If there is one concept, check to see if it is already a referenced/grouped element.
          if (concepts.length === 1 && !this.referencedConceptElements.find(el => `"${el.name}"` === concepts[0])) {
            addGroupedConceptExpression(
              this.referencedConceptElements,
              this.resourceMap,
              elementDetails,
              valuesetQueryName,
              context
            );
          } else {
            // If concepts were already unioned, just add the variable to reference.
            context.values = context.values.concat(concepts);
          }
          // If both value sets and concepts are applied, union the individual expression together to create valid CQL
          unionExpressions(context, elementDetails.id, this.unionedElements);
          context.template = 'GenericStatement';
        } else {
          context.values = elementDetails.valuesets.map(vs => {
            const count = getCountForUniqueExpressionName(vs, this.resourceMap, 'name', 'oid');
            if (count > 0) {
              return `${vs.name}_${count}`;
            }
            return vs.name;
          });
        }
      }
    }
  }

  parseTree(element) {
    let updatedElement = this.parseConjunction(element);
    const children = updatedElement.childInstances || [];
    children.forEach(child => {
      if ('childInstances' in child) {
        this.parseTree(child);
      } else if (child.type === 'parameter') {
        this.parseParameter(child);
      } else {
        this.parseElement(child);
      }
    });
  }

  parseConjunction(element) {
    const conjunction = { template: element.id, components: [] };
    // Assume it's in the population if they're referenced from the `Recommendations` tab
    conjunction.assumeInPopulation = this.recommendations.some(recommendation =>
      recommendation.subpopulations.some(subpopref => subpopref.subpopulationName === element.subpopulationName)
    );
    const name = getFieldWithId(element.fields, 'element_name').value;
    const commentField = getFieldWithId(element.fields, 'comment');
    // Older artifacts might not have a comment field -- so account for that.
    const comment = commentField ? commentField.value : '';
    conjunction.element_name = name || element.subpopulationName || element.uniqueId;
    conjunction.comment = createCommentArray(comment) || '';
    (element.childInstances || []).forEach(child => {
      const childNameField = getFieldWithId(child.fields, 'element_name');
      let childName = (childNameField || {}).value || child.uniqueId;
      let isBaseElementUseAndUnchanged = false;
      let isParameterUseAndUnchanged = false;
      if (child.type === 'baseElement') {
        isBaseElementUseAndUnchanged = !isBaseElementUseChanged(child, this.baseElements);
      }
      if (child.type === 'parameter') {
        isParameterUseAndUnchanged = !isParameterUseChanged(child, this.parameters);
      }
      if (!(isBaseElementUseAndUnchanged || isParameterUseAndUnchanged)) {
        const childCount = getCountForUniqueExpressionName(childNameField, this.names, 'value', '', false);
        if (childCount > 0) {
          childName = `${childName}_${childCount}`;
          if (childNameField.value) {
            childNameField.value = childName;
          }
        }
      }
      const component = { name: childName };
      if ((element.id === 'Union' || element.id === 'Intersect') && child.needToPromote) {
        component.needToPromote = true;
      }
      conjunction.components.push(component);
    });
    this.conjunction_main.push(conjunction);
    return element;
  }

  parseParameter(element) {
    const context = {};
    element.fields.forEach(field => {
      if (field.id === 'comment') {
        context[field.id] = createCommentArray(field.value);
      } else {
        context[field.id] = field.value;
      }
    });
    context.template = 'GenericStatement';
    context.values = [`"${element.name}"`];
    context.modifiers = element.modifiers;
    if (isParameterUseChanged(element, this.parameters)) {
      this.contexts.push(context);
    }
  }

  // Generate context and resources for a single element
  parseElement(element) {
    const context = {};
    if (element.extends) {
      context.template = element.template ? element.template : element.extends;
    } else {
      context.template = element.template || element.id;
    }
    element.modifiers = element.modifiers || [];
    context.withoutModifiers = _.has(specificMap, context.template);
    if (context.template === 'AgeRange') {
      context.checkExistence = element.modifiers.some(modifier => modifier.id === 'CheckExistence');
      if (context.checkExistence) {
        const checkExistenceModifier = element.modifiers.find(modifier => modifier.id === 'CheckExistence');
        context.checkExistenceValue = checkExistenceModifier.values.value;
      }
    }
    element.fields.forEach(field => {
      switch (field.type) {
        case 'observation_vsac': {
          // All information in observations array will be provided by the selections made on the frontend.
          const observationValueSets = {
            id: 'generic_observation', // This is needed for creating a separate union'ed variable name.
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(field.codes, observationValueSets.concepts);
          addValueSets(field, observationValueSets, 'valuesets');
          this.setFieldContexts(observationValueSets, 'Observation', context);
          break;
        }
        case 'service_request_vsac': {
          const serviceRequestValueSets = {
            id: 'generic_service_request',
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(field.codes, serviceRequestValueSets.concepts);
          addValueSets(field, serviceRequestValueSets, 'valuesets');
          this.setFieldContexts(serviceRequestValueSets, 'ServiceRequest', context);
          break;
        }
        case 'number': {
          context[field.id] = field.value;
          if ('exclusive' in field) {
            context[`${field.id}_exclusive`] = field.exclusive;
          }
          break;
        }
        case 'condition_vsac': {
          const conditionValueSets = {
            id: 'generic_condition',
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(field.codes, conditionValueSets.concepts);
          addValueSets(field, conditionValueSets, 'valuesets');
          this.setFieldContexts(conditionValueSets, 'Condition', context);
          break;
        }
        case 'medicationStatement_vsac': {
          const medicationStatementValueSets = {
            id: 'generic_medication_statement',
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(field.codes, medicationStatementValueSets.concepts);
          addValueSets(field, medicationStatementValueSets, 'valuesets');
          this.setFieldContexts(medicationStatementValueSets, 'MedicationStatement', context);
          break;
        }
        case 'medicationRequest_vsac': {
          const medicationRequestValueSets = {
            id: 'generic_medication_request',
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(field.codes, medicationRequestValueSets.concepts);
          addValueSets(field, medicationRequestValueSets, 'valuesets');
          if (fhirTarget.version === '1.0.2') {
            this.setFieldContexts(medicationRequestValueSets, 'MedicationOrder', context);
          } else {
            this.setFieldContexts(medicationRequestValueSets, 'MedicationRequest', context);
          }
          break;
        }
        case 'procedure_vsac': {
          const procedureValueSets = {
            id: 'generic_procedure',
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(field.codes, procedureValueSets.concepts);
          addValueSets(field, procedureValueSets, 'valuesets');
          this.setFieldContexts(procedureValueSets, 'Procedure', context);
          break;
        }
        case 'encounter_vsac': {
          const encounterValueSets = {
            id: 'generic_encounter',
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(field.codes, encounterValueSets.concepts);
          addValueSets(field, encounterValueSets, 'valuesets');
          this.setFieldContexts(encounterValueSets, 'Encounter', context);
          break;
        }
        case 'allergyIntolerance_vsac': {
          const allergyIntoleranceValueSets = {
            id: 'generic_allergyIntolerance',
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(field.codes, allergyIntoleranceValueSets.concepts);
          addValueSets(field, allergyIntoleranceValueSets, 'valuesets');
          this.setFieldContexts(allergyIntoleranceValueSets, 'AllergyIntolerance', context);
          break;
        }
        case 'immunization_vsac': {
          const immunizationValueSets = {
            id: 'generic_immunization',
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(field.codes, immunizationValueSets.concepts);
          addValueSets(field, immunizationValueSets, 'valuesets');
          this.setFieldContexts(immunizationValueSets, 'Immunization', context);
          break;
        }
        case 'device_vsac': {
          const deviceValueSets = {
            id: 'generic_device',
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(field.codes, deviceValueSets.concepts);
          addValueSets(field, deviceValueSets, 'valuesets');
          this.setFieldContexts(deviceValueSets, 'Device', context);
          break;
        }
        case 'reference': {
          // Need to pull the element name from the reference to support renaming the elements while being used.
          if (field.id === 'parameterReference') {
            const referencedParameter = this.parameters.find(p => p.uniqueId === field.value.id);
            const referencedParameterName = referencedParameter.name || referencedParameter.uniqueId;
            context.values = [`"${referencedParameterName}"`];
          } else if (field.id === 'baseElementReference') {
            const referencedElement = this.baseElements.find(e => e.uniqueId === field.value.id);
            const referencedElementName =
              getFieldWithId(referencedElement.fields, 'element_name').value || referencedElement.uniqueId;
            context.values = [`"${referencedElementName}"`];
          } else if (field.id === 'externalCqlReference') {
            if (field.value.arguments && field.value.arguments.length > 0) {
              const expandArgs = field.value.arguments
                .map((arg, index) => {
                  if (arg.value) {
                    if (arg.value.argSource && arg.value.selected) {
                      if (arg.value.argSource === 'editor' && arg.value.selected != '') {
                        return getCQLValueString(arg.value);
                      } else if (arg.value.argSource === 'parameter') {
                        return `"${arg.value.elementName}"`;
                      } else if (arg.value.argSource === 'baseElement' && arg.value.selected != '') {
                        return `"${arg.value.elementName}"`;
                      } else if (
                        arg.value.argSource === 'externalCql' &&
                        arg.value.elementName &&
                        arg.value.elementType
                      ) {
                        return arg.value.elementType === 'function'
                          ? `${arg.value.elementName}()`
                          : arg.value.elementName;
                      }
                    }
                  }
                  return 'null';
                })
                .join(', ');
              context.values = [`"${field.value.library}"."${field.value.element}"(${expandArgs})`];
            } else if (
              field.value.id.includes('Function') &&
              field.value.arguments &&
              field.value.arguments.length === 0
            ) {
              context.values = [`"${field.value.library}"."${field.value.element}"()`];
            } else context.values = [`"${field.value.library}"."${field.value.element}"`];
          }
          break;
        }
        case 'textarea': {
          if (field.id === 'comment') {
            context[field.id] = createCommentArray(field.value);
          } else {
            context.values = context.values || [];
            context[field.id] = field.value;
          }
          break;
        }
        default: {
          context.values = context.values || [];
          context[field.id] = field.value;
          break;
        }
      }
    });

    context.modifiers = element.modifiers;
    context.element_name = context.element_name || element.uniqueId;
    // If it is an unchanged base element or parameter, don't add to context
    if (
      !(element.type === 'baseElement' && !isBaseElementUseChanged(element, this.baseElements)) &&
      !(element.type === 'parameter' && !isParameterUseChanged(element, this.parameters))
    ) {
      this.contexts.push(context);
    }
  }

  /* Modifiers Explanation:
    Within `formTemplates`, a template must be specified (unless extending an element that specifies a template).
    If no template is specified, it will look for a template named the same as the `id`.
    If the element specifies a template within the folder `specificTemplates` it's assumed that element will not have
      modifiers. In this case, just render the element.
    Otherwise:
      At this point, context.values should contain an array of each part of this element's CQL
        (e.g. ["CABG Surgeries", "Coronary artery bypass graft", "PCI ICD10CM SNOMEDCT", "PCI ICD9CM",
               "Carotid intervention"])
      Because each of these elements requires the modifier to be applied to them, loop through and render the base
        template (not modifier!)
        (e.g. ["[Procedure: "CABG Surgeries"]", "[Procedure: "Coronary artery bypass graft"]",
               "[Procedure: "PCI ICD10CM SNOMEDCT"]", "[Procedure: "PCI ICD9CM"]",
               "[Procedure: "Carotid intervention"]"])
      Then call `applyModifiers`. For each of these values, go through and apply each of the modifiers to them (by
        rendering the modifier template, and passing them in)
      Finally, join all these string with "\n  or " and return this (potentially-large) multi-line string.
      Render the `BaseTemplate`, which just gives adds the `define` statement, and inserts this string below it
  */

  // Generate cql for all elements
  body() {
    let expressions = this.contexts.concat(this.conjunctions);
    expressions = expressions.concat(this.conjunction_main);
    return expressions
      .map(context => {
        if (fhirTarget.version.startsWith('1.0.')) {
          if (context.template === 'GenericMedicationRequest') context.template = 'GenericMedicationOrder';
          if (context.template === 'MedicationRequestsByConcept') context.template = 'MedicationOrdersByConcept';
        }
        if (context.withoutModifiers || context.components) {
          return ejs.render(specificMap[context.template], context);
        }
        if (!(context.template in templateMap)) console.error(`Template could not be found: ${context.template}`);
        if (_.isEqual(context.values, [])) {
          context.values[0] = ejs.render(templateMap[context.template], {
            element_context: ''
          });
        } else {
          (context.values || []).forEach((value, index) => {
            context.values[index] = ejs.render(templateMap[context.template], {
              element_context: value
            });
          });
        }
        const cqlString = applyModifiers.call(this, context.values, context.modifiers);
        return ejs.render(templateMap.BaseTemplate, {
          comment: context.comment,
          element_name: context.element_name,
          cqlString
        });
      })
      .join('\n');
  }
  header() {
    return ejs.render(fs.readFileSync(artifactPath, 'utf-8'), this);
  }
  population() {
    const getTreeName = tree => getFieldWithId(tree.fields, 'element_name').value || tree.uniqueId;

    const treeNames = {
      inclusions: this.inclusions.childInstances.length ? getTreeName(this.inclusions) : '',
      exclusions: this.exclusions.childInstances.length ? getTreeName(this.exclusions) : ''
    };

    return ejs.render(fs.readFileSync(`${templatePath}/IncludeExclude`, 'utf-8'), treeNames);
  }

  recommendation() {
    let text = this.recommendations.map((recommendation, index) => {
      let conditional = constructOneRecommendationConditional(recommendation);
      let comment = constructComment(recommendation.comment);
      let text = sanitizeCQLString(recommendation.text);
      if (index > 0) {
        conditional = 'else ' + conditional;
      }
      return { comment: comment, conditional: conditional, text: text };
    });
    return ejs.render(templateMap.RecommendationTemplate, {
      element_name: 'Recommendation',
      recs: text
    });
  }

  rationale() {
    let rationaleText = this.recommendations.map(recommendation => {
      const conditional = constructOneRecommendationConditional(recommendation);
      return (
        conditional +
        (_.isEmpty(recommendation.rationale) ? 'null' : `'${sanitizeCQLString(recommendation.rationale)}'`)
      );
    });
    rationaleText = _.isEmpty(rationaleText) ? 'null' : rationaleText.join('\n  else ').concat('\n  else null');
    return ejs.render(templateMap.BaseTemplate, {
      element_name: 'Rationale',
      cqlString: rationaleText
    });
  }

  links() {
    let linksText = this.recommendations.map(recommendation => {
      const conditional = constructOneRecommendationConditional(recommendation);
      return conditional + (_.isEmpty(recommendation.links) ? 'null' : constructLinks(recommendation.links));
    });
    linksText = _.isEmpty(linksText) ? 'null' : linksText.join('\n  else ').concat('\n  else null');
    return ejs.render(templateMap.BaseTemplate, {
      element_name: 'Links',
      cqlString: linksText
    });
  }

  /*
    this function handles a condition in which the error statement is notionally null, but isn't exactly null
    if this function returns true,  the cql generated will be:
    define "Errors":
      null
  */
  isErrorEmpty(errorStatement) {
    let retVal = false;
    let firstIfThenClause = errorStatement.ifThenClauses[0];
    if (
      _.isEmpty(firstIfThenClause.ifCondition.label) &&
      _.isEmpty(firstIfThenClause.statements) &&
      _.isEmpty(firstIfThenClause.thenClause) &&
      _.isEmpty(errorStatement.elseClause)
    ) {
      retVal = true;
    }
    return retVal;
  }

  errors() {
    return ejs.render(templateMap.ErrorStatements, {
      element_name: 'Errors',
      errorStatement: this.errorStatement
    });
  }

  // Produces the cql in string format
  toString() {
    // Create the header after the body because elements in the body can add new value sets and codes to be used.
    const bodyString = this.body();
    const headerString = this.header();
    let fullString =
      `${headerString}${bodyString}\n${this.population()}\n${this.recommendation()}\n` +
      `${this.rationale()}\n${this.links()}\n${this.errors()}`;
    fullString = fullString.replace(/\r\n|\r|\n/g, '\r\n'); // Make all line endings CRLF
    return fullString;
  }

  // Return a cql file as a json object
  toJson() {
    return {
      name: this.name,
      version: this.version,
      filename: this.name,
      text: this.toString(),
      type: 'text/plain'
    };
  }
}

// Replaces all instances of `'` in the string with the escaped `\'` - Might be expanded in the future
function sanitizeCQLString(cqlString) {
  return _.replace(cqlString, /'/g, "\\'");
}

// Recurse down the tree of a modifier built in the query builder
function checkRules(
  rule,
  value_name,
  inputType,
  codeSystemMap,
  codeMap,
  conceptMap,
  resourceMap,
  isRoot = false,
  isFirstModifier = false
) {
  // Leaf node
  // TODO: Refactor to remove use of rule.ruleType.  We support it for now mainly because all
  // of the operator template tests assume rule.ruleType and many of them are already in flight
  // in other PRs.  So for now, the code supports either way: rule.operator or rule.ruleType.
  if (rule.operator && rule.operator.id) {
    rule.ruleType = rule.operator.id;
  }
  if (rule.ruleType) {
    const operator = queryResources.operators.operators.find(op => op.id === rule.ruleType);
    if (!operator) {
      console.error(`Operator could not be found for rule: ${rule.ruleType}`);
      return;
    }
    const ruleToRender = ruleMap[operator.operatorTemplate];
    if (!operator.operatorTemplate) {
      console.error(`No template found for operator: ${operator.name}`);
      return;
    }
    let resources;
    switch (fhirTarget.version) {
      case '1.0.2':
        resources = queryResources.dstu2_resources.resources;
        break;
      case '3.0.0':
        resources = queryResources.stu3_resources.resources;
        break;
      default:
        resources = queryResources.r4_resources.resources;
        break;
    }
    const inputTypeResource = queryResourceMap[inputType];
    const resource = resources.find(
      r => r.name === inputTypeResource || (r.name === 'MedicationOrder' && inputTypeResource === 'MedicationRequest')
    );

    let resourceProperty = rule.resourceProperty;
    let resourcePropertyInfo = resource.properties.find(p => p.name === resourceProperty);
    let typeSpecifier;
    if (resourcePropertyInfo != null) {
      typeSpecifier = resourcePropertyInfo.typeSpecifier;
    } else {
      // It's a choice type, so get the typeSpecifier from the specific choice
      const choiceProperties = resource.properties.filter(p => p.typeSpecifier.type === 'ChoiceTypeSpecifier');
      for (const p of choiceProperties) {
        const matchingChoice = p.typeSpecifier.elementType.find(c => c.name === resourceProperty);
        if (matchingChoice) {
          typeSpecifier = matchingChoice.typeSpecifier;
          // Choice types need to be cast in STU3/R4
          if (fhirTarget.version !== '1.0.2') {
            resourceProperty = `${p.name} as ${typeSpecifier.elementType}`;
          }
          resourcePropertyInfo = p;
          break;
        }
      }
    }

    // Handle codes that need to be added to the top of the CQL file
    const concepts = [];
    // First: User-specified concepts (w/ arbitrary systems)
    if (rule.conceptValue || rule.conceptValues) {
      const conceptValues = rule.conceptValues || [rule.conceptValue];
      const codes = conceptValues.map(c => {
        return { code: c.code, codeSystem: { name: c.system, id: c.uri }, display: c.display };
      });
      buildConceptObjectForCodes(codes, concepts);
    }
    // Then predefined concepts w/ predefined systems
    if (
      rule.codeValue &&
      resourcePropertyInfo &&
      resourcePropertyInfo.predefinedSystem &&
      typeSpecifier.elementType !== 'FHIR.code'
    ) {
      const codes = rule.codeValue.map(c => {
        return {
          code: c,
          codeSystem: {
            name: resourcePropertyInfo.predefinedSystem.name,
            id: resourcePropertyInfo.predefinedSystem.url
          },
          // convert codes like social-history to "Social History" and entered-in-error to "Entered in Error"
          display: c
            .split('-')
            .map(s => (s !== 'in' ? _.upperFirst(s) : s))
            .join(' ')
        };
      });
      buildConceptObjectForCodes(codes, concepts);
    }
    // Then add the concepts to the CQL document and collect the concept names (in case they changed)
    const codeNames = concepts.map(concept => addConcepts(concept, codeSystemMap, codeMap, conceptMap).name);
    // Handle ValueSets that need to be added at the top of the CQL file
    if (rule.valueset) {
      rule.valueset.name = `${rule.valueset.name.replace(/"/g, '\\"')} VS`;
      const count = getCountForUniqueExpressionName(rule.valueset, resourceMap, 'name', 'oid');
      if (count > 0) {
        rule.valueset.name = `${rule.valueset.name}_${count}`;
      }
      resourceMap.set(rule.valueset.name, rule.valueset);
    }

    return ejs.render(ruleToRender, {
      ...rule,
      value_name,
      resourceProperty,
      typeSpecifier,
      codeNames
    });
  }

  // Conjunction at root level
  if (isRoot) {
    const alias = queryAliasMap[inputType] || 'ALIAS';
    const statements = rule.rules.map(r =>
      checkRules(r, alias, inputType, codeSystemMap, codeMap, conceptMap, resourceMap)
    );
    return ejs.render(ruleMap['RootTemplate'], {
      value_name,
      alias,
      isFirstModifier,
      statements,
      conjunctionType: rule.conjunctionType
    });
  }

  // Conjunction within tree
  const statements = rule.rules.map(r =>
    checkRules(r, value_name, inputType, codeSystemMap, codeMap, conceptMap, resourceMap)
  );
  return ejs.render(ruleMap['GroupTemplate'], { statements, conjunctionType: rule.conjunctionType });
}

// Both parameters are arrays. All modifiers will be applied to all values, and joined with "\n or".
function applyModifiers(values = [], modifiers = []) {
  // default modifiers to []
  return values
    .map(value => {
      let newValue = value;
      modifiers.forEach((modifier, index) => {
        // Is a modifier built in the query builder
        if (modifier.where) {
          // A query builder modifier will always have exactly one input type
          const inputType = modifier.inputTypes[0];
          newValue = checkRules(
            modifier.where,
            newValue,
            inputType,
            this.codeSystemMap,
            this.codeMap,
            this.conceptMap,
            this.resourceMap,
            modifier.returnType,
            index === 0
          );
        } else {
          if (fhirTarget.version.startsWith('1.0.')) {
            if (modifier.id === 'ActiveMedicationRequest') modifier.cqlLibraryFunction = 'C3F.ActiveMedicationOrder';
            if (modifier.id === 'LookBackMedicationRequest')
              modifier.cqlLibraryFunction = 'C3F.MedicationOrderLookBack';
          }
          if (!modifier.cqlLibraryFunction && modifier.values && modifier.values.templateName) {
            modifier.cqlLibraryFunction = modifier.values.templateName;
          }
          let modifierContext = {
            cqlLibraryFunction: modifier.cqlLibraryFunction,
            value_name: newValue,
            values: { value: null }
          };
          if (modifier.values && modifier.type === 'ExternalModifier') {
            modifier.values.value.forEach(value => {
              let system = _.get(value, 'system', '').replace(/'/g, "\\'");
              let uri = _.get(value, 'uri', '').replace(/'/g, "\\'");
              if (system && uri) {
                this.codeSystemMap.set(system, { name: system, id: uri });
              }
            });
          }
          // Modifiers that add new value sets, will have a valueSet attribute on values.
          if (modifier.values && modifier.values.valueSet) {
            modifier.values.valueSet.name = `${modifier.values.valueSet.name.replace(/"/g, '\\"')} VS`;
            // Add the value set to the resourceMap to be included and referenced
            const count = getCountForUniqueExpressionName(modifier.values.valueSet, this.resourceMap, 'name', 'oid');
            if (count > 0) {
              modifier.values.valueSet.name = `${modifier.values.valueSet.name}_${count}`;
            }
            modifier.cqlTemplate = 'CheckInclusionInVS';
          }
          if (modifier.values && modifier.values.code) {
            let concepts = [];
            buildConceptObjectForCodes([modifier.values.code], concepts);
            concepts.forEach(concept => {
              modifier.values.code = addConcepts(concept, this.codeSystemMap, this.codeMap, this.conceptMap);
            });
            modifier.cqlTemplate = 'CheckEquivalenceToCode';
          }
          if (modifier.values) {
            if (modifier.values.unit) modifier.values.unit = modifier.values.unit.replace(/'/g, "\\'");
            if (modifier.values.value && Array.isArray(modifier.values.value)) {
              modifierContext.values = {
                value: modifier.values.value.map((value, index) => {
                  if (index === 0) return null;
                  if (value && value.argSource && value.selected) {
                    if (value.argSource === 'editor' && value.type) {
                      return getCQLValueString(value);
                    } else if (value.argSource === 'parameter' && value.elementName) {
                      return { ...value, str: `"${value.elementName}"` };
                    } else if (value.argSource === 'baseElement' && value.elementName) {
                      return { ...value, str: `"${value.elementName}"` };
                    } else if (value.argSource === 'externalCql' && value.elementName && value.elementType) {
                      return value.elementType === 'function' ? `${value.elementName}()` : value.elementName;
                    }
                  }
                  return null;
                })
              };
            } else modifierContext.values = modifier.values;
          }
          if (!(modifier.cqlTemplate in modifierMap)) {
            console.error(`Modifier Template could not be found: ${modifier.cqlTemplate}`);
          }
          newValue = ejs.render(modifierMap[modifier.cqlTemplate], modifierContext);
        }
      });
      return newValue;
    })
    .join('\n  or '); // consider using '\t' instead of spaces if desired
}

function constructOneRecommendationConditional(recommendation, text) {
  const conjunction = 'and'; // possible that this may become `or`, or some combo of the two conjunctions
  let conditionalText;
  if (!_.isEmpty(recommendation.subpopulations)) {
    conditionalText = recommendation.subpopulations
      .map(subpopulation => {
        if (subpopulation.special_subpopulationName) {
          return subpopulation.special_subpopulationName;
        }
        return subpopulation.subpopulationName ? `"${subpopulation.subpopulationName}"` : `"${subpopulation.uniqueId}"`;
      })
      .join(` ${conjunction} `);
  } else {
    conditionalText = '"InPopulation"'; // TODO: Is there a better way than hard-coding this?
  }
  return `if ${conditionalText} then `;
}

function constructLinks(links) {
  let linksText = '';
  if (!_.isEmpty(links)) {
    linksText = 'List{ ';
    linksText += links
      .map(link => {
        return (
          '{ label: ' +
          (link.label ? `'${sanitizeCQLString(link.label)}'` : "'Link'") +
          ', url: ' +
          (link.url ? `'${sanitizeCQLString(link.url)}'` : "'#'") +
          ', type: ' +
          (link.type ? `'${link.type}'` : "'absolute'") +
          ' }'
        );
      })
      .join(', ')
      .concat(' }');
  }
  return linksText;
}

function constructComment(comment) {
  let commentText = '';
  if (!_.isEmpty(comment)) {
    commentText = comment.split('\n').join('\n  //');
  }
  return commentText;
}
/**
 * Checks a map to see if an identical expression is being added. Adds new expressions with a unique name.
 *
 * @param {Object} expression The expression to add to the map, and subsequently the CQL.
 * @param {Map} map The map to add the expression to.
 * @param {string} nameKey The key of the expression object to check for a unique expression name.
 * @param {string} contentKey The key of the expression object that provides the content of an expression, used to
 * decide if the expression is indeed unique.
 * @return {number} The number that was appended to the expression if it was not unique.
 */
function getCountForUniqueExpressionName(expression, map, nameKey, contentKey, checkContent = true) {
  if (map.size > 0) {
    let newOID = true;
    let count = 0;
    let existingOID = 0;
    map.forEach((val, key) => {
      if (!key) return;
      const baseKeyArray = key.split('_');
      // Check if the last entry is a number, meaning _n was appended to account for nonunique expression names.
      const lastChar = baseKeyArray[baseKeyArray.length - 1];
      if (baseKeyArray.length > 1 && Number.isInteger(parseInt(lastChar))) {
        baseKeyArray.pop();
      }
      const baseKeyString = baseKeyArray.join('_'); // The original expression name
      if (_.isEqual(baseKeyString, expression[nameKey])) {
        // If the name and content of the expressions are the same, the same expression is being used.
        // Don't add it to the CQL.
        if (checkContent && _.isEqual(val[contentKey], expression[contentKey])) {
          newOID = false;
          existingOID = count;
        } else {
          // If the expression name has been used but the content is unique, increment the count to append to the name.
          count = count + 1;
        }
      }
    });
    if (newOID) {
      const cloneExpression = _.cloneDeep(expression);
      if (count > 0) {
        cloneExpression[nameKey] += `_${count}`;
      }
      map.set(cloneExpression[nameKey], cloneExpression);
      return count;
    }
    return existingOID;
  } else {
    map.set(expression[nameKey], expression);
    return 0;
  }
}

function addConcepts(concept, codeSystemMap, codeMap, conceptMap) {
  concept.codes.forEach(code => {
    // Add Code Systems
    const cs = code.codeSystem;
    const codeSystemCount = getCountForUniqueExpressionName(cs, codeSystemMap, 'name', 'id');
    if (codeSystemCount > 0) {
      cs.name = `${cs.name}_${codeSystemCount}`;
    }

    // Add individual codes
    const codeCount = getCountForUniqueExpressionName(code, codeMap, 'name', 'codeSystem');
    if (codeCount > 0) {
      code.name = `${code.name}_${codeCount}`;
    }
  });

  if (concept.codes.length !== 1) {
    // Only add concepts if more than one code in concept
    // Add concepts
    const conceptCount = getCountForUniqueExpressionName(concept, conceptMap, 'name', 'codes');
    if (conceptCount > 0) {
      concept.name = `${concept.name}_${conceptCount}`;
    }
  } else {
    // Make sure name referenced in later definitions is the code name, if only one code
    concept.name = concept.codes[0].name;
  }

  return concept;
}

function buildConceptObjectForCodes(codes, listOfConcepts) {
  if (codes) {
    codes.forEach(code => {
      if (!code.display) code.display = '';
      code.code = code.code.replace(/'/g, "\\'").replace(/"/g, '\\"');
      code.display = code.display.replace(/'/g, "\\'");
      // Qualifier modifier editor flattens out the typical codeSystem, so handle both formats of codes
      const system = code.codeSystem ? code.codeSystem.name : code.system;
      const uri = code.codeSystem ? code.codeSystem.id : code.uri;
      if (!code.codeSystem) {
        code.codeSystem = {};
      }
      code.codeSystem.id = uri.replace(/'/g, "\\'");
      code.codeSystem.name = system;
      // If the codeName variable is ever modified, make sure to update the templates
      // in api/src/data/cql/rules that use similar logic (such as codeConceptMatchesConcept)
      const codeName = code.display && code.display.length < 60 ? code.display.replace(/"/g, '\\"') : code.code;
      const concept = {
        name: `${code.codeSystem.name} ${code.code} Concept`,
        codes: [
          {
            name: `${codeName} code`,
            code: code.code,
            codeSystem: { name: code.codeSystem.name, id: code.codeSystem.id },
            display: code.display === '' ? `${code.codeSystem.name} ${code.code} Display` : code.display
          }
        ],
        display:
          code.display === ''
            ? `${code.codeSystem.name} ${code.code} Concept Display`
            : `${code.display} Concept Display`
      };
      listOfConcepts.push(concept);
    });
  }
}

function addValueSets(field, valueSetObject, attribute) {
  if (field && field.valueSets) {
    valueSetObject[attribute] = [];
    field.valueSets.forEach(vs => {
      valueSetObject[attribute].push({
        name: `${vs.name.replace(/"/g, '\\"')} VS`,
        oid: vs.oid
      });
    });
  }
}

function objToZippedCql(req, res) {
  objConvert(req, res, writeZip);
}

function objToViewableCql(req, res) {
  objConvert(req, res, writeCql);
}

function objToELM(req, res) {
  objConvert(req, res, validateELM);
}

function objConvert(req, res, callback) {
  if (req.user == null) {
    sendUnauthorized(res);
    return;
  }
  const user = req.user.uid;
  const artifactId = req.body._id;
  const artifactFromRequest = req.body;
  const includeCQL = req.query['includeCQL'] === 'true';
  artifactFromRequest.externalLibs = [];
  const externalLibs = [];
  // Add all external libraries
  CQLLibrary.find({ user: user, linkedArtifactId: { $ne: null, $eq: artifactId } })
    .exec()
    .then(libraries => {
      libraries.forEach(lib => {
        artifactFromRequest.externalLibs.push({
          name: lib.name,
          version: lib.version,
          alias: ''
        });
        const libJson = {
          filename: `${lib.name}`,
          version: lib.version,
          text: lib.details.cqlFileText,
          type: 'text/plain'
        };
        externalLibs.push(libJson);
      });
      const artifact = new CqlArtifact(artifactFromRequest);
      artifact._id = artifactId;
      const artifactJson = artifact.toJson();

      // Merge the artifact with the commons and conversions libraries
      const fhirVersion = fhirTarget.version || '4.0.1';
      const helperPath = path.join(__dirname, '..', 'data', 'library_helpers', 'CQLFiles', fhirVersion);
      const commonsPath = path.join(
        helperPath,
        `AT_Internal_CDS_Connect_Commons_for_FHIRv${fhirVersion.replace(/\./g, '')}.cql`
      );
      const conversionsPath = path.join(helperPath, 'AT_Internal_CDS_Connect_Conversions.cql');
      const artifactRaw = new RawCQL(artifactJson.text);
      const commonsRaw = new RawCQL(fs.readFileSync(commonsPath, 'utf-8'));
      const conversionsRaw = new RawCQL(fs.readFileSync(conversionsPath, 'utf-8'));
      const libraryGroup = importCQL(artifactRaw, [commonsRaw, conversionsRaw]);
      // Reassigning the text field of the artifactJson is safe, since it makes no
      // changes to the original CqlArtifact instance, and no other fields in the
      // artifactJson are affected by the merge operation here.
      artifactJson.text = exportCQL(libraryGroup);

      // Attempt to reformat the primary CQL library if CQL Formatter is active
      if (config.get('cqlFormatter.active')) {
        // NOTE: using module.exports prefix to allow for mocking formatCQL in tests
        module.exports.formatCQL(artifactJson.text, (err, formattedCQL) => {
          // Sanity check: only replace the CQL if no errors and it starts with "library";
          // Otherwise just ignore the error since formatting isn't critical.
          if (err == null && formattedCQL != null && /^library/.test(formattedCQL)) {
            artifactJson.text = formattedCQL;
          }
          callback(artifact, artifactJson, externalLibs, includeCQL, res, err => {
            if (err) {
              res.status(500).send({ error: err.message });
            }
          });
        });
      } else {
        // Skip reformatting the CQL
        callback(artifact, artifactJson, externalLibs, includeCQL, res, err => {
          if (err) {
            res.status(500).send({ error: err.message });
          }
        });
      }
    })
    .catch(err => {
      res.status(500).send({ error: err.message });
    });
}

// While the artifact argument is not used, it's required because the callback
// that calls this function requires that argument to be present
function validateELM(artifact, artifactJson, externalLibs, includeCQL, writeStream, callback) {
  const artifacts = [artifactJson, ...externalLibs];
  convertToElm(artifacts, false, (err, elmFiles) => {
    if (err) {
      callback(err);
      return;
    }
    let elmErrors = [];
    elmFiles.forEach(e => {
      const annotations = JSON.parse(e.content).library.annotation;
      if (Array.isArray(annotations)) {
        // Only return true errors (not warnings)
        const fileErrors = annotations.filter(a => a.errorSeverity === 'error');
        if (fileErrors.length) {
          elmErrors = elmErrors.concat(fileErrors);
        }
      }
    });
    if (includeCQL) {
      // Include CQL text along with the ELM
      // TODO: Also include any libraries
      let cqlFiles = artifacts.map(artifact => {
        return { name: artifact.name || artifact.filename, text: artifact.text };
      });
      writeStream.json({ elmFiles, elmErrors, cqlFiles });
    } else {
      writeStream.json({ elmFiles, elmErrors });
    }
  });
}

//given a CQLArtifact, find the associated Artifact in the DB, convert it to a CPG Publishable Library
async function convertToCPGPL(cqlArtifact, cqlText) {
  try {
    const artifact = await Artifact.findOne({ _id: { $ne: null, $eq: cqlArtifact._id } }).exec();
    let cpg = artifact.toPublishableLibrary();
    let cqlBuffer = Buffer.from(cqlText);
    cpg['content'] = [
      {
        contentType: 'application/cql',
        data: cqlBuffer.toString('base64')
      }
    ];
    return JSON.stringify(cpg, null, 2);
  } catch (err) {
    return { error: err };
  }
}

// Note: This callback ignores an argument (via a _ placeholder) specifying whether CQL should be included
// since it always includes CQL
function writeZip(artifact, artifactJson, externalLibs, _, writeStream, callback /* (error) */) {
  const artifacts = [artifactJson, ...externalLibs];
  // convert the artifact to a CPG Publishable Library, passing in the text directly (since it was likely modified)
  convertToCPGPL(artifact, artifactJson.text).then(function (cpgString) {
    // We must first convert to ELM before packaging up
    convertToElm(artifacts, true, (err, elmFiles) => {
      if (err) {
        callback(err);
        return;
      }
      // Now build the zip, piping it to the writestream
      writeStream.attachment('archive-name.zip');
      const archive = archiver('zip', { zlib: { level: 9 } }).on('error', callback);
      writeStream.on('close', callback);
      archive.pipe(writeStream);

      externalLibs.forEach(externalLib => {
        archive.append(externalLib.text, {
          name: `${externalLib.filename}.cql`
        });
      });
      if (typeof cpgString === 'string') {
        archive.append(cpgString, {
          name: `Library-${artifactJson.filename}.json`
        });
      } else {
        console.log('Error with CPG Publishable library: ' + cpgString['error']);
      }
      archive.append(artifactJson.text, {
        name: `${artifactJson.filename}.cql`
      });
      elmFiles.forEach(e => {
        archive.append(e.content.replace(/\r\n|\r|\n/g, '\r\n'), {
          name: e.content.startsWith('<') ? `${e.name}.xml` : `${e.name}.json`
        });
      });

      const helperPath = path.join(
        __dirname,
        '..',
        'data',
        'library_helpers',
        'CQLFiles',
        fhirTarget.version || '4.0.1'
      );
      archive.glob('FHIRHelpers.cql', { cwd: helperPath });
      archive.finalize();
    });
  });
}

// Note: This callback ignores an argument (via a _ placeholder) specifying whether CQL should be included
// since it always includes CQL
function writeCql(artifact, artifactJson, externalLibs, _, writeStream, callback /* (error) */) {
  const artifacts = [artifactJson, ...externalLibs];
  let cqlFiles = artifacts.map(artifact => {
    return { name: artifact.name || artifact.filename, text: artifact.text };
  });
  writeStream.json({ cqlFiles });
}

function convertToElm(artifacts, getXML, callback /* (error, elmFiles) */) {
  // If CQL-to-ELM is disabled, this function should basically be a no-op
  if (!config.get('cqlToElm.active')) {
    callback(null, []);
    return;
  }

  // Load all the supplementary CQL files, open file streams to them, and convert to ELM
  const helperPath = path.join(__dirname, '..', 'data', 'library_helpers', 'CQLFiles', fhirTarget.version || '4.0.1');
  const fileStream = fs.createReadStream(`${helperPath}/FHIRHelpers.cql`);
  // NOTE: using module.exports prefix to allow for mocking makeCQLtoELMRequest in tests
  module.exports.makeCQLtoELMRequest(artifacts, [fileStream], getXML, callback);
}

function makeCQLtoELMRequest(files, fileStreams, getXML, callback) {
  // Request endpoint query parameters are being updated according to CPG guidance
  // http://hl7.org/fhir/uv/cpg/STU1/libraries.html#translation-to-elm
  const requestParams = [
    'annotations=true',
    'locators=true',
    'disable-list-demotion=true',
    'disable-list-promotion=true',
    'disable-method-invocation=true',
    'date-range-optimization=true',
    'result-types=true',
    'detailed-errors=false',
    'disable-list-traversal=false',
    'signatures=All'
  ];
  const url = `${config.get('cqlToElm.url')}?${requestParams.join('&')}`;
  const options = {};
  if (getXML) {
    options.headers = {
      'X-TargetFormat': 'application/elm+json,application/elm+xml'
    };
  }
  const form = new FormData();
  if (files) {
    files.forEach(file => {
      form.append(file.filename, file.text, {
        filename: file.filename,
        contentType: file.type
      });
    });
  }
  if (fileStreams) {
    fileStreams.forEach(f => {
      form.append(path.basename(f.path, '.cql'), f);
    });
  }

  axios
    .post(url, form, options)
    .then(res => {
      const contentType = res.headers['Content-Type'] || res.headers['content-type'];
      // The body is multi-part containing an ELM file in each part, so we need to split it
      splitELM(res.data, contentType, callback);
    })
    .catch(err => {
      if (err.response?.status && err.response.status !== 200 && err.response.data) {
        callback(new Error(err.response.data));
      } else {
        callback(err);
      }
    });
}

function splitELM(body, contentType, callback /* (error, elmFiles) */) {
  // Because ELM comes back as a multipart response we use busboy to split it up
  const elmFiles = [];

  let bb;
  try {
    bb = busboy({ headers: { 'content-type': contentType } });
  } catch (err) {
    callback(err);
    return;
  }
  bb.on('field', (fieldname, val) => {
    elmFiles.push({ name: fieldname, content: val });
  })
    .on('finish', () => {
      callback(null, elmFiles);
    })
    .on('error', err => {
      callback(err);
    });
  bb.end(body);
}

function formatCQL(cqlText, callback) {
  const url = config.get('cqlFormatter.url');
  const options = {
    headers: { 'Content-Type': 'application/cql', Accept: 'application/cql' }
  };

  axios
    .post(url, cqlText, options)
    .then(res => {
      callback(null, res.data);
    })
    .catch(err => {
      if (err.response?.status && err.response.status !== 200 && err.response.data) {
        callback(new Error(err.response.data));
      } else {
        callback(err);
      }
    });
}

function buildCQL(artifactBody) {
  return new CqlArtifact(artifactBody);
}
