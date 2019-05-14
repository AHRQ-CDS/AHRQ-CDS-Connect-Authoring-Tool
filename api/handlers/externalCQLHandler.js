const _ = require('lodash');
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
  let allKnown = true;
  choices.forEach((choice) => {
    if (choice.type === 'NamedTypeSpecifier') {
      const returnTypeOfChoice = getTypeFromELMString(choice.name);
      if (!singularReturnTypeMap[returnTypeOfChoice]) {
        allKnown = false;
      }
    } else {
      // Default to marking as unknown.
      allKnown = false;
    }
  });
  return allKnown;
}

function mapReturnTypes(definitions) {
  const mappedDefinitions = definitions;
  mappedDefinitions.map(definition => {
    let elmReturnType, elmDisplay;

    if (definition.resultTypeName) {
      elmReturnType = getTypeFromELMString(definition.resultTypeName);
      const convertedReturnType = singularReturnTypeMap[elmReturnType];
      if (!convertedReturnType) elmDisplay = `Other (${elmReturnType})`;
      elmReturnType = convertedReturnType ? convertedReturnType : 'other';
    } else if (definition.resultTypeSpecifier) {
      const typeSpecifier = definition.resultTypeSpecifier;
      switch (typeSpecifier.type) {
        case 'NamedTypeSpecifier': {
          elmReturnType = getTypeFromELMString(typeSpecifier.name);
          break;
        }
        case 'IntervalTypeSpecifier': {
          elmReturnType = getTypeFromELMString(typeSpecifier.pointType.name);
          const convertedReturnType = intervalReturnTypeMap[elmReturnType];
          if (!convertedReturnType) elmDisplay = `Interval of Others (Interval<${elmReturnType}>)`;
          elmReturnType = convertedReturnType ? convertedReturnType : 'interval_of_other';
          break;
        }
        case 'ListTypeSpecifier': {
          if (typeSpecifier.elementType.type === 'ChoiceTypeSpecifier') {
            const allChoicesKnown = areChoicesKnownTypes(typeSpecifier.elementType.choice);
            elmReturnType = allChoicesKnown ? 'list_of_any' : 'list_of_other';
            if (!allChoicesKnown) elmDisplay = 'List of Others';
          } else if (typeSpecifier.elementType.type === 'TupleTypeSpecifier') {
            elmReturnType = 'list_of_other';
            elmDisplay = 'List of Others (Tuples)';
          } else {
            elmReturnType = getTypeFromELMString(typeSpecifier.elementType.name);
            const calculatedReturnType = listReturnTypeMap[elmReturnType];
            if (!calculatedReturnType) elmDisplay = `List of Others (List<${elmReturnType}>)`;
            elmReturnType = listReturnTypeMap[elmReturnType] ? listReturnTypeMap[elmReturnType] : 'list_of_other';
          }
          break;
        }
        case 'TupleTypeSpecifier': {
          elmReturnType = 'other';
          elmDisplay = 'Other (Tuple)';
          break;
        }
        case 'ChoiceTypeSpecifier': {
          const allChoicesKnown = areChoicesKnownTypes(typeSpecifier.choice);
          elmReturnType = allChoicesKnown ? 'any' : 'other';
          if (!allChoicesKnown) elmDisplay = 'Other (Choice)';
          break;
        }
        default: {
          elmReturnType = 'other';
          elmDisplay = 'Other (unknown)';
          break;
        }
      }
    } else if (definition.expression && definition.expression.type === 'Null') {
      elmReturnType = 'null';
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

    const cqlJson = {
      filename: cqlFileName,
      text: cqlFileText,
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
          let elmDefinitions = _.concat(_.get(library, 'parameters.def', []), _.get(library, 'statements.def', []))
            .filter(filterDefinition);
          const allowedAttributes =
            ['accessLevel', 'name', 'type', 'context', 'resultTypeName', 'resultTypeSpecifier', 'operand'];
          elmDefinitions = elmDefinitions.map(def => {
            return _.pick(def, allowedAttributes);
          });
          details.definitions = mapReturnTypes(elmDefinitions);
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
