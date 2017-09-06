# CDS Connect Authoring Tool

## About
Developed by The MITRE Corporation, the CDS Connect Authoring Tool is a project aimed at simplifying the creation of production-ready CQL code. The project is based on "concept templates" (e.g. gender, HDL Cholesterol, etc.), which allow for additional clinical concepts to be included in the future. Concept modifiers are included to allow for more flexible definitions (e.g. most recent, value comparisons, etc.).

## License
TODO

## Development Details

The project leverages the MERN application architecture, using MongoDB, Express, React, and Node. One way to install the requisite tools:

```bash
brew install mongodb # install mongodb on host system
brew services start mongodb # start mongo
brew install node # install node
npm install -g yarn # npm included with node, install yarn
yarn # e.g. yarn install. installs this app's dependencies based on this project's yarn.lock / package.json
```

The React part was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). Relevant files are in the `src/` filter. Refer to the Create React App [User Guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md) for guidance on features and how to perform common tasks.

The backend is an Express-based Node app, with relevant files located in `app/`.

### Add / Remove / Adjust dependencies
```bash
yarn add <thing> # add a package. add --dev if this is a development dependency.
yarn add <thing>@<version> # will adjust version
yarn remove <thing> # remove a package.
```

### Run

`yarn run start-dev` will run all of the items listed in the `Procfile`. Note: Mongodb needs to be installed so `mongod` runs properly.

```bash
yarn run start-dev # run the app
```

### Linting
TODO: Add linting for the API javascript

JavaScript linting is done on the React components by ESLint, extending the rulesets from [react-app](https://github.com/facebookincubator/create-react-app/tree/master/packages/eslint-config-react-app), [Airbnb](https://github.com/airbnb/javascript) _and_ [jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) for accessibility checking. Please refer to those rulesets and use the [Airbnb JSX/React style guide](https://github.com/airbnb/javascript/tree/master/react).

Sass linting is done by Stylelint, using the [Stylelint standard config](https://github.com/stylelint/stylelint-config-standard).

```bash
yarn run lint # runs eslint --fix src/* using the configuration in .eslintrc. The --fix flag will autocorrect minor errors
yarn run lint-css # runs stylelint 'src/styles/**/*.scss' using the configuration in .stylelintrc
```

### Testing
Frontend testing uses [jsdom](https://github.com/tmpvar/jsdom) with [Jest](https://facebook.github.io/jest/) as the test runner. [Enzyme](http://airbnb.io/enzyme/docs/api/index.html) provides helpers. Backend testing uses [Chai](http://chaijs.com/) with [Mocha](http://mochajs.org/) as the test runner. Run tests with

```bash
yarn run test # runs all frontend tests
yarn test # also runs all frontend tests
yarn test -- --coverage # view frontend test coverage
yarn run test-backend # runs all backend tests
yarn test-backend # also runs all backend tests
```

Jest provides the overall testing framework. The default setup running Jest via `yarn run test` will only run any tests that have been updated since the last commit. Use the prompt to specify running all tests or specific tests. Useful tools it provides are:
* [Setup and teardown](https://facebook.github.io/jest/docs/setup-teardown.html#content) methods
* [Matchers](https://facebook.github.io/jest/docs/expect.html) (assertions) to write statements expressing what a given value should be
* [Mock functions](https://facebook.github.io/jest/docs/mock-function-api.html#content) to test a component without having to include all needed functionality
* [Snapshot testing](https://facebook.github.io/jest/docs/snapshot-testing.html)

Enzyme is used for rendering and manipulating DOM elements. Shallow rendering will render a component without rendering any other components that are children, whereas full rendering will render a component with all its children components. Our rendered components can get and set state or props, find certain strings, classes, or tags, and simulate events.
* [Shallow rendering](http://airbnb.io/enzyme/docs/api/shallow.html) API reference
* [Full rendering](http://airbnb.io/enzyme/docs/api/mount.html) API reference

Helpful articles on working with Jest and Enzyme:
* https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f (apparently Enzyme has a debug method that I learned just now from this..)
* https://www.sitepoint.com/test-react-components-jest/

## Docker

This project can also be built into a Docker image and deployed as a Docker container.  To do any of the commands below, [Docker](https://www.docker.com/) must be installed.

### Building the docker image

To build the Docker image, execute the following command from the project's root directory:
```
docker build -t cdsauthoringtool .
```

### Running the docker container

For the authoring tool to run in a docker container, MongoDB and CQL-to-ELM docker containers must be linked.  The following commands create the links, as well as expose the necessary ports to access the application from the host system:
```
docker run --name cat-cql2elm -d cqframework/cql-translation-service:v1.2.10-SNAPSHOT
docker run --name cat-mongo -d mongo:3.4
docker run --name cat --link cat-cql2elm:cql2elm --link cat-mongo:mongo -e "REPO_BASE_URL=https://cdsconnect.ahrqdev.org" -e "CQL_TO_ELM_URL=http://cql2elm:8080/cql/translator" -e "MONGO_URL=mongodb://mongo/cds_authoring" -p "9000:9000" cdsauthoringtool
```

By default, the server on port 9000 will proxy requests on _/api_ to the local API server using express-http-proxy.  In production environments, a dedicated external proxy server may be desired.  In that case, the external proxy server will be responsible for proxying _/api_ to port 3001.  To accomodate this, disable the express-http-proxy and expose port 3001.  Instead of the last command above, run this instead:
```
docker run --name cat --link cat-cql2elm:cql2elm --link cat-mongo:mongo -e "REPO_BASE_URL=https://cdsconnect.ahrqdev.org" -e "CQL_TO_ELM_URL=http://cql2elm:8080/cql/translator" -e "MONGO_URL=mongodb://mongo/cds_authoring" -e "DISABLE_API_PROXY=true" -p "9000:9000" -p "3001:3001" cdsauthoringtool
```

To run the CDS Authoring Tool in a detached process, add a `-d` to the run command (before `cdsauthoringtool`).

When the containers are running, access the app at [http://localhost:9000](http://localhost:9000).

To stop the containers:
```
docker stop cat cat-mongo cat-cql2elm
```

To start the containers again:
```
docker start cat-cql2elm cat-mongo cat
```

To remove the containers (usually when building new images):
```
docker rm cat cat-mongo cat-cql2elm
```

**NOTE: This configuration stores data in Mongo's container.  This means it is tied to the lifecycle of the mongo container and is _not_ persisted when the container is removed.**

### Using Docker Compose

Alternately, use Docker Compose to build and run the containers.  Execute:
```
docker-compose up
```

The first time, it will build the cdsauthoringtool_cat image.  Subsequent times it may re-use the already built image.  To force it to rebuild, pass in the `--build` flag.

To stop _and remove_ the containers, run:
```
docker-compose down
```

**NOTE: This configuration stores data in Mongo's container.  This means it is tied to the lifecycle of the mongo container and is _not_ persisted when the container is removed.**

### Bonus: Running Tests in Docker

To run the tests in the docker image (for example, to ensure it works before deploying), run the following command:
```
docker run --rm -e "CI=true" cdsauthoringtool yarn test
```
