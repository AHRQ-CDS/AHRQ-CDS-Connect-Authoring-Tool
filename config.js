module.exports = {
  mongodb: {
    localhost: 'mongodb://localhost/cds_authoring'
  },
  api: {
    baseUrl: '/api'
  },
  repo: {
    baseUrl: process.env.REPO_BASE_URL || 'https://cdsconnect.ahrqdev.org',
    //  baseUrl: process.env.REPO_BASE_URL || "http://localhost:8083"
  },
  cql2elm: {
    disabled: process.env.CQL_TO_ELM_DISABLED === 'true' || false, // only disable for development purposes
    baseUrl: process.env.CQL_TO_ELM_URL || 'http://localhost:8080/cql/translator'
  }
};
