import slug from 'slug';
import _ from 'lodash';

import cql from 'cql-execution';
import cqlfhir from 'cql-exec-fhir';

function convertParameters(params = []) {
  const paramsObj = {};
  params.forEach(p => {
    // Handle the null case first so we don't have to guard against it later
    if (p.value == null) {
      paramsObj[p.name] = null;
      return;
    }
    switch (p.type) {
      case 'boolean':
        paramsObj[p.name] = p.value === 'true';
        break;
      case 'datetime':
        paramsObj[p.name] = cql.DateTime.parse(p.value.str.slice(1));
        break;
      case 'decimal':
        paramsObj[p.name] = parseFloat(p.value.decimal);
        break;
      case 'integer':
        paramsObj[p.name] = parseInt(p.value);
        break;
      case 'interval_of_datetime': {
        let d1 = null;
        let d2 = null;
        if (p.value.firstDate) {
          const str = p.value.firstTime ? `${p.value.firstDate}T${p.value.firstTime}` : p.value.firstDate;
          d1 = cql.DateTime.parse(str);
        }
        if (p.value.secondDate) {
          const str = p.value.secondTime ? `${p.value.secondDate}T${p.value.secondTime}` : p.value.secondDate;
          d2 = cql.DateTime.parse(str);
        }
        paramsObj[p.name] = new cql.Interval(d1, d2);
        break;
      }
      case 'interval_of_decimal':
        paramsObj[p.name] = new cql.Interval(parseFloat(p.value.firstDecimal), parseFloat(p.value.secondDecimal));
        break;
      case 'interval_of_integer':
        paramsObj[p.name] = new cql.Interval(parseInt(p.value.firstInteger), parseInt(p.value.secondInteger));
        break;
      case 'interval_of_quantity': {
        const q1 =
          p.value.firstQuantity != null
            ? new cql.Quantity({
                value: p.value.firstQuantity,
                unit: p.value.unit
              })
            : null;
        const q2 =
          p.value.secondQuantity != null
            ? new cql.Quantity({
                value: p.value.secondQuantity,
                unit: p.value.unit
              })
            : null;
        paramsObj[p.name] = new cql.Interval(q1, q2);
        break;
      }
      case 'string':
        // Remove the leading and trailing single-quotes
        paramsObj[p.name] = p.value.replace(/^'(.*)'$/, '$1');
        break;
      case 'system_code':
        paramsObj[p.name] = new cql.Code(p.value.code, p.value.uri);
        break;
      case 'system_concept':
        paramsObj[p.name] = new cql.Concept([new cql.Code(p.value.code, p.value.uri)]);
        break;
      case 'system_quantity':
        paramsObj[p.name] = new cql.Quantity({
          value: p.value.quantity,
          unit: p.value.unit
        });
        break;
      case 'time':
        // CQL exec doesn't expose a Time class, so we must construct a DT and then get the Time
        paramsObj[p.name] = cql.DateTime.parse(`@0000-01-01${p.value.str.slice(1)}`).getTime();
        break;
      default: // do nothing
    }
  });
  return paramsObj;
}

const executeArtifact = async ({ elmFiles, artifact, params, patients, vsacApiKey, codeService, dataModel }) => {
  const artifactName = `${slug(artifact.name ? artifact.name : 'untitled', { lower: false })}`;

  // Set up the library
  const elmFile = JSON.parse(
    _.find(elmFiles, f => f.name.replace(/[\s-\\/]/g, '') === artifactName.replace(/[\s-\\/]/g, '')).content
  );
  const libraries = _.filter(
    elmFiles,
    f => f.name.replace(/[\s-\\/]/g, '') !== artifactName.replace(/[\s-\\/]/g, '')
  ).map(f => JSON.parse(f.content));
  const library = new cql.Library(elmFile, new cql.Repository(libraries));
  // Set up the parameters
  const cqlExecParams = convertParameters(params);

  // Create the patient source
  let patientSource;
  if (dataModel.version === '1.0.2') {
    patientSource = cqlfhir.PatientSource.FHIRv102();
  } else if (dataModel.version === '3.0.0') {
    patientSource = cqlfhir.PatientSource.FHIRv300();
  } else if (dataModel.version === '4.0.0') {
    patientSource = cqlfhir.PatientSource.FHIRv400();
  } else {
    patientSource = cqlfhir.PatientSource.FHIRv401();
  }

  // Load the patient source with the patient
  patientSource.loadBundles(patients);

  // Ensure value sets, downloading any missing value sets
  await codeService.ensureValueSets(elmFile.library?.valueSets?.def || [], vsacApiKey);

  // Value sets are loaded, so execute!
  const executor = new cql.Executor(library, codeService, cqlExecParams);
  return executor.exec(patientSource);
};

export default executeArtifact;
