# CDS Connect Authoring Tool

## About
Developed by The MITRE Corporation.

## License
TODO

## Development Details

The project leverages the MERN application architecture, using MongoDB, Express, React, and Node. One way you might install the requisite tools:

```bash
brew install mongodb # install mongodb on your system
brew services start mongodb # for the first time, start mongo
brew install node # install node
npm install -g yarn # node comes with npm. use it to install yarn
yarn # e.g. yarn install. installs this app's dependencies based on this project's yarn.lock / package.json
```

The React part was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). Relevant files are in the `src/` filter. Refer to the Create React App [User Guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md) for guidance on features and how to perform common tasks.

The backend is a basic Express-based Node app, whose relevant files are located in `app/`.

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

JavaScript linting is done on our React components by ESLint, extending the rulesets from [react-app](https://github.com/facebookincubator/create-react-app/tree/master/packages/eslint-config-react-app), [Airbnb](https://github.com/airbnb/javascript) _and_ [jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) for accessibility checking. Please refer to those rulesets and use the [Airbnb JSX/React style guide](https://github.com/airbnb/javascript/tree/master/react).

Sass linting is done by Stylelint, using the [Stylelint standard config](https://github.com/stylelint/stylelint-config-standard).

```bash
yarn run lint # runs eslint --fix src/* using the configuration in .eslintrc. The --fix flag will autocorrect minor errors
yarn run lint-css # runs stylelint 'src/styles/**/*.scss' using the configuration in .stylelintrc
```

### Testing
Testing uses [jsdom](https://github.com/tmpvar/jsdom) with [Jest](https://facebook.github.io/jest/) as the test runner. [Enzyme](http://airbnb.io/enzyme/docs/api/index.html) provides helpers. Run tests with

```bash
yarn run test # runs all tests
yarn test # also runs all tests
yarn test -- --coverage # view test coverage
```

Jest provides the overall testing framework. In our default setup running Jest via `yarn run test` will only run any tests that have been updated since the last commit, but you can use the prompt to specify running all tests or specific tests. Useful things it provides are:
* [Setup and teardown](https://facebook.github.io/jest/docs/setup-teardown.html#content) methods
* [Matchers](https://facebook.github.io/jest/docs/expect.html) (assertions) that let you write statements expressing what you expect a given value to be
* [Mock functions](https://facebook.github.io/jest/docs/mock-function-api.html#content) that let you test a component without having to include all needed functionality
* [Snapshot testing](https://facebook.github.io/jest/docs/snapshot-testing.html) (which we haven't used yet but can certainly consider)

Enzyme is used for rendering and manipulating DOM elements. Shallow rendering will render a component without rendering any other components that are children, whereas full rendering will render a component with all its children components. We can do fun things with our rendered components like get and set state or props, find certain strings, classes, or tags, and simulate events.
* [Shallow rendering](http://airbnb.io/enzyme/docs/api/shallow.html) API reference
* [Full rendering](http://airbnb.io/enzyme/docs/api/mount.html) API reference

A few possibly useful articles on working with Jest and Enzyme:
* https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f (apparently Enzyme has a debug method that I learned just now from this..)
* https://www.sitepoint.com/test-react-components-jest/

## Docker

This project can also be built into a Docker image and deployed as a Docker container.  To do any of the commands below, you must have [Docker](https://www.docker.com/) installed.

### Building the docker image

To build the Docker image, simply execute the following command from the project's root directory:
```
docker build -t cdsauthoringtool .
```

### Running the docker container

To run the authoring tool in a docker container, you must also run a docker container for MongoDB and link the authoring tool container to it.  The following commands show how to do this, as well as how to expose the necessary ports to access the application from your host system:
```
docker run --name cat-mongo -d mongo
docker run --name cat --link cat-mongo:mongo -e "MONGO_URL=mongodb://cat-mongo/cds_authoring" -p "9000:9000" -p "3001:3001" cdsauthoringtool
```

If you wish for the CDS Authoring Tool to run in a detached process, add a `-d` to the last command (before `cdsauthoringtool`).

When the containers are running, you can access the app at [http://localhost:9000](http://localhost:9000).

To stop the containers:
```
docker stop cat cat-mongo
```

To start the containers again:
```
docker start cat-mongo cat
```

To remove the containers (usually when you build new images):
```
docker rm cat-mongo cat
```

**NOTE: This configuration stores data in Mongo's container.  This means it is tied to the lifecycle of the mongo container and is _not_ persisted when the container is removed.**

### Using Docker Compose

Alternately, you can use Docker Compose to build and run the containers.  Simply execute:
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

If you want to run the tests in the docker image (for example, to ensure it works before deploying), you can do this via the following command:
```
docker run --rm -e "CI=true" cdsauthoringtool yarn test
```