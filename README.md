# CDS Connect Authoring Tool

## About
Developed by The MITRE Corporation, the CDS Connect Authoring Tool is a project aimed at simplifying the creation of production-ready CQL code. The project is based on "concept templates" (e.g. gender, HDL Cholesterol, etc.), which allow for additional clinical concepts to be included in the future. Concept modifiers are included to allow for more flexible definitions (e.g. most recent, value comparisons, etc.).

## License
TODO

## Development Details

This project provides the R (React) in the MERN application architecture.  It was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). Relevant files are in the `src/` filter. Refer to the Create React App [User Guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md) for guidance on features and how to perform common tasks.

To develop this project, you must node and yarn.  On Mac OS X, this can be done through brew:

```bash
brew install node # install node
brew install yarn # install node
```

For other operating systems, use the instructions provided in each tool's online documentation.

Once the prerequisite tools are installed, use yarn to install the dependency libraries:

```
yarn # e.g. yarn install. installs this app's dependencies based on this project's yarn.lock / package.json
```

To run the project, you'll also need to install and run the [CDS Authoring Tool API](api).

### Add / Remove / Adjust dependencies

```bash
yarn add <thing> # add a package. add --dev if this is a development dependency.
yarn add <thing>@<version> # will adjust version
yarn remove <thing> # remove a package.
```

### Configuration

This project has very few configuration needs.  Currently, only two data points are configurable: the backend API URL and the CDS Connect repo URL.  The default values can be found in the `.env` file and overridden via environment variables.  Note that during a production build, the values in `.env` will be hard-coded into the resulting HTML and JS.

### Run

`yarn run start-dev` will run all of the items listed in the `Procfile` (including the API backend). Note: Previous versions of the Procfile launched MongoDB, but that has been removed due to causing many issues on developer systems.  Please ensure MongoDB is running before starting the CDS Authoring Tool.

```bash
yarn run start-dev # run the app in development mode, watching files for changes
```

### Production Build and Run

A production build compiles all of the files to standard HTML, CSS, and JavaScript that can be run from any web server.  It does require, however, that the path _/authoring/api_ be proxied to the API server.

```bash
yarn build # does a production build, putting resulting files in ./build.
```

You can run the production code simply by launching the `frontend.js` script.  It uses Express to host the production code and proxy to the API server.  This requires the API server to be running.

```bash
node frontend.js
```

### Linting

JavaScript linting is done on the React components by ESLint, extending the rulesets from [react-app](https://github.com/facebookincubator/create-react-app/tree/master/packages/eslint-config-react-app), [Airbnb](https://github.com/airbnb/javascript) _and_ [jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) for accessibility checking. Please refer to those rulesets and use the [Airbnb JSX/React style guide](https://github.com/airbnb/javascript/tree/master/react).

Sass linting is done by Stylelint, using the [Stylelint standard config](https://github.com/stylelint/stylelint-config-standard).

```bash
yarn run lint # runs eslint using the configuration in .eslintrc.
yarn run lint:fix # runs eslint --fix using the configuration in .eslintrc. The --fix flag will autocorrect minor errors
yarn run lint-css # runs stylelint 'src/styles/**/*.scss' using the configuration in .stylelintrc
```

### Testing
Frontend testing uses [jsdom](https://github.com/tmpvar/jsdom) with [Jest](https://facebook.github.io/jest/) as the test runner. [Enzyme](http://airbnb.io/enzyme/docs/api/index.html) provides helpers.

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

For the authoring tool frontend to run in a docker container, you must be running the CDS Authoring Tool API container and its dependencies already.  See the [API](api) project for instructions to do that.  Once those containers are running, you can run the CDS Authoring Tool container via the following command:
```
docker run --name cat
  --link cat-api:cat-api
  -e "NODE_ENV=production"
  -e "API_PROXY_HOST=cat-api"
  -p "9000:9000"
  cdsauthoringtool
```

By default, the server on port 9000 will proxy requests on _/authoring/api_ to the API server using express-http-proxy.  In production environments, a dedicated external proxy server may be desired.  In that case, the external proxy server will be responsible for proxying _/authoring/api_ to port 3001.  To accomodate this, disable the express-http-proxy by adding this addition flag to the last command above:
```
  -e "API_PROXY_ACTIVE=false" \
```

To run the CDS Authoring Tool in a detached process, add a `-d` to the run command (before `cdsauthoringtool`).

When the container is running, access the app at [http://localhost:9000](http://localhost:9000).

To stop the container:
```
docker stop cat
```

To start the containers again:
```
docker start cat
```

To remove the containers (usually when building new images):
```
docker rm cat
```

### Using Docker Compose

Alternately, use Docker Compose to build and run all of the containers.  Execute:
```
docker-compose up
```

The first time, it will build the cdsauthoringtoolapi\_cat and cdsauthoringtool\_cat images.  Subsequent times it may re-use the already built images.  To force it to rebuild, pass in the `--build` flag.

To stop _and remove_ the containers, run:
```
docker-compose down
```

**NOTE: This configuration stores data in Mongo's container.  This means it is tied to the lifecycle of the mongo container and is _not_ persisted when the container is removed.**

### Bonus: Running Tests in Docker

To run the tests in the docker image (for example, to ensure it works before deploying), run the following command:
```
docker run --rm -e "CI=true" -e "NODE_ENV=test" cdsauthoringtool yarn test
```
