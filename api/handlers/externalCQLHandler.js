const _ = require('lodash');
const unzipper = require('unzipper');
const CQLLibrary = require('../models/cqlLibrary');
const Artifact = require('../models/artifact');
const makeCQLtoELMRequest = require('../handlers/cqlHandler').makeCQLtoELMRequest;

const supportedFHIRVersions = ['1.0.2', '3.0.0', '4.0.0'];

const authoringToolExports = [
  { name: 'FHIRHelpers', version: '1.0.2' },
  { name: 'FHIRHelpers', version: '3.0.0' },
  { name: 'FHIRHelpers', version: '4.0.0' }
];

const singularTypeMap = {
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
  'MedicationOrder': 'medication_request',
  'MedicationRequest': 'medication_request',
  'Procedure': 'procedure',
  'AllergyIntolerance': 'allergy_intolerance',
  'Encounter': 'encounter',
  'Immunization': 'immunization',
  'Device': 'device',
  'Any': 'any'
};

const listTypeMap = {
  'Observation': 'list_of_observations',
  'Condition': 'list_of_conditions',
  'MedicationStatement': 'list_of_medication_statements',
  'MedicationOrder': 'list_of_medication_requests',
  'MedicationRequest': 'list_of_medication_requests',
  'Procedure': 'list_of_procedures',
  'AllergyIntolerance': 'list_of_allergy_intolerances',
  'Encounter': 'list_of_encounters',
  'Immunization': 'list_of_immunizations',
  'Device': 'list_of_devices',
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

const intervalTypeMap = {
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
      const convertedType = singularTypeMap[returnTypeOfChoice];
      if (!convertedType) {
        allChoicesKnown = false;
      }
      let typeToDisplay = convertedType ? convertedType : returnTypeOfChoice;
      if (returnTypeOfChoice === 'MedicationOrder') typeToDisplay = 'Medication Order';
      typesOfChoices.push(_.startCase(typeToDisplay));
    } else {
      // Default to marking as unknown.
      allChoicesKnown = false;
      typesOfChoices.push('Unknown');
    }
  });
  return { allChoicesKnown, typesOfChoices };
}

function calculateType(definition) {
  let elmType, elmDisplay;

  if (definition.resultTypeName || definition.operandType) {
    elmType = getTypeFromELMString(definition.resultTypeName || definition.operandType);
    const convertedType = singularTypeMap[elmType];
    if (!convertedType) elmDisplay = `Other (${elmType})`;
    if (elmType === 'MedicationOrder') elmDisplay = 'Medication Order';
    elmType = convertedType ? convertedType : 'other';
  } else if (definition.resultTypeSpecifier || definition.operandTypeSpecifier) {
    const typeSpecifier = definition.resultTypeSpecifier || definition.operandTypeSpecifier;
    switch (typeSpecifier.type) {
      case 'NamedTypeSpecifier': {
        elmType = getTypeFromELMString(typeSpecifier.name);
        const convertedType = singularTypeMap[elmType];
        if (!convertedType) elmDisplay = `Other (${elmType})`;
        if (elmType === 'MedicationOrder') elmDisplay = 'Medication Order';
        elmType = convertedType ? convertedType : 'other';
        break;
      }
      case 'IntervalTypeSpecifier': {
        elmType = getTypeFromELMString(typeSpecifier.pointType.name);
        const convertedType = intervalTypeMap[elmType];
        if (!convertedType) elmDisplay = `Interval of Others (${elmType})`;
        elmType = convertedType ? convertedType : 'interval_of_other';
        break;
      }
      case 'ListTypeSpecifier': {
        if (typeSpecifier.elementType.type === 'ChoiceTypeSpecifier') {
          const { allChoicesKnown, typesOfChoices } = areChoicesKnownTypes(typeSpecifier.elementType.choice);
          elmType = allChoicesKnown ? 'list_of_any' : 'list_of_others';
          if (!allChoicesKnown) elmDisplay = `List of Others (${typesOfChoices.join(', ')})`;
          else elmDisplay = `List of Any (${typesOfChoices.join(', ')})`;
        } else if (typeSpecifier.elementType.type === 'TupleTypeSpecifier') {
          elmType = 'list_of_others';
          elmDisplay = 'List of Others (Tuple)';
        } else if (typeSpecifier.elementType.type === 'NamedTypeSpecifier') {
          elmType = getTypeFromELMString(typeSpecifier.elementType.name);
          const convertedType = listTypeMap[elmType];
          if (!convertedType) elmDisplay = `List of Others (${elmType})`;
          if (elmType === 'MedicationRequest') elmDisplay = 'List of Medication Requests';
          elmType = convertedType ? convertedType : 'list_of_others';
        } else if (typeSpecifier.elementType.type === 'ListTypeSpecifier') {
          elmType = 'list_of_others';
          elmDisplay = 'List of Lists';
        } else if (typeSpecifier.elementType.type === 'IntervalTypeSpecifier') {
          elmType = 'list_of_others';
          elmDisplay = 'List of Intervals';
        } else {
          elmType = 'list_of_others';
          elmDisplay = 'List of Others (unknown)';
        }
        break;
      }
      case 'TupleTypeSpecifier': {
        elmType = 'other';
        elmDisplay = 'Other (Tuple)';
        break;
      }
      case 'ChoiceTypeSpecifier': {
        const { allChoicesKnown, typesOfChoices } = areChoicesKnownTypes(typeSpecifier.choice);
        elmType = allChoicesKnown ? 'any' : 'other';
        if (!allChoicesKnown) elmDisplay = `Other (Choice of ${typesOfChoices.join(', ')})`;
        break;
      }
      default: {
        elmType = 'other';
        elmDisplay = 'Other (unknown)';
        break;
      }
    }
  } else {
    elmType = 'other';
    elmDisplay = 'Other (unknown)';
  }

  return { elmType, elmDisplay };
}

function mapTypes(definitions) {
  const mappedDefinitions = definitions;
  mappedDefinitions.map(definition => {
    const { elmType, elmDisplay } = calculateType(definition);
    definition.calculatedReturnType = elmType || 'other';
    definition.displayReturnType = elmDisplay;

    if (definition.operand) {
      const calculatedInputTypes = [];
      const displayInputTypes = [];
      definition.operand.forEach(operand => {
        const { elmType, elmDisplay } = calculateType(operand);
        calculatedInputTypes.push(elmType || 'other');
        displayInputTypes.push(elmDisplay);
      });
      definition.calculatedInputTypes = calculatedInputTypes;
      definition.displayInputTypes = displayInputTypes;
    }
  });
  return mappedDefinitions;
}

function checkMatch(elmResults, files) {
  const libraryAndVersionRegex = /library\s+(([A-Za-z_][A-Za-z0-9_]*)|"(.+)")\s+version\s+'(.+)'/m;
  const fileForELMResult = files.find(file => {
    const matches = libraryAndVersionRegex.exec(file.text);
    const isMatch =
      matches && (matches[2] === elmResults.name || matches[3] === elmResults.name) && matches[4] === elmResults.version
    return isMatch;
  });
  return fileForELMResult;
}

const filterDefinition = def => (def.name !== 'Patient' && def.accessLevel === 'Public');

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

const collectLibraryElementsFromElement = (element, libraryName, libraryElements, modifierElements) => {
  // Collect external CQL elements associated with this library
  if (element.type === 'externalCqlElement') {
    const referenceField = element.fields.find(f => f.id === 'externalCqlReference');
    if (_.get(referenceField, 'value.library') === libraryName) libraryElements.push(element);
  }

  // Collect any elements that have external CQL functions associated with this library.
  if (element.modifiers) {
    element.modifiers.forEach((modifier) => {
      if (modifier.type === 'ExternalModifier' && modifier.libraryName === libraryName) modifierElements.push(element);
    });
  }
}

const collectLibraryElementsFromTree = (element, libraryName, libraryElements, modifierElements) => {
  let children = element.childInstances ? element.childInstances : [];
  children = children.map((child) => {
    if (child.childInstances) {
      return collectLibraryElementsFromTree(child, libraryName, libraryElements, modifierElements);
    } else {
      return collectLibraryElementsFromElement(child, libraryName, libraryElements, modifierElements);
    }
  });
  element.childInstances = children;
  return element;
}

const getExternalLibraryAndModifierElements = (artifact, libraryName) => {
  const libraryElements = [];
  const modifierElements = [];
  collectLibraryElementsFromTree(artifact.expTreeInclude, libraryName, libraryElements, modifierElements);
  collectLibraryElementsFromTree(artifact.expTreeExclude, libraryName, libraryElements, modifierElements);
  artifact.subpopulations.forEach((subpopulation) => {
    if (!subpopulation.special) {
      collectLibraryElementsFromTree(subpopulation, libraryName, libraryElements, modifierElements);
    }
  });
  artifact.baseElements.forEach((baseElement) => {
    if (baseElement.childInstances) {
      collectLibraryElementsFromTree(baseElement, libraryName, libraryElements, modifierElements);
    } else {
      collectLibraryElementsFromElement(baseElement, libraryName, libraryElements, modifierElements);
    }
  });
  return { libraryElements, modifierElements };
}

const shouldLibraryBeUpdated = (library, artifact) => {
  const statementReturnTypes = {};
  const elementReturnTypes = {};
  const statementArgs = {};
  const elementArgs = {};
  // In this situation, definitions and parameters behave identically, so they are bucketed together
  library.details.definitions.concat(library.details.parameters).forEach(def => {
    statementReturnTypes[def.name] = def.calculatedReturnType;
  });

  // The prefix for functions is added to delineate names from definitions, since both can have the
  // same name legally in CQL
  library.details.functions.forEach(func => {
    statementReturnTypes[`func:${func.name}`] = func.calculatedReturnType;
    statementArgs[`func:${func.name}`] = func.operand;
  });

  const { libraryElements, modifierElements } = getExternalLibraryAndModifierElements(artifact, library.name);

  // It's possible in the following calculation for elementReturnTypes and elementArgs that some of the fields
  // may be overwritten, but this is okay because all instances that we collect will be identical within the
  // same artifact
  libraryElements.forEach(el => {
    const referenceField = el.fields.find(f => f.id === 'externalCqlReference');
    const referenceFieldValueElement = referenceField.value.element;
    if (el.template === 'GenericFunction') {
      elementReturnTypes[`func:${referenceFieldValueElement}`] = el.returnType;
      elementArgs[`func:${referenceFieldValueElement}`] = referenceField.value.arguments;
    } else {
      elementReturnTypes[referenceFieldValueElement] = el.returnType;
    }
  });
  modifierElements.forEach(el => {
    el.modifiers.forEach(mod => {
      if (mod.type === 'ExternalModifier') {
        elementReturnTypes[`func:${mod.functionName}`] = mod.returnType;
        elementArgs[`func:${mod.functionName}`] = mod.arguments;
      }
    });
  });

  // If a library to update has contents whose names, return types, or args have changed, and the
  // artifact is using these contents, we cannot update it and we shouldn't make any upload/update
  let returnTypesMatch = true;
  let argsMatch = true;
  const deleteNestedMetadataProps = (obj) => {
    for (const prop in obj) {
        // These fields are not useful for comparison and can cause false differences between
        // data since they are only for metadata
        if (['annotation', 'localId', 'locator'].includes(prop)) {
          delete obj[prop];
        } else if (typeof obj[prop] === 'object') {
          deleteNestedMetadataProps(obj[prop]);
        }
    }
    return obj;
  }

  Object.keys(elementReturnTypes).forEach((key) => {
    returnTypesMatch = returnTypesMatch && (statementReturnTypes[key] === elementReturnTypes[key]);
    statementArgsToMatch = deleteNestedMetadataProps(_.cloneDeep(statementArgs[key]));
    elementArgsToMatch = deleteNestedMetadataProps(_.cloneDeep(elementArgs[key]));
    argsMatch = argsMatch && (_.isEqual(statementArgsToMatch, elementArgsToMatch));
  });

  return returnTypesMatch && argsMatch;
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
  let notFHIR = false;
  for (const file of elmFiles) {
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

    // Make sure there is no data model that isn't default System or FHIR.
    // If there is, we can break since none of this will be uploaded.
    const elmDefs = _.get(library, 'usings.def', []);
    notFHIR = elmDefs.some(def => !['System', 'FHIR'].includes(def.localIdentifier));
    if (notFHIR) break;
    
    // Find FHIR version used by library
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
    details.parameters = mapTypes(elmParameters);
    details.definitions = mapTypes(defineStatements);
    details.functions = mapTypes(functionStatements);
    const fileDependencies = _.get(library, 'includes.def', []);
    details.dependencies = fileDependencies;
    elmResults.details = details;
    elmResultsToSave.push(elmResults);
  }

  return { elmErrors, elmResultsToSave, notFHIR };
}

function doesUploadedLibraryMatchArtifactName(libraryName, artifactName){
  //the artifact may have spaces, which will be replace by a '-' upon export
  //therefore we will compare the uploaded library with a modified artifact name
  let tmpArtifactName = artifactName.replace(/\s/g,"-");
  //localeCompare returns 0 if they are equivalent.  the sensitivity option ignores characters with accents
  //https://stackoverflow.com/questions/2140627/how-to-do-case-insensitive-string-comparison
  return( libraryName.localeCompare(tmpArtifactName, undefined, { sensitivity: 'accent' }) === 0);
}

// Post a single external CQL library
function singlePost(req, res) {
  if (req.user) {
    const { cqlFileName, cqlFileContent, fileType, artifact } = req.body.library;
    const artifactId = artifact._id;
    let duplicateLib = {flag: false, libraryName: ''};
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

            const { elmErrors, elmResultsToSave, notFHIR } = parseELMFiles(elmFiles, artifactId, req.user.uid, files);

            elmResultsToSave.forEach(elmResult => {
              if(doesUploadedLibraryMatchArtifactName(elmResult.name, artifact.name)){
                duplicateLib.flag = true;
                duplicateLib.libraryName = elmResult.name;
                duplicateLib.fileName = elmResult.details.fileName;
              }
            });

            if(duplicateLib.flag){
              res.status(400).send('Upload failed because the external library \'' + duplicateLib.libraryName +
                '\' in the file \'' + duplicateLib.fileName +'\' shares the same name as the artifact itself.');
              return;
            }

            if (notFHIR) {
              res.status(400).send(`None of the libraries were uploaded because at least one
                uses a data model that is not FHIR®.`);
              return;
            }

            CQLLibrary.find({ user: req.user.uid, linkedArtifactId: artifactId }, (error, libraries) => {
              if (error) res.status(500).send(error);
              else {
                const nonAuthoringToolExportLibraries =
                  _.differenceWith(elmResultsToSave, authoringToolExports, (a, b) => a.name === b.name);
                const authoringToolExportLibraries = _.difference(elmResultsToSave, nonAuthoringToolExportLibraries);

                const nonDuplicateLibraries = _.differenceWith(
                  nonAuthoringToolExportLibraries,
                  libraries,
                  (a, b) => ((a.name === b.name) && (a.version === b.version))
                );
                const duplicateLibraries = _.difference(nonAuthoringToolExportLibraries, nonDuplicateLibraries);

                const librariesToInsert = _.differenceWith(
                  nonDuplicateLibraries,
                  libraries,
                  (a, b) => ((a.name === b.name) && (a.version !== b.version))
                );
                const librariesToUpdate = _.difference(nonDuplicateLibraries, librariesToInsert);
                
                const newLibFHIRVersion = getCurrentFHIRVersion(elmResultsToSave);
                const fhirVersion = getCurrentFHIRVersion(libraries);

                // If no FHIR version locked, any version can be uploaded.
                // If no FHIR version on any libraries being added, they can be added
                const fhirVersionsMatch = (fhirVersion && newLibFHIRVersion) ? fhirVersion === newLibFHIRVersion : true;
                // If new libraries have no FHIR version or it matches a supported FHIR version, we support it
                const supportedFHIRVersion = newLibFHIRVersion === '' ||
                  supportedFHIRVersions.findIndex(v => v === newLibFHIRVersion) !== -1;

                //If repeats of the same library are being uploaded (regardless of version), we will not support this
                const hasRepeats = (nonAuthoringToolExportLibraries.length !==
                  (new Set(nonAuthoringToolExportLibraries.map(l => l.name)).size));
                const exportLibrariesNotUploaded =
                  authoringToolExportLibraries.map(lib => `library ${lib.name}`).join(', ');
                const exportLibrariesNotUploadedMessage = `The following were not uploaded because a version of the \
                  library is included by default: ${exportLibrariesNotUploaded}.`;
                // If any file has an error, upload nothing.
                if (elmErrors.length > 0) {
                  res.status(400).send(elmErrors);
                } else if (!fhirVersionsMatch) {
                  const message = 'A library using a different version of FHIR® is uploaded. Only one FHIR® version \
                    can be supported at a time.';
                  res.status(400).send(message);
                } else if (!supportedFHIRVersion) {
                  res.status(400).send('Unsupported FHIR® version.');
                } else if (hasRepeats) {
                  const message = 'More than one library in this package has the same name. Only one library of the \
                    same name can be uploaded at a time.'
                  res.status(400).send(message);
                } else {
                  // If a library to update has contents whose names or return types have changed, and the
                  // artifact is using these contents, we cannot update it and we shouldn't make any upload/update
                  let shouldUpdate = true;
                  for (const library of librariesToUpdate) {
                    shouldUpdate = shouldLibraryBeUpdated(library, artifact);
                    if (!shouldUpdate) break;
                  }

                  if (shouldUpdate) {
                    // Emulates the functionality of Promise.allSettled() which is only supported as of Node 12.
                    // Any error that is thrown through updating should either be the same as an error
                    // encountered by the insertion below, or would have already been caught in the
                    // process above to determine whether we should update
                    Promise.all(librariesToUpdate.map(async (library) => {
                      return CQLLibrary.update({ user: req.user.uid, name: library.name }, library);
                    }).map(p => p.catch(e => null)));

                    CQLLibrary.insertMany(librariesToInsert, (error, response) => {
                      if (error) {
                        res.status(500).send(error);
                      } else if (duplicateLibraries.length > 0) {
                        // NOTE: Really, we should re-run cql-to-elm with the existing version of the duplicate files to
                        // confirm they work with the non-duplicate libraries.
                        const librariesNotUploaded =
                          duplicateLibraries.map(lib => `library ${lib.name} version ${lib.version}`).join(', ');
                        let message = `The following was not uploaded because a library with identical name \
                          and version already exists: ${librariesNotUploaded}.`;
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
                          let updateMessage;
                          if (librariesToUpdate.length > 0) updateMessage =
                            'One or more of the libraries on this artifact have been updated.';
                          if (newLibFHIRVersion) {
                            Artifact.update({ user: req.user.uid, _id: artifactId }, { fhirVersion: newLibFHIRVersion },
                              (error, response) => {
                                if (error) res.status(500).send(error);
                                else if (response.n === 0) res.sendStatus(404);
                                else if (updateMessage) res.status(201).send(updateMessage);
                                else res.status(201).json(response);
                              });
                          } else {
                            if (updateMessage) res.status(201).send(updateMessage);
                            else res.status(201).json(response);
                          }
                        }
                      }
                    });
                  } else {
                    const message = 'The libraries could not be uploaded/updated because the artifact uses content \
                      from at least one library that has changed between versions.';
                    res.status(400).send(message);
                  }
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

        const { elmErrors, elmResultsToSave, notFHIR } = parseELMFiles(elmFiles, artifactId, req.user.uid, files);

        if (notFHIR) {
          res.status(400).send('Library uses a data model that is not FHIR®.');
          return;
        }

        elmResultsToSave.forEach(elmResult => {
          if(doesUploadedLibraryMatchArtifactName(elmResult.name, artifact.name)){
            duplicateLib.flag = true;
            duplicateLib.libraryName = elmResult.name;
          }
        });

        if(duplicateLib.flag){
          res.status(400).send('Upload failed because the external library \'' + duplicateLib.libraryName +
            '\' shares the same name as the artifact itself.');
          return;
        }

        CQLLibrary.find({ user: req.user.uid, linkedArtifactId: artifactId }, (error, libraries) => {
          if (error) res.status(500).send(error);
          else {
            const elmResult = elmResultsToSave[0]; // This is the single file upload case, so elmResultsToSave will only ever have one item.
            const defaultLibrary = authoringToolExports.map(l => l.name).includes(elmResult.name);
            const dupName = libraries.find(lib => lib.name === elmResult.name);
            const dupVersion = libraries.find(lib => lib.version === elmResult.version);
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
            } else if (defaultLibrary) {
              res.status(200).send('Library is already included by default, so it was not uploaded.');
            } else if (!fhirVersionsMatch) {
              const message = 'A library using a different version of FHIR® is uploaded. Only one FHIR® version can be \
                supported at a time.';
              res.status(400).send(message);
            } else if (!supportedFHIRVersion) {
              res.status(400).send('Unsupported FHIR® version.');
            } else if (dupName) {
              if (dupVersion) {
                res.status(200).send('Library with identical name and version already exists.');
              } else {
                if (shouldLibraryBeUpdated(elmResult, artifact)) {
                  CQLLibrary.update({ user: req.user.uid, name: elmResult.name }, elmResult,
                    (error) => {
                      const message = `Library ${elmResult.name} successfully updated to version ${elmResult.version}.`;
                      if (error) res.status(500).send(error);
                      else res.status(200).send(message);
                    });
                } else {
                  const message = 'Library could not be updated, because the artifact uses content that has \
                    changed between versions.';
                  res.status(400).send(message);
                }
              }
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
