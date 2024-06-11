const { CQLImporter } = require('./CQLImporter');

function importCQL(libraryRawCQL, dependencyRawCQLs) {
  const importer = new CQLImporter();

  return importer.import(libraryRawCQL, dependencyRawCQLs);
}

module.exports = { importCQL };
