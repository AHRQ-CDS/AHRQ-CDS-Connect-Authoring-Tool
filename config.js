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
  },
  auth: {
    sessionSecret: process.env.AUTH_SECRET || 'secret',
    ldap: {
      server: {
        url: process.env.AUTH_LDAP_URL || 'ldap://localhost:389',
        bindDN: process.env.AUTH_LDAP_BIND_DN || 'cn=root',
        bindCredentials: process.env.AUTH_LDAP_BIND_CREDENTIALS || 'secret',
        searchBase: process.env.AUTH_LDAP_SEARCH_BASE || 'ou=passport-ldapauth',
        searchFilter: process.env.AUTH_LDAP_SEARCH_FILTER || '(uid={{username}})'
      }
    }
  }
};
