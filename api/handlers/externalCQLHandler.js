const _ = require('lodash');
const unzipper = require('unzipper');
const CQLLibrary = require('../models/cqlLibrary');
const Artifact = require('../models/artifact');
const makeCQLtoELMRequest = require('../handlers/cqlHandler').makeCQLtoELMRequest;

const supportedFHIRVersions = ['1.0.2', '3.0.0'];

const authoringToolExports = [
  { name: 'FHIRHelpers', version: '1.0.2' },
  { name: 'CDS_Connect_Commons_for_FHIRv102', version: '1.3.2' },
  { name: 'CDS_Connect_Conversions', version: '1' },
  { name: 'FHIRHelpers', version: '3.0.0' },
  { name: 'CDS_Connect_Commons_for_FHIRv300', version: '1.0.1' },
  { name: 'CDS_Connect_Conversions', version: '1' }
];

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

function checkMatch(elmResults, files) {
  const libraryAndVersionRegex = /library\s+(([A-Z][A-Za-z0-9_]*)|"(.+)")\s+version\s+'(.+)'/m;
  const fileForELMResult = files.find(file => {
    const matches = libraryAndVersionRegex.exec(file.text);
    const isMatch =
      matches && (matches[2] === elmResults.name || matches[3] === elmResults.name) && matches[4] === elmResults.version
    return isMatch;
  });
  return fileForELMResult;
}

const filterDefinition = def => (def.name !== 'Patient' && def.accessLevel === 'Public');

const compareNameAndVersion = (a, b) => a.name === b.name && a.version === b.version;

const filterCQLFiles = file => {
  const filePathArray = file.path.split('/');
  const fileName = filePathArray[filePathArray.length - 1];
  return file.type === 'File' && file.path.endsWith('.cql') && !fileName.startsWith('.');
};

function getCurrentFHIRVersion(libraries) {
  let currentFHIRVersion = ''; // Empty string means no FHIR version set yet;
  libraries.forEach((lib) => {
    if (lib.fhirVersion) currentFHIRVersion = lib.fhirVersion;
  });
  return currentFHIRVersion;
}

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

function parseELMFiles(elmFiles, artifactId, userId, files) {
  const elmResultsToSave = [];
  let elmErrors = [];
  elmFiles.forEach((file) => {
    let elmResults = {
      linkedArtifactId: artifactId,
      user: userId
    };
    const parsedContent = JSON.parse(file.content);
    const annotations = _.get(parsedContent, 'library.annotation', []);
    elmErrors = elmErrors.concat(annotations.filter(a => a.errorSeverity === 'error'));

    const { library } = parsedContent;
    elmResults.name = library.identifier.id || '';
    elmResults.version = library.identifier.version || '';

    const fileForELMResult = checkMatch(elmResults, files);

    // Find FHIR version used by library
    const elmDefs = _.get(library, 'usings.def', []);
    const fhirDef = _.find(elmDefs, { localIdentifier: 'FHIR' });
    elmResults.fhirVersion = _.get(fhirDef, 'version', '');

    const details = {};
    details.cqlFileText = fileForELMResult ? fileForELMResult.text : '';
    details.fileName = fileForELMResult ? fileForELMResult.filename : '';
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
    const fileDependencies = _.get(library, 'includes.def', []);
    details.dependencies = fileDependencies;
    elmResults.details = details;
    elmResultsToSave.push(elmResults);
  });
  return { elmErrors, elmResultsToSave };
}

// Post a single external CQL library
function singlePost(req, res) {
  if (req.user) {
    const { cqlFileName, cqlFileContent, fileType, artifactId } = req.body.library;

    const decodedBuffer = Buffer.from(cqlFileContent, 'base64');

    if (fileType === 'application/zip') {
      unzipper.Open.buffer(decodedBuffer)
        .then(async (directory) => {
          const files = await Promise.all(directory.files.filter(filterCQLFiles).map(async (file) => {
            const buffer = await file.buffer();
            const filePathArray = file.path.split('/');
            const fileName = filePathArray[filePathArray.length - 1];
            return Promise.resolve( { filename: fileName, type: 'text/plain', text: buffer.toString() });
          }));
          makeCQLtoELMRequest(files, [], (err, elmFiles) => {
            if (err) {
              res.status(500).send(err);
              return;
            }

            const { elmErrors, elmResultsToSave } = parseELMFiles(elmFiles, artifactId, req.user.uid, files);

            CQLLibrary.find({ user: req.user.uid, linkedArtifactId: artifactId }, (error, libraries) => {
              if (error) res.status(500).send(error);
              else {
                const nonAuthoringToolExportLibraries =
                  _.differenceWith(elmResultsToSave, authoringToolExports, compareNameAndVersion);
                const authoringToolExportLibraries = _.difference(elmResultsToSave, nonAuthoringToolExportLibraries);
                const nonDuplicateLibraries =
                  _.differenceWith(nonAuthoringToolExportLibraries, libraries, compareNameAndVersion);
                const duplicateLibraries = _.difference(nonAuthoringToolExportLibraries, nonDuplicateLibraries);

                const newLibFHIRVersion = getCurrentFHIRVersion(elmResultsToSave);
                const fhirVersion = getCurrentFHIRVersion(libraries);

                // If no FHIR version locked, any version can be uploaded.
                // If no FHIR version on any libraries being added, they can be added
                const fhirVersionsMatch = (fhirVersion && newLibFHIRVersion) ? fhirVersion === newLibFHIRVersion : true;
                // If new libraries have no FHIR version or it matches a supported FHIR version, we support it
                const supportedFHIRVersion = newLibFHIRVersion === '' ||
                  supportedFHIRVersions.findIndex(v => v === newLibFHIRVersion) !== -1;

                const exportLibrariesNotUploaded =
                  authoringToolExportLibraries.map(lib => `library ${lib.name} version ${lib.version}`).join(', ');
                const exportLibrariesNotUploadedMessage = `The following was not uploaded because the library is \
                  included by default: ${exportLibrariesNotUploaded}.`;
                // If any file has an error, upload nothing.
                if (elmErrors.length > 0) {
                  res.status(400).send(elmErrors);
                } else if (!fhirVersionsMatch) {
                  const message = 'A library using a different version of FHIR is uploaded. Only one FHIR version can \
                    be supported at a time.';
                  res.status(400).send(message);
                } else if (!supportedFHIRVersion) {
                  res.status(400).send('Unsupported FHIR version.');
                } else {
                  CQLLibrary.insertMany(nonDuplicateLibraries, (error, response) => {
                    if (error) {
                      res.status(500).send(error);
                    } else if (duplicateLibraries.length > 0) {
                      // NOTE: Really, we should re-run cql-to-elm with the existing version of the duplicate files to
                      // confirm they work with the non-duplicate libraries.
                      const librariesNotUploaded =
                        duplicateLibraries.map(lib => `library ${lib.name} version ${lib.version}`).join(', ');
                      let message = `The following was not uploaded because a library with identical name and version \
                        already exists: ${librariesNotUploaded}.`;
                      if (exportLibrariesNotUploaded.length > 0) {
                        message = message.concat(` ${exportLibrariesNotUploadedMessage}`);
                      }
                      if (newLibFHIRVersion) {
                        Artifact.update({ user: req.user.uid, _id: artifactId }, { fhirVersion: newLibFHIRVersion },
                          (error, response) => {
                            if (error) res.status(500).send(error);
                            else if (response.n === 0) res.sendStatus(404);
                            else res.status(201).send(message);
                          });
                      } else {
                        res.status(201).send(message);
                      }
                    } else {
                      if (exportLibrariesNotUploaded.length > 0) {
                        if (newLibFHIRVersion) {
                          Artifact.update({ user: req.user.uid, _id: artifactId }, { fhirVersion: newLibFHIRVersion },
                            (error, response) => {
                              if (error) res.status(500).send(error);
                              else if (response.n === 0) res.sendStatus(404);
                              else res.status(201).send(exportLibrariesNotUploadedMessage);
                            });
                        } else {
                          res.status(201).send(exportLibrariesNotUploadedMessage);
                        }
                      } else {
                        if (newLibFHIRVersion) {
                          Artifact.update({ user: req.user.uid, _id: artifactId }, { fhirVersion: newLibFHIRVersion },
                            (error, response) => {
                              if (error) res.status(500).send(error);
                              else if (response.n === 0) res.sendStatus(404);
                              else res.status(201).json(response);
                            });
                        } else {
                          res.status(201).json(response);
                        }
                      }
                    }
                  });
                }
              }
            });
          });
        })
        .catch(err => res.status(500).send(err));
    } else {
      const cqlJson = {
        filename: cqlFileName,
        text: decodedBuffer.toString(),
        type: 'text/plain'
      };

      const files = [cqlJson];

      makeCQLtoELMRequest(files, [], (err, elmFiles) => {
        if (err) {
          res.status(500).send(err);
          return;
        }

        const { elmErrors, elmResultsToSave } = parseELMFiles(elmFiles, artifactId, req.user.uid, files);

        CQLLibrary.find({ user: req.user.uid, linkedArtifactId: artifactId }, (error, libraries) => {
          if (error) res.status(500).send(error);
          else {
            const elmResult = elmResultsToSave[0]; // This is the single file upload case, so elmResultsToSave will only ever have one item.
            const dupLibrary = libraries.find(lib => lib.name === elmResult.name && lib.version === elmResult.version);
            const newLibFHIRVersion = elmResult.fhirVersion;
            const fhirVersion = getCurrentFHIRVersion(libraries);

            // If no FHIR version locked, any version can be uploaded.
            // If no FHIR version used by the library, it can be uploaded
            const fhirVersionsMatch = (fhirVersion && newLibFHIRVersion) ? fhirVersion === newLibFHIRVersion : true;
            // If new library has no FHIR version or it matches a supported FHIR version, we support it
            const supportedFHIRVersion = newLibFHIRVersion === '' ||
              supportedFHIRVersions.findIndex(v => v === newLibFHIRVersion) !== -1;


            if (elmErrors.length > 0) {
              res.status(400).send(elmErrors);
            } else if (dupLibrary) {
              res.status(200).send('Library with identical name and version already exists.');
            } else if (!fhirVersionsMatch) {
              const message = 'A library using a different version of FHIR is uploaded. Only one FHIR version can be \
                supported at a time.';
              res.status(400).send(message);
            } else if (!supportedFHIRVersion) {
              res.status(400).send('Unsupported FHIR version.');
            } else {
              CQLLibrary.insertMany(elmResult, (error, response) => {
                if (error) res.status(500).send(error);
                else {
                  // If the new library has a FHIR version, it can only be added if it either first sets a FHIR version
                  // or it matches so update the artifact to that FHIR version
                  if (newLibFHIRVersion) {
                    Artifact.update({ user: req.user.uid, _id: artifactId }, { fhirVersion: newLibFHIRVersion },
                      (error, response) => {
                        if (error) res.status(500).send(error);
                        else if (response.n === 0) res.sendStatus(404);
                        else res.status(201).json(response);
                      });
                  } else {
                    res.status(201).json(response);
                  }
                }
              });
            }
          }
        });
      });
    }
  } else {
    res.sendStatus(401);
  }
}

// Delete a single external CQL library
function singleDelete(req, res) {
  if (req.user) {
    const { id } = req.params;
    CQLLibrary.findOneAndRemove({ user: req.user.uid, _id: id }, (error, response) => {
      if (error) res.status(500).send(error);
      else if (response === null) res.sendStatus(404);
      else {
        const linkedArtifactId = response.linkedArtifactId;
        CQLLibrary.find({ user: req.user.uid, linkedArtifactId }, (error, libraries) => {
          if (error) res.status(500).send(error);
          else {
            const currentFHIRVersion = getCurrentFHIRVersion(libraries);
            Artifact.update({ user: req.user.uid, _id: linkedArtifactId }, { fhirVersion: currentFHIRVersion },
              (error, response) => {
                if (error) res.status(500).send(error);
                else if (response.n === 0) res.sendStatus(404);
                else res.status(200);
              });
          }
        });
        res.sendStatus(200);
      }
    });
  } else {
    res.sendStatus(401);
  }
}
