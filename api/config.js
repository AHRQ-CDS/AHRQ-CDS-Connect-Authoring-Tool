const convict = require('convict');
const validator = require('validator');
const fs = require('fs');

function laxUrl(...protocols) {
  return (val) => {
    if (!validator.isURL(val, { protocols, require_tld: false, allow_underscores: true })) {
      throw new Error(`must be a URL with protocol from {${protocols}}`);
    }
  };
}

// Define the schema
const config = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  mongo: {
    url: {
      doc: 'The connection URL for MongoDB.',
      format: laxUrl('mongodb'),
      default: 'mongodb://localhost/cds_authoring',
      env: 'MONGO_URL',
    }
  },
  repo: {
    url: {
      doc: 'The URL to the CDS Connect repository.',
      format: laxUrl('http', 'https'),
      default: 'https://cdsconnect.ahrqdev.org',
      env: 'REPO_URL',
    },
    publish: {
      active: {
        doc: 'Indicates if publishing to the repo is active.',
        format: 'Boolean',
        default: false,
        env: 'REPO_PUBLISH_ACTIVE',
      }
    }
  },
  cqlToElm: {
    url: {
      doc: 'The URL endpoint for the CQL translation service.',
      format: laxUrl('http', 'https'),
      default: 'http://localhost:8080/cql/translator',
      env: 'CQL_TO_ELM_URL',
    },
    active: {
      doc: 'Indicates if CQL translation is active (only disable for dev)',
      format: 'Boolean',
      default: true,
      env: 'CQL_TO_ELM_ACTIVE',
    }
  },
  auth: {
    session: {
      secret: {
        doc: 'The session secret.',
        format: 'String',
        default: 'secret',
        env: 'AUTH_SESSION_SECRET',
        sensitive: true
      }
    },
    ldap: {
      server: {
        doc: 'LDAP config passed into passport for authentication.  The tokens `{{username}}` and `{{password}}`' +
          'will be replaced during authentication with the authenticating username and password.',
        url: {
          doc: 'The LDAP connection URL.',
          format: laxUrl('ldap', 'ldaps'),
          default: 'ldap://localhost:389',
          env: 'AUTH_LDAP_URL',
        },
        bindDN: {
          doc: 'The LDAP bind DN.',
          format: 'String',
          default: 'cn=root',
          env: 'AUTH_LDAP_BIND_DN',
        },
        bindCredentials: {
          doc: 'The LDAP bind credentials.',
          format: 'String',
          default: 'secret',
          env: 'AUTH_LDAP_BIND_CREDENTIALS',
          sensitive: true
        },
        searchBase: {
          doc: 'The LDAP search base.',
          format: 'String',
          default: 'ou=passport-ldapauth',
          env: 'AUTH_LDAP_SEARCH_BASE',
        },
        searchFilter: {
          doc: 'The LDAP search filter.',
          format: 'String',
          default: '(uid={{username}})',
          env: 'AUTH_LDAP_SEARCH_FILTER',
        }
      }
    },
    useLocalStrategy: {
      active: {
        doc: 'Indicates if the local auth strategy should be used',
        format: 'Boolean',
        default: false,
        env: 'AUTH_USE_LOCAL_STRATEGY',
      },
      file: {
        doc: 'File to authenticate user credentials against',
        fomrat: 'String',
        default: 'demo_users.json',
        env: 'AUTH_LOCAL_STRATEGY_FILEPATH'
      }
    }
  },
  tlsRejectUnauthorized: {
    doc: 'Indicates if TLS should reject unauthorized certifates.  Never disable in production!',
    format: ['0', '1'],
    default: '1',
    env: 'NODE_TLS_REJECT_UNAUTHORIZED',
  }
});

// Load environment dependent configuration
const files = [];
// Look for an environment-based file (e.g., config/production.json)
const envFile = `./config/${config.get('env')}.json`;
if (fs.existsSync(envFile)) {
  files.push(envFile);
}
// Look for a local config file to override config locally (in development)
const localFile = './config/local.json';
if (fs.existsSync(localFile)) {
  files.push(localFile);
}
// Load any config files that were found.  If no, default value will be used.
if (files.length > 0) {
  config.loadFile(files);
}

// Perform validation
config.validate({ allowed: 'strict' });

console.log('Loaded config:', config.toString());

module.exports = config;
