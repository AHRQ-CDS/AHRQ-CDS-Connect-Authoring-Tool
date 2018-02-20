# CDS Connect Authoring Tool

## About

The Clinical Decision Support (CDS) Authoring Tool is a web-based application aimed at simplifying the creation of production-ready CQL code. The project is based on "concept templates" (e.g. gender, HDL Cholesterol, etc.), which allow for additional clinical concepts to be included in the future. Concept modifiers are included to allow for more flexible definitions (e.g. most recent, value comparisons, etc.).

The CDS Authoring Tool is part of the [CDS Connect](https://cds.ahrq.gov/cdsconnect) project, sponsored by the [Agency for Healthcare Research and Quality](https://www.ahrq.gov/) (AHRQ), and developed under contract with AHRQ by [MITRE's CAMH](https://www.mitre.org/centers/cms-alliances-to-modernize-healthcare/who-we-are) FFRDC.

## Contributions

For information about contributing to this project, please see [CONTRIBUTING](../CONTRIBUTING.md).

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

To run the project, you'll also need to install and run the [CDS Authoring Tool API](../api).

### Add / Remove / Adjust dependencies

```bash
yarn add <thing> # add a package. add --dev if this is a development dependency.
yarn add <thing>@<version> # will adjust version
yarn remove <thing> # remove a package.
```

### Configuration

This project has very few configuration needs.  Currently, only two data points are configurable: the backend API URL and the CDS Connect repo URL.  The default values can be found in the `.env` file and overridden via environment variables.  Note that during a production build, the values in `.env` will be hard-coded into the resulting HTML and JS.

### Run

`yarn start` will run the frontend in development mode, with hot redeployment when changes are detected on the filesystem.

```bash
yarn start # run the app in development mode, watching files for changes
```

To easily run both the backend API server and the frontend in development mode, see the instructions on the main [README](../README.md).

### Production Build and Run

A production build compiles all of the files to standard HTML, CSS, and JavaScript that can be run from any web server.  It does require, however, that the path _/authoring/api_ be proxied to the API server.

```bash
yarn build # does a production build, putting resulting files in ./build.
```

You can run the production code simply by launching the `server.js` script.  It uses Express to host the production code and proxy to the API server.  This requires the API server to be running.

```bash
node server.js
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

### Docker

For information on running the CDS Authoring Tool in Docker, see the main [README](../README.md).

## LICENSE

Copyright 2016-2018 Agency for Healthcare Research and Quality

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

