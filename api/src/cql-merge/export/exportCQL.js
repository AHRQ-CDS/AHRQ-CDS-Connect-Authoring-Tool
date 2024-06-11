const { CQLExporter } = require('./CQLExporter');

function exportCQL(libraryGroup) {
  const exporter = new CQLExporter();
  return exporter.export(libraryGroup);
}

module.exports = { exportCQL };
