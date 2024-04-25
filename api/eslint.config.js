const plugins = require('@eslint/js');
const globals = require('globals');

const config = [
  plugins.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.es2015,
        ...globals.node,
        ...globals.mocha
      }
    },
    rules: {
      'no-param-reassign': ['error', { props: false }],
      'no-underscore-dangle': ['error', { allow: ['_id'] }], // because mongo
      'no-unused-vars': ['error', { args: 'none' }], // don't check function arguments
      'no-use-before-define': ['error', 'nofunc'],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }] // allow ++ in for loop expression
    },
    ignores: ['localDependencies/*']
  }
];

module.exports = config;
