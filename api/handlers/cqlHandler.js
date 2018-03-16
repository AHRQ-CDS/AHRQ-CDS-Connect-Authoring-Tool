const config = require('../config');
const Artifact = require('../models/artifact');
const ValueSets = require('../data/valueSets');
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
const includeLibraries = [
  { name: 'FHIRHelpers', version: '1.0.2', alias: 'FHIRHelpers' },
  { name: 'CDS_Connect_Commons_for_FHIRv102', version: '1.1.0', alias: 'C3F' },
  { name: 'CDS_Connect_Conversions', version: '1', alias: 'Convert' }
];

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
    });
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
    const count = getCountForUniqueExpressionName(vs, resourceMap);
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

// Class to handle all cql generation
class CqlArtifact {
  constructor(artifact) {
    this.name = slug(artifact.name ? artifact.name : 'untitled');
    this.version = artifact.version ? artifact.version : 1;
    this.dataModel = artifact.dataModel ? artifact.dataModel : { name: 'FHIR', version: '1.0.2' };
    this.includeLibraries = artifact.includeLibraries ? artifact.includeLibraries : includeLibraries;
    this.context = artifact.context ? artifact.context : 'Patient';
    this.inclusions = artifact.expTreeInclude;
    this.parameters = artifact.parameters;
    this.exclusions = artifact.expTreeExclude;
    this.subpopulations = artifact.subpopulations;
    this.recommendations = artifact.recommendations;
    this.errorStatement = artifact.errorStatement;
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

    if (this.inclusions.childInstances.length) { this.parseTree(this.inclusions); }
    if (this.exclusions.childInstances.length) { this.parseTree(this.exclusions); }
    this.subpopulations.forEach((subpopulation) => {
      if (!subpopulation.special) { // `Doesn't Meet Inclusion Criteria` and `Meets Exclusion Criteria` are special
        if (subpopulation.childInstances.length) { this.parseTree(subpopulation); }
      }
    }
    );
    this.parameters.forEach((parameter) => {
      if (parameter.type === "Code" || parameter.type === "Concept") {
        let system = _.get(parameter, 'value.system', null);
        let uri = _.get(parameter, 'value.uri', null);
        if (system && uri) { this.codeSystemMap.set(system, uri); }
      }
    }
    );
  }

  setParamterContexts(elementDetails, valuesetQueryName, conceptTemplateName, context) {
    if (elementDetails.concepts.length > 0) {
      const values = [];
      elementDetails.concepts.forEach((concept) => {
        concept.codes.forEach((code) => {
          this.codeSystemMap.set(code.codeSystem.name, code.codeSystem.id);
          this.codeMap.set(code.name, code);
        });
        this.conceptMap.set(concept.name, concept);
        values.push(concept.name);
      });
      context.values = values;
      context.template = conceptTemplateName;
    }
    if (elementDetails.valuesets.length > 0) {
      let concepts = [];
      if (context.values.length > 0) {
        concepts = context.values;
      }
      if (elementDetails.valuesets.length > 1) {
        addGroupedValueSetExpression(this.referencedElements, this.resourceMap, elementDetails, valuesetQueryName, context);
        context.template = 'GenericStatement';
        if (concepts.length > 0) {
          addGroupedConceptExpression(this.referencedConceptElements, this.resourceMap, elementDetails, conceptTemplateName, context);
          // If both value sets and concepts are applied, union the individual expression together to create valid CQL
          unionExpressions(context, elementDetails.id, this.unionedElements);
        }
      } else { // elementDetails.valuesets.length = 1;
        if (concepts.length > 0) {
          addGroupedValueSetExpression(this.referencedElements, this.resourceMap, elementDetails, valuesetQueryName, context);
          addGroupedConceptExpression(this.referencedConceptElements, this.resourceMap, elementDetails, conceptTemplateName, context);
          // If both value sets and concepts are applied, union the individual expression together to create valid CQL
          unionExpressions(context, elementDetails.id, this.unionedElements);
          context.template = 'GenericStatement';
        } else {
          context.values = elementDetails.valuesets.map((vs) => {
            const count = getCountForUniqueExpressionName(vs, this.resourceMap);
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
    this.parseConjunction(element);
    const children = element.childInstances;
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
    element.childInstances.forEach((child) => {
      // TODO: Could a child of a conjuction ever be a subpopulation?
      conjunction.components.push({ name: child.parameters[0].value || child.uniqueId });
    });
    this.conjunction_main.push(conjunction);
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
        case 'observation': {
          const observationValueSets = ValueSets.observations[parameter.value];
          context[parameter.id] = observationValueSets;
          // For observations that have codes associated with them instead of valuesets
          if ('concepts' in observationValueSets) {
            observationValueSets.concepts.forEach((concept) => {
              concept.codes.forEach((code) => {
                this.codeSystemMap.set(code.codeSystem.name, code.codeSystem.id);
                this.codeMap.set(code.name, code);
              });
              this.conceptMap.set(concept.name, concept);
            });
            // For checking if a ConceptValue is in a valueset, include the valueset that will be used
            if ('checkInclusionInVS' in observationValueSets) {
              element.modifiers.forEach((modifier, index) => {
                if (modifier.id === 'CheckInclusionInVS') {
                  element.modifiers[index].values = observationValueSets.checkInclusionInVS.name;
                }
              });
              const checkInclInVSName = observationValueSets.checkInclusionInVS.name;
              this.resourceMap.set(checkInclInVSName, observationValueSets.checkInclusionInVS);
            }
            context.values = [observationValueSets.name];
          } else {
            context.values = observationValueSets.observations.map((observation) => {
              this.resourceMap.set(observation.name, observation);
              return observation.name;
            });
            // For observations that use more than one valueset, create a separate define statement that
            // groups the queries for each valueset into one expression that is then referenced
            if (observationValueSets.observations.length > 1) {
              if (!this.referencedElements.find(concept => concept.name === `${observationValueSets.id}_valuesets`)) {
                const multipleValueSetExpression = createMultipleValueSetExpression(observationValueSets.id,
                  observationValueSets.observations,
                  'Observation');
                this.referencedElements.push(multipleValueSetExpression);
              }
              context.values = [`"${observationValueSets.id}_valuesets"`];
              context.template = 'GenericStatement'; // Potentially move this to the object itself in formTemplates
            }
          }
          element.modifiers.forEach((modifier) => {
            if (modifier.id === 'ValueComparisonObservation') { // TODO put a key on modifiers to identify modifiers that require unit
              modifier.values.unit = observationValueSets.units.code;
            }
          });
          break;
        }
        case 'observation_vsac': {
          // All information in observations array will be provided by the selections made on the frontend.
          const observationValueSets = {
            id: 'generic_observation', // This is needed for creating a separate union'ed variable name.
            valuesets: [],
            concepts: []
          };
          addConceptForCodes(parameter.codes, observationValueSets);
          addValueSets(parameter, observationValueSets, 'valuesets');
          this.setParamterContexts(observationValueSets, 'Observation', 'ObservationsByConcept', context);
          break;
        }
        case 'number': {
          context[parameter.id] = parameter.value;
          if ('exclusive' in parameter) {
            context[`${parameter.id}_exclusive`] = parameter.exclusive;
          }
          break;
        }
        case 'condition': {
          const conditionValueSets = ValueSets.conditions[parameter.value];
          if ('concepts' in conditionValueSets) {
            conditionValueSets.concepts.forEach((concept) => {
              concept.codes.forEach((code) => {
                this.codeSystemMap.set(code.codeSystem.name, code.codeSystem.id);
                this.codeMap.set(code.name, code);
              });
              this.conceptMap.set(concept.name, concept);
            });
            // For checking if a ConceptValue is in a valueset, incluce the valueset that will be used
            if ('checkInclusionInVS' in conditionValueSets) {
              element.modifiers.forEach((modifier, index) => {
                if (modifier.id === 'CheckInclusionInVS') {
                  element.modifiers[index].values = conditionValueSets.checkInclusionInVS.name;
                }
              });
              this.resourceMap.set(conditionValueSets.checkInclusionInVS.name, conditionValueSets.checkInclusionInVS);
            }
            context.values = [
              `[Condition: "${conditionValueSets.conditions[0].name}"]`,
              `C3F.ConditionsByConcept("${conditionValueSets.concepts[0].name}")`
            ];
            context.template = 'GenericStatement'; // Potentially move this to the object itself in formTemplates
            conditionValueSets.conditions.forEach((condition) => {
              this.resourceMap.set(condition.name, condition);
            });
          } else {
            context.values = conditionValueSets.conditions.map((condition) => {
              this.resourceMap.set(condition.name, condition);
              return condition.name;
            });
          }
          break;
        }
        case 'condition_vsac': {
          const conditionValueSets = {
            id: 'generic_condition',
            valuesets: [],
            concepts: []
          }
          addConceptForCodes(parameter.codes, conditionValueSets);
          addValueSets(parameter, conditionValueSets, 'valuesets');
          this.setParamterContexts(conditionValueSets, 'Condition', 'ConditionsByConcept', context);
          break;
        }
        case 'medication': {
          const medicationValueSets = ValueSets.medications[parameter.value];
          // TODO Look through entire modifier list for `active` instead of just head
          const activeApplied = (!_.isEmpty(element.modifiers) && _.head(element.modifiers).id === 'ActiveMedication');
          context.values = medicationValueSets.medications.map((medication) => {
            this.resourceMap.set(medication.name, medication);
            let medicationText = `[${medication.type}: "${medication.name}"]`;
            if (activeApplied) {
              medicationText = `C3F.Active${medication.type}(${medicationText})`;
            }
            return medicationText;
          });
          if (activeApplied) {
            element.modifiers.shift(); // remove 'active' modifier because we supply it above
          }
          break;
        }
        case 'medication_vsac': {
          const medicationValueSets = {
            name: _.uniqueId('generic_medication_'),
            medications: [
              { name: `${parameter.vsName} VS`, oid: parameter.value }
            ]
          };
          // TODO Look through entire modifier list for `active` instead of just head
          const activeApplied = (!_.isEmpty(element.modifiers) && _.head(element.modifiers).id === 'ActiveMedication');
          medicationValueSets.medications.map((medication) => {
            const count = getCountForUniqueExpressionName(medication, this.resourceMap);
            let name = medication.name;
            if (count > 0) {
              name = `${medication.name}_${count}`;
            }
            let medicationStatement = `[MedicationStatement: "${name}"]`;
            let medicationOrder = `[MedicationOrder: "${name}"]`;
            if (activeApplied) {
              context.values.push(`C3F.ActiveMedicationStatement(${medicationStatement})`);
              context.values.push(`C3F.ActiveMedicationOrder(${medicationOrder})`);
            } else {
              context.values.push(medicationStatement);
              context.values.push(medicationOrder);
            }
          });
          if (activeApplied) {
            element.modifiers.shift(); // remove 'active' modifier because we supply it above
          }
          break;
        }
        case 'medicationStatement_vsac': {
          const medicationStatementValueSets = {
            id: 'generic_medication_statement',
            valuesets: [],
            concepts: []
          };
          addConceptForCodes(parameter.codes, medicationStatementValueSets);
          addValueSets(parameter, medicationStatementValueSets, 'valuesets');
          this.setParamterContexts(medicationStatementValueSets, 'MedicationStatement', 'MedicationStatementsByConcept', context);
          break;
        }
        case 'medicationOrder_vsac': {
          const medicationOrderValueSets = {
            id: 'generic_medication_order',
            valuesets: [],
            concepts: []
          };
          addConceptForCodes(parameter.codes, medicationOrderValueSets);
          addValueSets(parameter, medicationOrderValueSets, 'valuesets');
          this.setParamterContexts(medicationOrderValueSets, 'MedicationOrder', 'MedicationOrdersByConcept', context);
          break;
        }
        case 'procedure': {
          const procedureValueSets = ValueSets.procedures[parameter.value];
          context[parameter.id] = procedureValueSets;
          context.values = procedureValueSets.procedures.map((procedure) => {
            this.resourceMap.set(procedure.name, procedure);
            return procedure.name;
          });
          break;
        }
        case 'procedure_vsac': {
          const procedureValueSets = {
            id: 'generic_procedure',
            valuesets: [],
            concepts: []
          };
          addConceptForCodes(parameter.codes, procedureValueSets);
          addValueSets(parameter, procedureValueSets, 'valuesets');
          this.setParamterContexts(procedureValueSets, 'Procedure', 'ProceduresByConcept', context);
          break;
        }
        case 'encounter': {
          const encounterValueSets = ValueSets.encounters[parameter.value];
          context.values = encounterValueSets.encounters.map((encounter) => {
            this.resourceMap.set(encounter.name, encounter);
            return encounter.name;
          });
          context[parameter.id] = encounterValueSets;
          break;
        }
        case 'encounter_vsac': {
          const encounterValueSets = {
            id: 'generic_encounter',
            valuesets: [],
            concepts: []
          };
          addConceptForCodes(parameter.codes, encounterValueSets);
          addValueSets(parameter, encounterValueSets, 'valuesets');
          this.setParamterContexts(encounterValueSets, 'Encounter', 'EncountersByConcept', context);
          break;
        }
        case 'allergyIntolerance' : {
          const allergyIntoleranceValueSets = ValueSets.allergyIntolerances[parameter.value];
          context.values = allergyIntoleranceValueSets.allergyIntolerances.map((allergyIntolerance) => {
            this.resourceMap.set(allergyIntolerance.name, allergyIntolerance);
            return allergyIntolerance.name;
          });
          context[parameter.id] = allergyIntoleranceValueSets;
          break;
        }
        case 'allergyIntolerance_vsac' : {
          const allergyIntoleranceValueSets = {
            id: 'generic_allergyIntolerance',
            valuesets: [],
            concepts: []
          };
          addConceptForCodes(parameter.codes, allergyIntoleranceValueSets);
          addValueSets(parameter, allergyIntoleranceValueSets, 'valuesets');
          this.setParamterContexts(allergyIntoleranceValueSets, 'AllergyIntolerance', 'AllergyIntolerancesByConcept', context);
          break;
        }
        case 'pregnancy': {
          const pregnancyValueSets = ValueSets.conditions[parameter.value];
          pregnancyValueSets.conditions.forEach((condition) => {
            this.resourceMap.set(condition.name, condition);
          });
          if ('concepts' in pregnancyValueSets) {
            pregnancyValueSets.concepts.forEach((concept) => {
              concept.codes.forEach((code) => {
                this.codeSystemMap.set(code.codeSystem.name, code.codeSystem.id);
                this.codeMap.set(code.name, code);
              });
              this.conceptMap.set(concept.name, concept);
            });
          }
          context.pregnancyNegated = element.modifiers.some(modifier => modifier.id === 'BooleanNot');
          context.valueSetName = pregnancyValueSets.conditions[0].name;
          context.pregnancyStatusConcept = pregnancyValueSets.concepts[0].name;
          context.pregnancyCodeConcept = pregnancyValueSets.concepts[1].name;
          break;
        }
        case 'breastfeeding': {
          const breastfeedingValueSets = ValueSets.conditions[parameter.value];
          breastfeedingValueSets.conditions.forEach((condition) => {
            this.resourceMap.set(condition.name, condition);
          });
          if ('concepts' in breastfeedingValueSets) {
            breastfeedingValueSets.concepts.forEach((concept) => {
              concept.codes.forEach((code) => {
                this.codeSystemMap.set(code.codeSystem.name, code.codeSystem.id);
                this.codeMap.set(code.name, code);
              });
              this.conceptMap.set(concept.name, concept);
            });
          }
          context.breastfeedingNegated = element.modifiers.some(modifier => modifier.id === 'BooleanNot');
          context.valueSetName = breastfeedingValueSets.conditions[0].name;
          context.breastfeedingCodeConcept = breastfeedingValueSets.concepts[0].name;
          context.breastfeedingYesConcept = breastfeedingValueSets.concepts[1].name;
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
    this.contexts.push(context);
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
      if (context.withoutModifiers || context.components) {
        return ejs.render(specificMap[context.template], context);
      }
      if (!(context.template in templateMap)) console.error(`Template could not be found: ${context.template}`);
      context.values.forEach((value, index) => {
        context.values[index] = ejs.render(templateMap[context.template], { element_context: value });
      });
      const cqlString = applyModifiers(context.values, context.modifiers);
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
      return `${conditional}'${recommendation.text}'`;
    });
    text = _.isEmpty(text) ? 'null' : text.join('\n  else ').concat('\n  else null');
    return ejs.render(templateMap.BaseTemplate, { element_name: 'Recommendation', cqlString: text });
  }

  rationale() {
    let rationaleText = this.recommendations.map((recommendation) => {
      const conditional = constructOneRecommendationConditional(recommendation);
      return conditional + (_.isEmpty(recommendation.rationale) ? 'null' : `'${recommendation.rationale}'`);
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
    return `${this.header()}${this.body()}\n${this.population()}\n${this.recommendation()}\n${this.rationale()}\n` +
      `${this.errors()}`;
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
function applyModifiers(values, modifiers = []) { // default modifiers to []
  return values.map((value) => {
    let newValue = value;
    modifiers.forEach((modifier) => {
      if (!(modifier.cqlTemplate in modifierMap)) {
        console.error(`Modifier Template could not be found: ${modifier.cqlTemplate}`);
      }
      const modifierContext = { cqlLibraryFunction: modifier.cqlLibraryFunction, value_name: newValue };
      if (modifier.values) modifierContext.values = modifier.values; // Certain modifiers (such as lookback) require values, so provide them here
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

function getCountForUniqueExpressionName(valueset, map) {
  if (map.size > 0) {
    let newOID = true;
    let count = 0;
    let existingOID = 0;
    map.forEach((val, key) => {
      const baseKeyArray = key.split('_');
      // Check if the last entry is a number, meaning _n was appended to account for nonunique VS names.
      const lastChar = baseKeyArray[baseKeyArray.length - 1];
      if (Number.isInteger(parseInt(lastChar))) {
        baseKeyArray.pop();
      }
      const baseKeyString = baseKeyArray.join('_'); // The original VS name
      if (baseKeyString === valueset.name) {
        // If the name and OID of the VS are the same, the same VS is being used. Don't add it to the CQL.
        if (val.oid === valueset.oid) {
          newOID = false;
          existingOID = count;
        } else {
          // If the VS name has been used but the OID is unique, increment the count to append to the VS name.
          count = count + 1;
        }
      }
    });
    if (newOID) {
      const cloneVS = _.cloneDeep(valueset);
      if (count > 0) {
        cloneVS.name += `_${count}`;
      }
      map.set(cloneVS.name, cloneVS);
      return count;
    }
    return existingOID;
  } else {
    map.set(valueset.name, valueset);
    return 0;
  }
}

function addConceptForCodes(codes, valueSetObject) {
  if (codes) {
    codes.forEach((code) => {
      const concept = {
        name: `${code.codeSystem.name} ${code.code} Concept`,
        codes: [
          {
            name: `${code.code} Name`,
            code: code.code,
            codeSystem: { name: code.codeSystem.name, id: code.codeSystem.id },
            display: `${code.codeSystem.name} ${code.code} Display`
          }
        ],
        display: `${code.codeSystem.name} ${code.code} Concept Display`
      }
      valueSetObject.concepts.push(concept);
    });
  }
}

function addValueSets(parameter, valueSetObject, attribute) {
  if (parameter && parameter.value) {
    // TODO For unioning, this needs to loop
    valueSetObject[attribute] = [
      { name: `${parameter.vsName} VS`, oid: parameter.value },
    ];
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
    writeStream.json({elmErrors});
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
      archive.append(e.content, { name: `${e.name}.json` });
    });
    const helperPath = `${__dirname}/../data/library_helpers/`;
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
  const helperPath = `${__dirname}/../data/library_helpers/`;
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
