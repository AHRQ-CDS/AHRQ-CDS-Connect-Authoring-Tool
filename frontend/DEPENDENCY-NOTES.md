# Dependency Notes

Where possible, dependencies are frequently updated to their latest versions.
In some cases, however, this is not feasible or does not provide sufficient
return on the necessary investment to do a major version upgrade. The following
dependencies are currently fixed to older versions:

- **react** and **react-dom**: React is currently tracking the latest v17 versions, as updating to 18 requires significant investment.
- **react-router-dom**: React Router DOM is currently tracking the latest v5 versions, as upgrading to v6 requires updating all components from class components to functional components.
  - This should be revisited once all refactoring tasks are completed.
- **@testing-library/react**: The React Testing Library is currently tracking the latest v12 versions because v13 requires React 18.
- **@testing-library/user-event**: The User Events library is currently tracking the latest v13 versions because upgrading to v14 requires significant changes to the test suite.
  - These changes should be possible, so this upgrade should be revisited soon.
- **react-tabs**: React Tabs is tracking the latest v4 versions because v5 requires React 18.
- **axios**: Axios is currently tracking the latest version, but it requires the `transformIgnorePatterns` in the Jest configuration in `package.json`. This should be monitored to see if Axios, Jest, or react-scripts update to support this natively. If so, the full `"jest"` property in `package.json` can be removed safely.
- **tocbot**: Tocbot is currently fixed to `v4.17.3` (or other patch versions) in order to avoid multiple errors logged to the console. In this version, and all previous versions, there is only one error logged when navigating away from the Documentation page.
  These errors increased after version `v4.17.3`.
  [This commit](https://github.com/tscanlin/tocbot/commit/be66ad95284ebd21299a203d5479e12d85e34d62) may be related to new errors.
  Eventually, it will be good upgrade this package, but it may require reaching out for input on Github.
- **change-case**: Change Case is tracking the latest v4 versions because v5 removed support for CommonJS and only supports ESM imports, which was causing problems with the app. This may be due to some of the built in configuration from create-react-app, or it may just required additional configuration.
- **immer**: Immer is tracking the latest v9 versions because ES5 mode for legacy browsers was dropped in v10. Because we use `enableES5()`, which was removed, this library should be updated only once support for legacy browsers is evaluated and determined not to be needed.
- **@mui/material** and **@mui/styles**: Tracking the latest v5.13 version. Updating to the latest v5 version requires changes to multiple tests.

## Notes about overrides

- **nth-check**: nth-check is updated to the latest major version in the overrides list because `react-scripts` has dependencies that require a version with a vulnerability.
  If/When react-scripts updates to address the vulnerability, this override can be safely removed.
- **postcss**: postcss is fixed to the latest version while other packages still require older version.
- **react-side-effect**: react-side-effect is updated to the latest patch version in the overrides list because `react-helmet` requires an older version of `react-side-effects` that causes a conflicting peer dependency error.
  If `react-helmet` updates the version of `react-side-effects` it uses, this can be safely removed.
