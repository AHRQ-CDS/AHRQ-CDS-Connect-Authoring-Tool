class CQLExporter {
  export(libraryGroup) {
    const functions = new Map();
    const concepts = new Map();
    const codes = new Map();
    const codesystems = new Map();
    libraryGroup.dependencies.forEach(dependency => {
      // Collect all functions needed from dependencies
      dependency.rawFunctions.forEach((functionText, functionName) => {
        const localIdentifier = libraryGroup.library.includeNames.get(dependency.libraryName);
        const localFunctionName = `${localIdentifier}.${functionName}`;
        const localFunctionRegex = new RegExp(`${localFunctionName}\\s*\\(`, 'g');

        libraryGroup.library.rawExpressions.forEach(expressionText => {
          if (localFunctionRegex.test(expressionText)) {
            functions.set(localFunctionName, functionText);
          }
        });
      });

      // Collect all functions needed from functions
      // TODO: This only goes one level deep, but we want it to be deeply recursive
      dependency.rawFunctions.forEach((functionText, functionName) => {
        const localIdentifier = libraryGroup.library.includeNames.get(dependency.libraryName);
        const localFunctionName = `${localIdentifier}.${functionName}`;
        functions.forEach(outerFunctionText => {
          if (new RegExp(`${functionName}\\s*\\(`, 'g').test(outerFunctionText)) {
            functions.set(localFunctionName, functionText);
          }
        });
      });

      // Collect all concepts needed from functions
      dependency.rawConcepts.forEach((conceptText, conceptName) => {
        functions.forEach(functionText => {
          if (new RegExp(`\\s*${conceptName}\\s*`, 'g').test(functionText)) {
            concepts.set(conceptName, conceptText);
          }
        });
      });

      // Collect all codes needed from functions and concepts
      dependency.rawCodes.forEach((codeText, codeName) => {
        functions.forEach(functionText => {
          if (new RegExp(`\\s*${codeName}\\s*`, 'g').test(functionText)) {
            codes.set(codeName, codeText);
          }
        });

        concepts.forEach(conceptText => {
          if (new RegExp(`\\s*${codeName}\\s*`, 'g').test(conceptText)) {
            codes.set(codeName, codeText);
          }
        });
      });

      // Collect all codesystems needed from codes
      dependency.rawCodesystems.forEach((codesystemText, codesystemName) => {
        codes.forEach(codeText => {
          if (new RegExp(`\\s*${codesystemName}\\s*`, 'g').test(codeText)) {
            codesystems.set(codesystemName, codesystemText);
          }
        });
      });
    });

    // Append all functions to library content
    let output = [libraryGroup.library.raw.content].concat(Array.from(functions.values())).join('\n\n').concat('\n');

    // Replace namespaced function names with local names
    Array.from(functions.keys()).forEach(functionName => {
      const functionNameWithoutNamespace = functionName.split('.').pop();
      output = output.replace(new RegExp(functionName, 'g'), functionNameWithoutNamespace);
    });

    // Remove all include statements for merged dependencies
    libraryGroup.getDependencyNames().forEach(name => {
      const regex = new RegExp(`include.+${name}.+\\s+`, 'g');
      output = output.replace(regex, '');
    });

    // Add concept, code, and codesystems
    // Remove whitespace before the 'context' statement
    // The following process is dependent on the structure of authoring tool output
    // TODO: We may want to change this to not depend on line breaks in the future
    // TODO: We may want to depend on not looking for 'context' and 'include' in the future
    const splitOutput = output.split('\n');
    let codesystemIndex = splitOutput.map(line => line.trim().split(/\s/g)[0]).lastIndexOf('codesystem');
    if (codesystemIndex < 0) {
      codesystemIndex = splitOutput.map(line => line.trim().split(/\s/g)[0]).lastIndexOf('include');
    }
    codesystems.forEach(codesystemText => {
      splitOutput.splice(codesystemIndex + 1, 0, codesystemText);
    });

    let codeIndex = splitOutput.map(line => line.trim().split(/\s/g)[0]).lastIndexOf('code');
    if (codeIndex < 0) {
      codeIndex = splitOutput.map(line => line.trim().split(/\s/g)[0]).indexOf('parameter') - 1;
    }
    if (codeIndex < 0) {
      codeIndex = splitOutput.map(line => line.trim().split(/\s/g)[0]).indexOf('context') - 1;
    }
    codes.forEach(codeText => {
      splitOutput.splice(codeIndex + 1, 0, codeText);
    });

    let conceptIndex = splitOutput.map(line => line.trim().split(/\s/g)[0]).lastIndexOf('concept');
    if (conceptIndex < 0) {
      conceptIndex = splitOutput.map(line => line.trim().split(/\s/g)[0]).indexOf('parameter') - 1;
    }
    if (conceptIndex < 0) {
      conceptIndex = splitOutput.map(line => line.trim().split(/\s/g)[0]).indexOf('context') - 1;
    }
    concepts.forEach(conceptText => {
      splitOutput.splice(conceptIndex + 1, 0, conceptText);
    });

    const contextIndex = splitOutput.findIndex(line => line.trim().split(/\s/g)[0] === 'context');
    output = splitOutput
      .filter((line, index) => {
        return index >= contextIndex || line.trim();
      })
      .join('\n');
    return output;
  }
}

module.exports = { CQLExporter };
