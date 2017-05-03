# CDS Connect Authoring Tool

## About
Developed by The MITRE Corporation.

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
Linting is done by ESLint, extending the rulesets from [react-app](https://github.com/facebookincubator/create-react-app/tree/master/packages/eslint-config-react-app), [Airbnb](https://github.com/airbnb/javascript) _and_ [jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) for accessibility checking. Please refer to those rulesets and use the [Airbnb JSX/React style guide](https://github.com/airbnb/javascript/tree/master/react).

```bash
yarn run lint # runs eslint --fix src/*. The --fix flag will autocorrect minor errors
```

### Testing
Testing uses [jsdom](https://github.com/tmpvar/jsdom) with [Jest](https://facebook.github.io/jest/) as the test runner. [Enzyme](http://airbnb.io/enzyme/docs/api/index.html) provides helpers. Run tests with
```bash
yarn run test # runs all tests
yarn test # also runs all tests
yarn test -- --coverage # view test coverage
```
