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
brew install yarn # install node
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

## Docker

This project can also be built into a Docker image and deployed as a Docker container.  To do any of the commands below, [Docker](https://www.docker.com/) must be installed.

### Building the docker image

To build the Docker image, execute the following command from the project's root directory:
```bash
docker build -t cdsauthoringtoolapi .
```

### Running the docker container

For the authoring tool API to run in a docker container, MongoDB and CQL-to-ELM docker containers must be linked.  The following commands run the necessary containers, with the required links and exposed port:
```bash
docker run --name cat-cql2elm -d cqframework/cql-translation-service:v1.2.16
docker run --name cat-mongo -d mongo:3.4
docker run --name cat-api
  --link cat-cql2elm:cql2elm
  --link cat-mongo:mongo
  -e "NODE_ENV=production" \
  -e "REPO_BASE_URL=https://cdsconnect.ahrqdev.org/" \
  -e "REPO_URL=https://cdsconnect.ahrqdev.org/" \
  -e "CQL_TO_ELM_URL=http://cql2elm:8080/cql/translator" \
  -e "MONGO_URL=mongodb://mongo/cds_authoring" \
  -e "AUTH_SESSION_SECRET=secret" \
  -e "AUTH_LDAP_URL=ldap://localhost:389" \
  -e "AUTH_LDAP_BIND_DN=cn=root" \
  -e "AUTH_LDAP_BIND_CREDENTIALS={{password}}" \
  -e "AUTH_LDAP_SEARCH_BASE=ou=passport-ldapauth" \
  -e "AUTH_LDAP_SEARCH_FILTER=(uid={{username}})" \
  -p "3001:3001" \
  cdsauthoringtoolapi
```
Of course you will need to modify some of the values above according to your environment.  Also, note that this is just the API.  See the frontend README for info about running the frontend container.

To run the CDS Authoring Tool API in a detached process, add a `-d` to the run command (before `cdsauthoringtoolapi`).

When the containers are running, access the api at [http://localhost:3001/authoring/api](http://localhost:3001/authoring/api).

To stop the containers:
```bash
docker stop cat-api cat-mongo cat-cql2elm
```

To start the containers again:
```bash
docker start cat-cql2elm cat-mongo cat-api
```

To remove the containers (usually when building new images):
```bash
docker rm cat-api cat-mongo cat-cql2elm
```

**NOTE: This configuration stores data in Mongo's container.  This means it is tied to the lifecycle of the mongo container and is _not_ persisted when the container is removed.**

### Bonus: Running Tests in Docker

To run the tests in the docker image (for example, to ensure it works before deploying), run the following command:
```bash
docker run --rm -e "CI=true" -e "NODE_ENV=test" cdsauthoringtoolapi yarn test
```
