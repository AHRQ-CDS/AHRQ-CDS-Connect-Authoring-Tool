const _ = require('lodash');
const unzipper = require('unzipper');
const CQLLibrary = require('../models/cqlLibrary');
const convertToElm = require('../handlers/cqlHandler').convertToElm;

const singularReturnTypeMap = {
  'Boolean': 'boolean',
  'Code': 'system_code',
  'Concept': 'system_concept',
  'Integer': 'integer',
  'DateTime': 'datetime',
  'Decimal': 'decimal',
  'Quantity': 'system_quantity',
  'String': 'string',
  'Time': 'time',
  'Observation': 'observation',
  'Condition': 'condition',
  'MedicationStatement': 'medication_statement',
  'MedicationOrder': 'medication_order',
  'MedicationRequest': 'medication_order',
  'Procedure': 'procedure',
  'AllergyIntolerance': 'allergy_intolerance',
  'Encounter': 'encounter',
  'Any': 'any'
};

const listReturnTypeMap = {
  'Observation': 'list_of_observations',
  'Condition': 'list_of_conditions',
  'MedicationStatement': 'list_of_medication_statements',
  'MedicationOrder': 'list_of_medication_orders',
  'MedicationRequest': 'list_of_medication_orders',
  'Procedure': 'list_of_procedures',
  'AllergyIntolerance': 'list_of_allergy_intolerances',
  'Encounter': 'list_of_encounters',
  'Any': 'list_of_any',
  'Boolean': 'list_of_booleans',
  'Code': 'list_of_system_codes',
  'Concept': 'list_of_system_concepts',
  'Integer': 'list_of_integers',
  'DateTime': 'list_of_datetimes',
  'Decimal': 'list_of_decimals',
  'Quantity': 'list_of_system_quantities',
  'String': 'list_of_strings',
  'Time': 'list_of_times',
}

const intervalReturnTypeMap = {
  'Integer': 'interval_of_integer',
  'DateTime': 'interval_of_datetime',
  'Decimal': 'interval_of_decimal',
  'Quantity': 'interval_of_quantity'
}

const getTypeFromELMString = (string) => string.substring(string.indexOf('}') + 1);

const areChoicesKnownTypes = (choices) => {
  let allChoicesKnown = true;
  const typesOfChoices = [];
  choices.forEach((choice) => {
    if (choice.type === 'NamedTypeSpecifier') {
      const returnTypeOfChoice = getTypeFromELMString(choice.name);
      const convertedReturnType = singularReturnTypeMap[returnTypeOfChoice];
      if (!convertedReturnType) {
        allChoicesKnown = false;
      }
      let typeToDisplay = convertedReturnType ? convertedReturnType : returnTypeOfChoice;
      if (returnTypeOfChoice === 'MedicationRequest') typeToDisplay = 'Medication Request';
      typesOfChoices.push(_.startCase(typeToDisplay));
    } else {
      // Default to marking as unknown.
      allChoicesKnown = false;
      typesOfChoices.push('Unknown');
    }
  });
  return { allChoicesKnown, typesOfChoices };
}

function mapReturnTypes(definitions) {
  const mappedDefinitions = definitions;
  mappedDefinitions.map(definition => {
    let elmReturnType, elmDisplay;

    if (definition.resultTypeName) {
      elmReturnType = getTypeFromELMString(definition.resultTypeName);
      const convertedReturnType = singularReturnTypeMap[elmReturnType];
      if (!convertedReturnType) elmDisplay = `Other (${elmReturnType})`;
      if (elmReturnType === 'MedicationRequest') elmDisplay = 'Medication Request';
      elmReturnType = convertedReturnType ? convertedReturnType : 'other';
    } else if (definition.resultTypeSpecifier) {
      const typeSpecifier = definition.resultTypeSpecifier;
      switch (typeSpecifier.type) {
        case 'NamedTypeSpecifier': {
          elmReturnType = getTypeFromELMString(typeSpecifier.name);
          const convertedReturnType = singularReturnTypeMap[elmReturnType];
          if (!convertedReturnType) elmDisplay = `Other (${elmReturnType})`;
          if (elmReturnType === 'MedicationRequest') elmDisplay = 'Medication Request';
          elmReturnType = convertedReturnType ? convertedReturnType : 'other';
          break;
        }
        case 'IntervalTypeSpecifier': {
          elmReturnType = getTypeFromELMString(typeSpecifier.pointType.name);
          const convertedReturnType = intervalReturnTypeMap[elmReturnType];
          if (!convertedReturnType) elmDisplay = `Interval of Others (${elmReturnType})`;
          elmReturnType = convertedReturnType ? convertedReturnType : 'interval_of_other';
          break;
        }
        case 'ListTypeSpecifier': {
          if (typeSpecifier.elementType.type === 'ChoiceTypeSpecifier') {
            const { allChoicesKnown, typesOfChoices } = areChoicesKnownTypes(typeSpecifier.elementType.choice);
            elmReturnType = allChoicesKnown ? 'list_of_any' : 'list_of_others';
            if (!allChoicesKnown) elmDisplay = `List of Others (${typesOfChoices.join(', ')})`;
            else elmDisplay = `List of Any (${typesOfChoices.join(', ')})`;
          } else if (typeSpecifier.elementType.type === 'TupleTypeSpecifier') {
            elmReturnType = 'list_of_others';
            elmDisplay = 'List of Others (Tuple)';
          } else if (typeSpecifier.elementType.type === 'NamedTypeSpecifier') {
            elmReturnType = getTypeFromELMString(typeSpecifier.elementType.name);
            const convertedReturnType = listReturnTypeMap[elmReturnType];
            if (!convertedReturnType) elmDisplay = `List of Others (${elmReturnType})`;
            if (elmReturnType === 'MedicationRequest') elmDisplay = 'List of Medication Requests';
            elmReturnType = convertedReturnType ? convertedReturnType : 'list_of_others';
          } else if (typeSpecifier.elementType.type === 'ListTypeSpecifier') {
            elmReturnType = 'list_of_others';
            elmDisplay = 'List of Lists';
          } else if (typeSpecifier.elementType.type === 'IntervalTypeSpecifier') {
            elmReturnType = 'list_of_others';
            elmDisplay = 'List of Intervals';
          } else {
            elmReturnType = 'list_of_others';
            elmDisplay = 'List of Others (unknown)';
          }
          break;
        }
        case 'TupleTypeSpecifier': {
          elmReturnType = 'other';
          elmDisplay = 'Other (Tuple)';
          break;
        }
        case 'ChoiceTypeSpecifier': {
          const { allChoicesKnown, typesOfChoices } = areChoicesKnownTypes(typeSpecifier.choice);
          elmReturnType = allChoicesKnown ? 'any' : 'other';
          if (!allChoicesKnown) elmDisplay = `Other (Choice of ${typesOfChoices.join(', ')})`;
          break;
        }
        default: {
          elmReturnType = 'other';
          elmDisplay = 'Other (unknown)';
          break;
        }
      }
    } else {
      elmReturnType = 'other';
      elmDisplay = 'Other (unknown)';
    }

    definition.calculatedReturnType = elmReturnType || 'other';
    definition.displayReturnType = elmDisplay;
  });
  return mappedDefinitions;
}

const filterDefinition = def => (def.name !== 'Patient' && def.accessLevel === 'Public');

module.exports = {
  allGet,
  singleGet,
  singlePost,
  singleDelete
};

// Get all libraries for a given artifact
function allGet(req, res) {
  if (req.user) {
    // eslint-disable-next-line array-callback-return
    CQLLibrary.find({ user: req.user.uid, linkedArtifactId: req.params.artifactId }, (error, libraries) => {
      if (error) res.status(500).send(error);
      else res.json(libraries);
    });
  } else {
    res.sendStatus(401);
  }
}

// Get a single external CQL library
function singleGet(req, res) {
  if (req.user) {
    const { id } = req.params;
    CQLLibrary.find({ user: req.user.uid, _id: id }, (error, library) => {
      if (error) res.status(500).send(error);
      else if (library.length === 0) res.sendStatus(404);
      else res.json(library);
    });
  } else {
    res.sendStatus(401);
  }
}

// Post a single external CQL library
function singlePost(req, res) {
  if (req.user) {
    const { cqlFileName, cqlFileText, artifactId } = req.body.library;

    const decodedBuffer = Buffer.from(cqlFileText, 'base64');
    // unzipper.Open.buffer(decodedBuffer)
    //   .then((directory) => {
    //     console.log('Success');
    //     console.log(directory);
    //   })
    //   .catch(err => { console.log('Im an error!!'); console.log(err); });

    const cqlJson = {
      filename: cqlFileName,
      text: decodedBuffer,
      type: 'text/plain'
    };

    convertToElm(cqlJson, (err, elmFiles) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      let elmResults = {
        linkedArtifactId: artifactId,
        user: req.user.uid
      };
      let elmErrors = [];

      elmFiles.forEach((file, i) => {
        const parsedContent = JSON.parse(file.content);
        // ELM will return any helper libraries in order to not get errors - but we don't need to save those files here.
        const fileName = file.name;
        if (fileName === cqlFileName) {
          const annotations = _.get(parsedContent, 'library.annotation', [])
          elmErrors = annotations.filter(a => a.errorSeverity === 'error');

          const { library } = parsedContent;
          elmResults.name = library.identifier.id || '';
          elmResults.version = library.identifier.version || '';

          // Find FHIR version used by library
          const elmDefs = _.get(library, 'usings.def', []);
          const fhirDef = _.find(elmDefs, { localIdentifier: 'FHIR' });
          elmResults.fhirVersion = _.get(fhirDef, 'version', '');

          const details = {};
          details.cqlFileText = cqlFileText;
          details.fileName = cqlFileName;
          let elmParameters = _.get(library, 'parameters.def', []).filter(filterDefinition);
          let elmDefinitions = _.get(library, 'statements.def', []).filter(filterDefinition);
          const allowedAttributes =
            ['accessLevel', 'name', 'type', 'context', 'resultTypeName', 'resultTypeSpecifier', 'operand'];
          elmParameters = elmParameters.map(def => {
            return _.pick(def, allowedAttributes);
          });
          elmDefinitions = elmDefinitions.map(def => {
            return _.pick(def, allowedAttributes);
          });
          const defineStatements = elmDefinitions.filter(def => def.type !== 'FunctionDef');
          const functionStatements = elmDefinitions.filter(def => def.type === 'FunctionDef');
          details.parameters = mapReturnTypes(elmParameters);
          details.definitions = mapReturnTypes(defineStatements);
          details.functions = mapReturnTypes(functionStatements);
          elmResults.details = details;
        }
      });

      CQLLibrary.find({ user: req.user.uid, linkedArtifactId: elmResults.linkedArtifactId }, (error, libraries) => {
        if (error) res.status(500).send(error);
        else {
          const dupLibrary = libraries.find(lib => lib.name === elmResults.name && lib.version === elmResults.version);
          if (!dupLibrary) {
            if (elmErrors.length > 0) {
              res.status(400).send(elmErrors);
            } else {
              CQLLibrary.create(elmResults, (error, response) => {
                if (error) res.status(500).send(error);
                else res.status(201).json(response);
              });
            }
          } else {
            res.status(409).send('Library with identical name and version already exists.');
          }
        }
      });
    });

  } else {
    res.sendStatus(401);
  }
}

// Delete a single external CQL library
function singleDelete(req, res) {
  if (req.user) {
    const { id } = req.params;
    CQLLibrary.remove({ user: req.user.uid, _id: id }, (error, response) => {
      if (error) res.status(500).send(error);
      else if (response.result.n === 0) res.sendStatus(404);
      else res.sendStatus(200);
    });
  } else {
    res.sendStatus(401);
  }
}
