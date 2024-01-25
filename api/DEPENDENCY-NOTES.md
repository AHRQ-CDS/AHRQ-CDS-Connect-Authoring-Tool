# Dependency Notes

Where possible, dependencies are frequently updated to their latest versions.
In some cases, however, this is not feasible or does not provide sufficient
return on the necessary investment to do a major version upgrade. The following
dependencies are currently fixed to older versions:

- **chai**: Chai very recently updated to v5, which now only supports ESM. However, **chai-excludes** has not yet been updated to support `chai` v5. [This GitHub issue](https://github.com/mesaugat/chai-exclude/issues/48) seems to indicate the library will eventually be updated to support the new version. This update should be revisited in the short-term to see if any movement in `chai-excludes` has happened. If it hasn't we can likely refactor to eliminate this dependency.

  Even once the peer dependency issue between `chai` and `chai-excludes` is resolved, updating to v5 of `chai` will still require some refactoring because it only supports ESM now. One way to support this with minimal refactoring of the entire `api` module is to dynamically import `chai` before each test suite that uses it. This can be done with a top-level `before` block, which will run before all the tests in that block:

  ```javascript
  let expect;
  before(async () => {
    const chai = await import('chai');
    expect = chai.expect;
  });
  ```
