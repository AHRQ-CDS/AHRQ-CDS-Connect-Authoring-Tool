# CDS Connect Authoring Tool API

## About
The CDS Connect Authoring Tool API provides a RESTful backend for the CDS Authoring Tool React web frontend.

## License
TODO

## Development Details

This project represents the M, E, and N in the MERN application architecture, using MongoDB, Express, and Node.

To develop and run this project, your must install mongodb, node, and yarn.  On Mac OS X, this can be done through brew:
```bash
brew install mongodb # install mongodb on host system
brew services start mongodb # start mongo
brew install node # install node
brew install yarn # install yarn
```
For other operating systems, use the instructions provided in each tool's online documentation.

Once the prerequisite tools are installed, use yarn to install the dependency libraries:
```bash
yarn # e.g. yarn install. installs this app's dependencies based on this project's yarn.lock / package.json
```

By default, the project will attempt to convert CQL to ELM on download or publish.  To disable this in development, see the configuration section below.  If enabled, you will need the CQL-to-ELM translation service, a Java application that can be run locally via Maven or Docker.
* To run locally with Maven: https://github.com/cqframework/cql-translation-service
* To run locally with Docker, install Docker and run: `docker run -p 8080:8080 cqframework/cql-translation-service:v1.2.16`

### Add / Remove / Adjust dependencies
```bash
yarn add <thing> # add a package. add --dev if this is a development dependency.
yarn add <thing>@<version> # will adjust version
yarn remove <thing> # remove a package.
```

### Configuration

This project uses the popular [convict](https://www.npmjs.com/package/convict) module to manage configuration.  The configuration schema and default values can be found at `config.js`, and an example config file can be found at `config/example.json`.

The API server will uses the `NODE_ENV` environment variable to detect the active environment: `production`, `development`, or `test` (defaulting to `development` when no environment is supplied).  If a corresponding configuration file (`config/${NODE_ENV}.json`) is present, it will merge its values into the default configuration.

For local development, a `config/local.json` file can also be used to override configuration settings.  It has precedence over the environment-based configuration and default configuration.

Lastly, most aspects of config can also be overridden via specific environment variables.  See the `config.js` configuration schema for the relevant environment variable names.

### Run

`yarn start` will run the api server:
```bash
yarn start # run the api server
```

`yarn start-dev` will run the api server in development mode, reloading the server when changes are detected.
```bash
yarn run start-dev # run the api server with hot-reloading for development
```

### Linting

JavaScript linting is done using ESLint.

```bash
yarn run lint # runs eslint using the configuration in .eslintrc.
yarn run lint:fix # runs eslint --fix using the configuration in .eslintrc. The --fix flag will autocorrect minor errors
```

### Testing

API server testing uses [Chai](http://chaijs.com/) with [Mocha](http://mochajs.org/) as the test runner.

```bash
yarn test # runs all api tests
```

### Docker

For information on running the CDS Authoring Tool in Docker, see the main [README](../README.md).
