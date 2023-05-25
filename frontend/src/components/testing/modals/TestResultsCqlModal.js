import React from 'react';
import PropTypes from 'prop-types';
import { Modal, CqlViewer } from 'components/elements';
import _ from 'lodash';

// Given a CQL execution result format it for display, returning an array of lines (since there can be more than one)
const formatResult = result => {
  // Handle each type of result we might see. Use getters instead of constructor names since webpack may mangle names.
  if (Array.isArray(result)) {
    // It's a list of items, which we handle recursively
    let formattedResult = [
      `List of ${result.length} item${result.length === 1 ? '' : 's'}${result.length === 0 ? '' : ':'}`
    ];
    formattedResult = formattedResult.concat(result.map(r => formatResult(r)));
    return formattedResult;
  } else if (result?.isQuantity || result?.isConcept || result?.isCode) {
    // It's a simple type where we can just show the JSON representation
    return [JSON.stringify(result)];
  } else if (typeof result?.getTypeInfo === 'function') {
    // It's a FHIR object; For patients we try to pull out the name, otherwise we just pull out the type and ID
    if (result.getTypeInfo()?.name === 'Patient') {
      // NOTE: getPatientFullName operates on a different object type, so we can't use that
      const given = _.get(result, 'name[0].given[0]')?.value || '';
      const family = _.get(result, 'name[0].family')?.value || '';
      const name = given.length > 0 || family.length > 0 ? `${given} ${family}` : 'Unknown Name';
      return [`Patient ${name}`];
    } else {
      const type = result.getTypeInfo()?.name || 'Unknown type';
      return [`${type} with ID ${result.id?.value}`];
    }
  } else {
    // For everything else we just rely on native string conversion
    return [String(result)];
  }
};

const TestResultsCqlModal = ({ handleCloseModal, results, cqlFiles, elmFiles }) => {
  // Go through all the results keys, look up the location of the key in the CQL by using the ELM, and
  // annotate the ELM with the results

  // TODO: This does not currently handle any libraries

  // Note: We assume that the CQL file we want to display is the first one present (and we find the matching
  // ELM file since they may not be in the same order)

  const cqlFile = cqlFiles[0];
  const elmFile = elmFiles.find(ef => ef.name === cqlFile.name);
  const cql = cqlFile.text.split('\n'); // It's easier to annotate the CQL if it's an array
  const elm = JSON.parse(elmFile.content); // Grab the ELM as JSON
  // Find all the statement locations in the CQL using ELM locators
  const statementLocations = [];
  for (const resultName of Object.keys(results)) {
    const statement = elm.library.statements.def.find(statement => statement.name === resultName);
    const locator = statement?.locator;
    if (locator) {
      const lastLine = locator.split('-').at(-1).split(':').at(0);
      statementLocations.push({ resultName, lastLine });
    }
  }
  // We start at the end since we modify the CQL in place and that way we don't have to do line number math
  for (let { resultName, lastLine } of statementLocations.sort((a, b) => b.lastLine - a.lastLine)) {
    cql.splice(lastLine, 0, '', ...formatResult(results[resultName]).map(r => `==> ${r}`));
  }

  return (
    <Modal
      closeButtonText="Close"
      handleCloseModal={handleCloseModal}
      handleSaveModal={handleCloseModal}
      hasCancelButton
      hideSubmitButton
      isOpen
      title="Detailed CQL Execution Results"
    >
      <CqlViewer code={cql.join('\n')} />
    </Modal>
  );
};

TestResultsCqlModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  results: PropTypes.object.isRequired,
  cqlFiles: PropTypes.array.isRequired,
  elmFiles: PropTypes.array.isRequired
};

export default TestResultsCqlModal;
