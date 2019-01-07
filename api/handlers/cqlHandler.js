const config = require('../config');
const Artifact = require('../models/artifact');
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
  { name: 'FHIRHelpers_for_FHIRv102', version: '1.0.2', alias: 'FHIRHelpers' },
  { name: 'CDS_Connect_Commons_for_FHIRv102', version: '1.3.0', alias: 'C3F' },
  { name: 'CDS_Connect_Conversions', version: '1', alias: 'Convert' }
];

const includeLibrariesStu3 = [
  { name: 'FHIRHelpers_for_FHIRv300', version: '3.0.0', alias: 'FHIRHelpers' },
  { name: 'CDS_Connect_Commons_for_FHIRv300', version: '1.0.0', alias: 'C3F' },
  { name: 'CDS_Connect_Conversions', version: '1', alias: 'Convert' }
];

// A flag to hold the FHIR version, so that it can be used
// in functions external to the artifact.
let fhirTarget;

module.exports = {
  objToCql,
  objToELM,
  idToObj,
  writeZip,
  buildCQL
};

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
  const referenceParameter = element.parameters.find(param => param.type === 'reference');
  if (!referenceParameter) {
    // This case should never happen because an element of type base element will never NOT have a reference parameter
    return true;
  }

  const nameParameter = element.parameters.find(param => param.id === 'element_name');

  const originalBaseElement = baseElements.find(baseEl => referenceParameter.value.id === baseEl.uniqueId);
  if (!originalBaseElement) {
    // This case should never happen because you can't delete base elements while in use.
    return true;
  }

  if (nameParameter.value !== originalBaseElement.parameters[0].value) {
    // If the name of the use of the base element and the original base element are different, it's been changed.
    return true;
  }
  if (element.modifiers.length > 0) {
    // If there are modifiers applied to the use of the base element, it's been changed.
    return true;
  }

  return false;
}

// Class to handle all cql generation
class CqlArtifact {
  constructor(artifact) {
    this.name = slug(artifact.name ? artifact.name : 'untitled');
    this.version = artifact.version ? artifact.version : 1;
    this.dataModel = artifact.dataModel;
    this.includeLibraries = (artifact.dataModel.version === '3.0.0') ? includeLibrariesStu3 : includeLibrariesDstu2;
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
    this.paramContexts = [];
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
      if (parameter.type === "Code" || parameter.type === "Concept") {
        let system = _.get(parameter, 'value.system', '').replace(/'/g, '\\\'');
        let uri = _.get(parameter, 'value.uri', '').replace(/'/g, '\\\'');
        if (system && uri) { this.codeSystemMap.set(system, { name: system, id: uri }); }
      }
    });

    this.baseElements.forEach((baseElement) => {
      let isBaseElementUseAndUnchanged = false;
      if (baseElement.type === 'baseElement') {
        isBaseElementUseAndUnchanged = !isBaseElementUseChanged(baseElement, this.baseElements);
      }
      const count = getCountForUniqueExpressionName(baseElement.parameters[0], this.names, 'value', '', false);
      if (!isBaseElementUseAndUnchanged && count > 0) {
        baseElement.parameters[0].value = `${baseElement.parameters[0].value}_${count}`;
      }

      if (baseElement.childInstances) {
        this.parseTree(baseElement);
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

  setParameterContexts(elementDetails, valuesetQueryName, context) {
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
    const name = element.parameters[0].value;
    conjunction.element_name = (name || element.subpopulationName || element.uniqueId);
    (element.childInstances || []).forEach((child) => {
      // TODO: Could a child of a conjunction ever be a subpopulation?
      let childName = (child.parameters[0]||{}).value || child.uniqueId;
      let isBaseElementUseAndUnchanged = false;
      if (child.type === 'baseElement') {
        isBaseElementUseAndUnchanged = !isBaseElementUseChanged(child, this.baseElements);
      }
      // Parameters are updated separately and unchanged base element uses do not unique names
      if (!(child.type === 'parameter' || child.template === 'EmptyParameter' || isBaseElementUseAndUnchanged)) {
        const childCount = getCountForUniqueExpressionName(child.parameters[0], this.names, 'value', '', false);
        if (childCount > 0) {
          childName = `${childName}_${childCount}`;
          if (child.parameters[0].value) {
            child.parameters[0].value = childName;
          }
        }
      }
      conjunction.components.push({ name: childName });
    });
    this.conjunction_main.push(conjunction);
    return element;
  }

  parseParameter(element) {
    const paramContext = {};
    element.parameters.forEach((parameter) => {
      paramContext[parameter.id] = parameter.value;
    });
    this.paramContexts.push(paramContext);
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
    element.parameters.forEach((parameter) => {
      switch (parameter.type) {
        case 'observation_vsac': {
          // All information in observations array will be provided by the selections made on the frontend.
          const observationValueSets = {
            id: 'generic_observation', // This is needed for creating a separate union'ed variable name.
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(parameter.codes, observationValueSets.concepts);
          addValueSets(parameter, observationValueSets, 'valuesets');
          this.setParameterContexts(observationValueSets, 'Observation', context);
          break;
        }
        case 'number': {
          context[parameter.id] = parameter.value;
          if ('exclusive' in parameter) {
            context[`${parameter.id}_exclusive`] = parameter.exclusive;
          }
          break;
        }
        case 'condition_vsac': {
          const conditionValueSets = {
            id: 'generic_condition',
            valuesets: [],
            concepts: []
          }
          buildConceptObjectForCodes(parameter.codes, conditionValueSets.concepts);
          addValueSets(parameter, conditionValueSets, 'valuesets');
          this.setParameterContexts(conditionValueSets, 'Condition', context);
          break;
        }
        case 'medicationStatement_vsac': {
          const medicationStatementValueSets = {
            id: 'generic_medication_statement',
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(parameter.codes, medicationStatementValueSets.concepts);
          addValueSets(parameter, medicationStatementValueSets, 'valuesets');
          this.setParameterContexts(medicationStatementValueSets, 'MedicationStatement', context);
          break;
        }
        case 'medicationOrder_vsac': {
          const medicationOrderValueSets = {
            id: 'generic_medication_order',
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(parameter.codes, medicationOrderValueSets.concepts);
          addValueSets(parameter, medicationOrderValueSets, 'valuesets');
          this.setParameterContexts(medicationOrderValueSets, 'MedicationOrder', context);
          break;
        }
        case 'procedure_vsac': {
          const procedureValueSets = {
            id: 'generic_procedure',
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(parameter.codes, procedureValueSets.concepts);
          addValueSets(parameter, procedureValueSets, 'valuesets');
          this.setParameterContexts(procedureValueSets, 'Procedure', context);
          break;
        }
        case 'encounter_vsac': {
          const encounterValueSets = {
            id: 'generic_encounter',
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(parameter.codes, encounterValueSets.concepts);
          addValueSets(parameter, encounterValueSets, 'valuesets');
          this.setParameterContexts(encounterValueSets, 'Encounter', context);
          break;
        }
        case 'allergyIntolerance_vsac' : {
          const allergyIntoleranceValueSets = {
            id: 'generic_allergyIntolerance',
            valuesets: [],
            concepts: []
          };
          buildConceptObjectForCodes(parameter.codes, allergyIntoleranceValueSets.concepts);
          addValueSets(parameter, allergyIntoleranceValueSets, 'valuesets');
          this.setParameterContexts(allergyIntoleranceValueSets, 'AllergyIntolerance', context);
          break;
        }
        case 'reference': {
          // Need to pull the element name from the reference to support renaming the elements while being used.
          const referencedElement = this.baseElements.find(e => e.uniqueId === parameter.value.id)
          const referencedElementName = referencedElement.parameters[0].value || referencedElement.uniqueId;
          context.values = [ `"${referencedElementName}"` ];
          break;
        }
        default: {
          context.values = context.values || [];
          context[parameter.id] = parameter.value;
          break;
        }
      }
    });

    context.modifiers = element.modifiers;
    context.element_name = (context.element_name || element.uniqueId);
    // If it is an unchanged base element, don't add to context
    if (!(element.type === 'baseElement' && !isBaseElementUseChanged(element, this.baseElements))) {
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
      return ejs.render(templateMap.BaseTemplate, { element_name: context.element_name, cqlString });
    }).join('\n');
  }
  header() {
    return ejs.render(fs.readFileSync(artifactPath, 'utf-8'), this);
  }
  population() {
    const getTreeName = tree => tree.parameters.find(p => p.id === 'element_name').value || tree.uniqueId;

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
      filename: this.name,
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
      if (!modifier.cqlLibraryFunction && modifier.values && modifier.values.templateName) {
        modifier.cqlLibraryFunction = modifier.values.templateName;
      }
      const modifierContext = { cqlLibraryFunction: modifier.cqlLibraryFunction, value_name: newValue };
      // Modifiers that add new value sets, will have a valueSet attribute on values.
      if (modifier.values && modifier.values.valueSet) {
        modifier.values.valueSet.name += ' VS';
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

  // Add concepts
  const conceptCount = getCountForUniqueExpressionName(concept, conceptMap, 'name', 'codes');
  if (conceptCount > 0) {
    concept.name = `${concept.name}_${conceptCount}`;
  }

  return concept;
}

function buildConceptObjectForCodes(codes, listOfConcepts) {
  if (codes) {
    codes.forEach((code) => {
      if (!code.display) code.display = '';
      code.code = code.code.replace(/'/g, '\\\'');
      code.display = code.display.replace(/'/g, '\\\'');
      code.codeSystem.id = code.codeSystem.id.replace(/'/g, '\\\'');
      const concept = {
        name: `${code.codeSystem.name} ${code.code} Concept`,
        codes: [
          {
            name: `${code.code} Code`,
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

function addValueSets(parameter, valueSetObject, attribute) {
  if (parameter && parameter.valueSets) {
    valueSetObject[attribute] = [];
    parameter.valueSets.forEach(vs => {
      valueSetObject[attribute].push({ name: `${vs.name} VS`, oid: vs.oid });
    });
  }
}

// Creates the cql file from an artifact object
function objToCql(req, res) {
  const artifact = new CqlArtifact(req.body);
  res.attachment('archive-name.zip');
  writeZip(artifact, res, (err) => {
    if (err) {
      res.status(500).send({ error: err.message });
    }
  });
}

function objToELM(req, res) {
  const artifact = new CqlArtifact(req.body);
  validateELM(artifact, res, (err) => {
    if(err) {
      res.status(500).send({error: err.message});
    }
  })
}


function validateELM(cqlArtifact, writeStream, callback) {
  const artifactJSON = cqlArtifact.toJson();
  convertToElm(artifactJSON, (err, elmFiles) => {
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


function writeZip(cqlArtifact, writeStream, callback /* (error) */) {
  // Artifact JSON is generated first and passed in to avoid incorrect EJS rendering.
  // TODO: Consider separating EJS rendering from toJSON() or toString() methods.
  const artifactJson = cqlArtifact.toJson();
  // We must first convert to ELM before packaging up
  convertToElm(artifactJson, (err, elmFiles) => {
    if (err) {
      callback(err);
      return;
    }
    // Now build the zip, piping it to the writestream
    const archive = archiver('zip', { zlib: { level: 9 } })
      .on('error', callback);
    writeStream.on('close', callback);
    archive.pipe(writeStream);
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

function convertToElm(artifactJson, callback /* (error, elmFiles) */) {
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

    // NOTE: the request isn't posted until the next event loop, so we can modify it after calling request.post
    const cqlReq = request.post(config.get('cqlToElm.url'), (err2, resp, body) => {
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
    form.append(artifactJson.filename, artifactJson.text, {
      filename: artifactJson.filename,
      contentType: artifactJson.type
    });
    fileStreams.forEach((f) => {
      form.append(path.basename(f.path, '.cql'), f);
    });
  });
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
