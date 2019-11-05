const config = require('../config');
const Artifact = require('../models/artifact');
const CQLLibrary = require('../models/cqlLibrary');
const _ = require('lodash');
const slug = require('slug');
const ejs = require('ejs');
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const glob = require('glob');
const request = require('request');
const Busboy = require('busboy');

const templatePath = './data/cql/templates';
const specificPath = './data/cql/specificTemplates';
const modifierPath = './data/cql/modifiers';
const artifactPath = './data/cql/artifact.ejs';
const specificMap = loadTemplates(specificPath);
const templateMap = loadTemplates(templatePath);
const modifierMap = loadTemplates(modifierPath);
// Each library will be included. Aliases are optional.
const includeLibrariesDstu2 = [
  { name: 'FHIRHelpers', version: '1.0.2', alias: 'FHIRHelpers' },
  { name: 'CDS_Connect_Commons_for_FHIRv102', version: '1.3.2', alias: 'C3F' },
  { name: 'CDS_Connect_Conversions', version: '1', alias: 'Convert' }
];

const includeLibrariesStu3 = [
  { name: 'FHIRHelpers', version: '3.0.0', alias: 'FHIRHelpers' },
  { name: 'CDS_Connect_Commons_for_FHIRv300', version: '1.0.1', alias: 'C3F' },
  { name: 'CDS_Connect_Conversions', version: '1', alias: 'Convert' }
];

// A flag to hold the FHIR version, so that it can be used
// in functions external to the artifact.
let fhirTarget;

module.exports = {
  objToCql,
  objToELM,
  makeCQLtoELMRequest,
  idToObj,
  writeZip,
  buildCQL
};

function getFieldWithType(fields, type) {
  return fields.find(f => f.type.endsWith(type));
}

function getFieldWithId(fields, id) {
  return fields.find(f => f.id === id);
}

// Creates the cql file from an artifact ID
function idToObj(req, res, next) {
  Artifact.findOne({ _id: req.params.artifact },
    (error, artifact) => {
      if (error) console.log(error);
      else {
        req.body = artifact;
        next();
      }
    }
  );
}

function loadTemplates(pathToTemplates) {
  const templates = {};
  // Loop through all the files in the temp directory
  fs.readdir(pathToTemplates, (err, files) => {
    if (err) { console.error('Could not list the directory.', err); }

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
  }
  unionedElementsList.push(expressionToUnion);
  context.values = [ `"${uniqueName}"` ];
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
  const multipleValueSetExpression = createMultipleValueSetExpression(uniqueName,
    valuesets.valuesets,
    type);
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
  const multipleConceptExpression = createMultipleConceptExpression(uniqueName,
    valuesets.concepts,
    type);
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
    this.name = slug(artifact.name ? artifact.name : 'untitled');
    this.version = artifact.version ? artifact.version : 1;
    this.dataModel = artifact.dataModel;
    this.includeLibraries = (artifact.dataModel.version === '3.0.0') ? includeLibrariesStu3 : includeLibrariesDstu2;
    this.includeLibraries = this.includeLibraries.concat(artifact.externalLibs || []);
    this.context = artifact.context ? artifact.context : 'Patient';
    this.inclusions = artifact.expTreeInclude;
    this.parameters = artifact.parameters;
    this.exclusions = artifact.expTreeExclude;
    this.subpopulations = artifact.subpopulations;
    this.baseElements = artifact.baseElements;
    this.recommendations = artifact.recommendations;
    this.errorStatement = artifact.errorStatement;

    fhirTarget = artifact.dataModel;

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

    this.parameters.forEach((parameter) => {
      const count = getCountForUniqueExpressionName(parameter, this.names, 'name', '', false);
      if (count > 0) {
        parameter.name = `${parameter.name}_${count}`;
      }
      if (parameter.value && parameter.value.unit) {
        parameter.value.unit = parameter.value.unit.replace(/'/g, '\\\'');
      }

      if (parameter.type === "system_code" || parameter.type === "system_concept") {
        let system = _.get(parameter, 'value.system', '').replace(/'/g, '\\\'');
        let uri = _.get(parameter, 'value.uri', '').replace(/'/g, '\\\'');
        if (system && uri) { this.codeSystemMap.set(system, { name: system, id: uri }); }
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
      }

      parameter.type = parameterTypeMap[parameter.type];
    });

    this.baseElements.forEach((baseElement) => {
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
      if ((!(isBaseElementUseAndUnchanged || isParameterUseAndUnchanged)) && count > 0) {
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

    if (this.inclusions.childInstances.length) { this.parseTree(this.inclusions); }
    if (this.exclusions.childInstances.length) { this.parseTree(this.exclusions); }
    this.subpopulations.forEach((subpopulation) => {
      const count = getCountForUniqueExpressionName(subpopulation, this.names, 'subpopulationName', '', false);
      if (count > 0) {
        // Update subpopulation's name and the other references to it
        subpopulation.subpopulationName = `${subpopulation.subpopulationName}_${count}`;
        this.checkOtherUses(subpopulation.subpopulationName, subpopulation.uniqueId);
      }
      if (!subpopulation.special) { // `Doesn't Meet Inclusion Criteria` and `Meets Exclusion Criteria` are special
        if (subpopulation.childInstances.length) { this.parseTree(subpopulation); }
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
    this.errorStatement.statements.forEach(errorStatement => {
      if (errorStatement.condition.uniqueId === id) {
        errorStatement.condition.value = `"${name}"`;
      }
      if (errorStatement.child) {
        errorStatement.child.statements.forEach(childStatement => {
          if (childStatement.condition.uniqueId === id) {
            childStatement.condition.value = `"${name}"`;
          }
        })
      }
    });
  }

  setFieldContexts(elementDetails, valuesetQueryName, context) {
    if (elementDetails.concepts.length > 0) {
      const values = [];
      elementDetails.concepts.forEach((concept) => {
        const conceptAdded = addConcepts(concept, this.codeSystemMap, this.codeMap, this.conceptMap);
        values.push(conceptAdded.name);
      });
      // Union multiple codes together.
      if (values.length > 1) {
        addGroupedConceptExpression(
          this.referencedConceptElements, this.resourceMap, elementDetails, valuesetQueryName, context);
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
          this.referencedElements, this.resourceMap, elementDetails, valuesetQueryName, context);
        context.template = 'GenericStatement';
        if (concepts.length > 0) {
          // If there is one concept, check to see if it is already a referenced/grouped element.
          if (concepts.length === 1 && !this.referencedConceptElements.find( el => `"${el.name}"` === concepts[0])) {
            addGroupedConceptExpression(
              this.referencedConceptElements, this.resourceMap,elementDetails, valuesetQueryName, context);
          } else {
            context.values = context.values.concat(concepts);
          }
          // If both value sets and concepts are applied, union the individual expression together to create valid CQL
          unionExpressions(context, elementDetails.id, this.unionedElements);
        }
      } else { // elementDetails.valuesets.length = 1;
        if (concepts.length > 0) {
          addGroupedValueSetExpression(
            this.referencedElements, this.resourceMap, elementDetails, valuesetQueryName, context);
          // If there is one concept, check to see if it is already a referenced/grouped element.
          if (concepts.length === 1 && !this.referencedConceptElements.find( el => `"${el.name}"` === concepts[0])) {
            addGroupedConceptExpression(
              this.referencedConceptElements, this.resourceMap, elementDetails, valuesetQueryName, context);
          } else {
            // If concepts were already unioned, just add the variable to reference.
            context.values = context.values.concat(concepts);
          }
          // If both value sets and concepts are applied, union the individual expression together to create valid CQL
          unionExpressions(context, elementDetails.id, this.unionedElements);
          context.template = 'GenericStatement';
        } else {
          context.values = elementDetails.valuesets.map((vs) => {
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
    children.forEach((child) => {
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
    conjunction.assumeInPopulation = this.recommendations.some(recommendation => (
      recommendation.subpopulations.some(subpopref => (
        subpopref.subpopulationName === element.subpopulationName
      ))
    ));
    const name = getFieldWithId(element.fields, 'element_name').value;
    conjunction.element_name = (name || element.subpopulationName || element.uniqueId);
    (element.childInstances || []).forEach((child) => {
      const childNameField = getFieldWithId(child.fields, 'element_name');
      let childName = (childNameField||{}).value || child.uniqueId;
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
      conjunction.components.push({ name: childName });
    });
    this.conjunction_main.push(conjunction);
    return element;
  }

  parseParameter(element) {
    const context = {};
    element.fields.forEach((field) => {
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
      context.template = (element.template) ? element.template : element.extends;
    } else {
      context.template = (element.template || element.id);
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
    element.fields.forEach((field) => {
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
          }
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
        case 'medicationOrder_vsac': {
          const medicationOrderValueSets = {
            id: 'generic_medication_order',
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(field.codes, medicationOrderValueSets.concepts);
          addValueSets(field, medicationOrderValueSets, 'valuesets');
          if (fhirTarget.version === '3.0.0') {
            this.setFieldContexts(medicationOrderValueSets, 'MedicationRequest', context);
          } else {
            this.setFieldContexts(medicationOrderValueSets, 'MedicationOrder', context);
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
        case 'allergyIntolerance_vsac' : {
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
        case 'reference': {
          // Need to pull the element name from the reference to support renaming the elements while being used.
          if (field.id === 'parameterReference') {
            const referencedParameter = this.parameters.find(p => p.uniqueId === field.value.id);
            const referencedParameterName = referencedParameter.name || referencedParameter.uniqueId;
            context.values = [ `"${referencedParameterName}"` ];
          } else if (field.id === 'baseElementReference') {
            const referencedElement = this.baseElements.find(e => e.uniqueId === field.value.id);
            const referencedElementName =
              getFieldWithId(referencedElement.fields, 'element_name').value || referencedElement.uniqueId;
            context.values = [ `"${referencedElementName}"` ];
          } else if (field.id === 'externalCqlReference') {
            context.values = [`"${field.value.library}"."${field.value.element}"` ];
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
    context.element_name = (context.element_name || element.uniqueId);
    // If it is an unchanged base element or parameter, don't add to context
    if (!(element.type === 'baseElement' && !isBaseElementUseChanged(element, this.baseElements))
    && !(element.type === 'parameter' && !isParameterUseChanged(element, this.parameters))) {
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
    return expressions.map((context) => {
      if (fhirTarget.version === '3.0.0') {
        if (context.template === 'GenericMedicationOrder') context.template = 'GenericMedicationRequest';
        if (context.template === 'MedicationOrdersByConcept') context.template = 'MedicationRequestsByConcept';
      }
      if (context.withoutModifiers || context.components) {
        return ejs.render(specificMap[context.template], context);
      }
      if (!(context.template in templateMap)) console.error(`Template could not be found: ${context.template}`);
      if (_.isEqual(context.values, [])) {
        context.values[0] = ejs.render(templateMap[context.template], { element_context: '' });
      } else {
        (context.values || []).forEach((value, index) => {
          context.values[index] = ejs.render(templateMap[context.template], { element_context: value });
        });
      }
      const cqlString = applyModifiers.call(this, context.values, context.modifiers);
      return ejs.render(
        templateMap.BaseTemplate,
        { comment: context.comment, element_name: context.element_name, cqlString }
      );
    }).join('\n');
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
    let text = this.recommendations.map((recommendation) => {
      const conditional = constructOneRecommendationConditional(recommendation);
      return `${conditional}'${sanitizeCQLString(recommendation.text)}'`;
    });
    text = _.isEmpty(text) ? 'null' : text.join('\n  else ').concat('\n  else null');
    return ejs.render(templateMap.BaseTemplate, { element_name: 'Recommendation', cqlString: text });
  }

  rationale() {
    let rationaleText = this.recommendations.map((recommendation) => {
      const conditional = constructOneRecommendationConditional(recommendation);
      return conditional + (_.isEmpty(recommendation.rationale)
        ? 'null'
        : `'${sanitizeCQLString(recommendation.rationale)}'`);
    });
    rationaleText = _.isEmpty(rationaleText) ? 'null' : rationaleText.join('\n  else ').concat('\n  else null');
    return ejs.render(templateMap.BaseTemplate, { element_name: 'Rationale', cqlString: rationaleText });
  }

  errors() {
    this.errorStatement.statements.forEach((statement, index) => {
      this.errorStatement.statements[index].condition.label = sanitizeCQLString(statement.condition.label);
      if (statement.useThenClause) {
        this.errorStatement.statements[index].thenClause = sanitizeCQLString(statement.thenClause);
      } else {
        const errStatementChild = this.errorStatement.statements[index].child;
        statement.child.statements.forEach((childStatement, childIndex) => {
          errStatementChild.statements[childIndex].condition.label = sanitizeCQLString(childStatement.condition.label);
          errStatementChild.statements[childIndex].thenClause = sanitizeCQLString(childStatement.thenClause);
        });
        const noElseClause = _.isEmpty(statement.child.elseClause) || statement.child.elseClause === 'null';
        errStatementChild.elseClause = noElseClause ? null : sanitizeCQLString(statement.child.elseClause);
      }
    });
    this.errorStatement.elseClause =
      _.isEmpty(this.errorStatement.elseClause) ? null : sanitizeCQLString(this.errorStatement.elseClause);
    return ejs.render(templateMap.ErrorStatements, { element_name: 'Errors', errorStatement: this.errorStatement });
  }

  // Produces the cql in string format
  toString() {
    // Create the header after the body because elements in the body can add new value sets and codes to be used.
    const bodyString = this.body();
    const headerString = this.header();
    let fullString = `${headerString}${bodyString}\n${this.population()}\n${this.recommendation()}\n` +
      `${this.rationale()}${this.errors()}`;
    fullString = fullString.replace(/\r\n|\r|\n/g, '\r\n'); // Make all line endings CRLF
    return fullString;
  }

  // Return a cql file as a json object
  toJson() {
    return {
      name: this.name,
      version: this.version,
      filename: `${this.name}-v${this.version}`,
      text: this.toString(),
      type: 'text/plain'
    };
  }
}

// Replaces all instances of `'` in the string with the escaped `\'` - Might be expanded in the future
function sanitizeCQLString(cqlString) {
  return _.replace(cqlString, /'/g, '\\\'');
}

// Both parameters are arrays. All modifiers will be applied to all values, and joined with "\n or".
function applyModifiers(values = [] , modifiers = []) { // default modifiers to []
  return values.map((value) => {
    let newValue = value;
    modifiers.forEach((modifier) => {
      if (fhirTarget.version === '3.0.0') {
        if (modifier.id === 'ActiveMedicationOrder') modifier.cqlLibraryFunction = 'C3F.ActiveMedicationRequest';
        if (modifier.id === 'LookBackMedicationOrder') modifier.cqlLibraryFunction = 'C3F.MedicationRequestLookBack';
      }
      if (!modifier.cqlLibraryFunction && modifier.values && modifier.values.templateName) {
        modifier.cqlLibraryFunction = modifier.values.templateName;
      }
      const modifierContext = { cqlLibraryFunction: modifier.cqlLibraryFunction, value_name: newValue };
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
        concepts.forEach((concept) => {
          modifier.values.code = addConcepts(concept, this.codeSystemMap, this.codeMap, this.conceptMap);
        });
        modifier.cqlTemplate = 'CheckEquivalenceToCode';
      }
      if (modifier.values) {
        if (modifier.values.unit) modifier.values.unit = modifier.values.unit.replace(/'/g, '\\\'');
        modifierContext.values = modifier.values; // Certain modifiers (such as lookback) require values, so provide them here
      }
      if (!(modifier.cqlTemplate in modifierMap)) {
        console.error(`Modifier Template could not be found: ${modifier.cqlTemplate}`);
      }
      newValue = ejs.render(modifierMap[modifier.cqlTemplate], modifierContext);
    });
    return newValue;
  }).join('\n  or '); // consider using '\t' instead of spaces if desired
}

function constructOneRecommendationConditional(recommendation, text) {
  const conjunction = 'and'; // possible that this may become `or`, or some combo of the two conjunctions
  let conditionalText;
  if (!_.isEmpty(recommendation.subpopulations)) {
    conditionalText = recommendation.subpopulations.map((subpopulation) => {
      if (subpopulation.special_subpopulationName) {
        return subpopulation.special_subpopulationName;
      }
      return subpopulation.subpopulationName ? `"${subpopulation.subpopulationName}"` : `"${subpopulation.uniqueId}"`;
    }).join(` ${conjunction} `);
  } else {
    conditionalText = '"InPopulation"'; // TODO: Is there a better way than hard-coding this?
  }
  return `if ${conditionalText} then `;
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
  concept.codes.forEach((code) => {

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

  if (concept.codes.length !== 1) { // Only add concepts if more than one code in concept
    // Add concepts
    const conceptCount = getCountForUniqueExpressionName(concept, conceptMap, 'name', 'codes');
    if (conceptCount > 0) {
      concept.name = `${concept.name}_${conceptCount}`;
    }
  } else { // Make sure name referenced in later definitions is the code name, if only one code
    concept.name = concept.codes[0].name;
  }

  return concept;
}

function buildConceptObjectForCodes(codes, listOfConcepts) {
  if (codes) {
    codes.forEach((code) => {
      if (!code.display) code.display = '';
      code.code = code.code.replace(/'/g, '\\\'').replace(/"/g, '\\"');
      code.display = code.display.replace(/'/g, '\\\'');
      code.codeSystem.id = code.codeSystem.id.replace(/'/g, '\\\'');
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
        display: code.display === '' ?
          `${code.codeSystem.name} ${code.code} Concept Display`
          : `${code.display} Concept Display`
      }
      listOfConcepts.push(concept);
    });
  }
}

function addValueSets(field, valueSetObject, attribute) {
  if (field && field.valueSets) {
    valueSetObject[attribute] = [];
    field.valueSets.forEach(vs => {
      valueSetObject[attribute].push({ name: `${vs.name.replace(/"/g, '\\"')} VS`, oid: vs.oid });
    });
  }
}

// Creates the cql file from an artifact object
function objToCql(req, res) {
  const user = req.user.uid;
  const artifactId = req.body._id;
  const artifactFromRequest = req.body;
  artifactFromRequest.externalLibs = [];
  const externalLibs = [];

  // Add all external libraries
  CQLLibrary.find({ user: user, linkedArtifactId: { $ne: null, $eq: artifactId } }, (error, libraries) => {
    if (error) res.status(500).send({ error: error.message });
    else {
      libraries.forEach(lib => {
        artifactFromRequest.externalLibs.push({ name: lib.name, version: lib.version, alias: '' });
        const libJson = {
          filename: `${lib.name}-v${lib.version}`,
          version: lib.version,
          text: lib.details.cqlFileText,
          type: 'text/plain'
        };
        externalLibs.push(libJson);
      });
      const artifact = new CqlArtifact(artifactFromRequest);
      res.attachment('archive-name.zip');
      writeZip(artifact, externalLibs, res, (err) => {
        if (err) {
          res.status(500).send({ error: err.message });
        }
      });
    }
  });
}

function objToELM(req, res) {
  const user = req.user.uid;
  const artifactId = req.body._id;
  const artifactFromRequest = req.body;
  artifactFromRequest.externalLibs = [];
  const externalLibs = [];

  // Add all external libraries
  CQLLibrary.find({ user: user, linkedArtifactId: { $ne: null, $eq: artifactId } }, (error, libraries) => {
    if (error) res.status(500).send({ error: error.message });
    else {
      libraries.forEach(lib => {
        artifactFromRequest.externalLibs.push({ name: lib.name, version: lib.version, alias: '' });
        const libJson = {
          filename: `${lib.name}-v${lib.version}`,
          version: lib.version,
          text: lib.details.cqlFileText,
          type: 'text/plain'
        };
        externalLibs.push(libJson);
      });
      const artifact = new CqlArtifact(artifactFromRequest);
      validateELM(artifact, externalLibs, res, (err) => {
        if (err) {
          res.status(500).send({ error: err.message });
        }
      });
    }
  });
}


function validateELM(cqlArtifact, externalLibs, writeStream, callback) {
  const artifactJSON = cqlArtifact.toJson();
  const artifacts = [artifactJSON, ...externalLibs];
  convertToElm(artifacts, (err, elmFiles) => {
    if(err) {
      callback(err);
      return;
    }
    let elmErrors = [];
    elmFiles.forEach((e) => {
      const annotations = JSON.parse(e.content).library.annotation;
      if (Array.isArray(annotations)) {
        // Only return true errors (not warnings)
        const fileErrors = annotations.filter(a => a.errorSeverity === 'error');
        if(fileErrors.length) {
          elmErrors = elmErrors.concat(fileErrors);
        }
      }
    });
    writeStream.json({elmFiles, elmErrors});
  });
}


function writeZip(cqlArtifact, externalLibs, writeStream, callback /* (error) */) {
  // Artifact JSON is generated first and passed in to avoid incorrect EJS rendering.
  // TODO: Consider separating EJS rendering from toJSON() or toString() methods.
  const artifactJson = cqlArtifact.toJson();
  const artifacts = [artifactJson, ...externalLibs];
  // We must first convert to ELM before packaging up
  convertToElm(artifacts, (err, elmFiles) => {
    if (err) {
      callback(err);
      return;
    }
    // Now build the zip, piping it to the writestream
    const archive = archiver('zip', { zlib: { level: 9 } })
      .on('error', callback);
    writeStream.on('close', callback);
    archive.pipe(writeStream);
    externalLibs.forEach(artifact => {
      archive.append(artifact.text, { name: `${artifact.filename}.cql` });
    });
    archive.append(artifactJson.text, { name: `${artifactJson.filename}.cql` });
    elmFiles.forEach((e, i) => {
      archive.append(e.content.replace(/\r\n|\r|\n/g, '\r\n'), { name: `${e.name}.json` });
    });
    let helperPath;
    if (fhirTarget.version === '3.0.0') {
      helperPath = `${__dirname}/../data/library_helpers/CQLFiles/STU3`;
    } else {
      helperPath = `${__dirname}/../data/library_helpers/CQLFiles/DSTU2`;
    }
    archive.directory(helperPath, '/');
    archive.finalize();
  });
}

function convertToElm(artifacts, callback /* (error, elmFiles) */) {
  // If CQL-to-ELM is disabled, this function should basically be a no-op
  if (!config.get('cqlToElm.active')) {
    callback(null, []);
    return;
  }

  // Load all the supplementary CQL files, open file streams to them, and convert to ELM
  let helperPath;
  if (fhirTarget.version === '3.0.0') {
    helperPath = `${__dirname}/../data/library_helpers/CQLFiles/STU3`;
  } else {
    helperPath = `${__dirname}/../data/library_helpers/CQLFiles/DSTU2`;
  }
  glob(`${helperPath}/*.cql`, (err, files) => {
    if (err) {
      callback(err);
      return;
    }

    const fileStreams = files.map(f => fs.createReadStream(f));
    makeCQLtoELMRequest(artifacts, fileStreams, callback);
  });
}

function makeCQLtoELMRequest(files, fileStreams, callback) {
  const requestEndpoint = `${config.get('cqlToElm.url')}?result-types=true&signatures=All`;
  // NOTE: the request isn't posted until the next event loop, so we can modify it after calling request.post
  const cqlReq = request.post(requestEndpoint, (err2, resp, body) => {
    if (err2) {
      callback(err2);
      return;
    }
    const contentType = resp.headers['Content-Type'] || resp.headers['content-type'];
    if (contentType === 'text/html') {
      console.log(body);
    }
    // The body is multi-part containing an ELM file in each part, so we need to split it
    splitELM(body, contentType, callback);
  });
  const form = cqlReq.form();
  if (files) {
    files.forEach(file => {
      form.append(file.filename, file.text, {
        filename: file.filename,
        contentType: file.type
      });
    });
  }
  if (fileStreams) {
    fileStreams.forEach((f) => {
      form.append(path.basename(f.path, '.cql'), f);
    });
  }
}

function splitELM(body, contentType, callback /* (error, elmFiles) */) {
  // Because ELM comes back as a multipart response we use busboy to split it up
  const elmFiles = [];

  let bb;
  try {
    bb = new Busboy({ headers: { 'content-type': contentType } });
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
    .on('error', (err) => {
      callback(err);
    });
  bb.end(body);
}

function buildCQL(artifactBody) {
  return new CqlArtifact(artifactBody);
}
