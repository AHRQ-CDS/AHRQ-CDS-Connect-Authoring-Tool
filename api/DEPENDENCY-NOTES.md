# Dependency Notes

Where possible, dependencies are frequently updated to their latest versions.
In some cases, however, this is not feasible or does not provide sufficient
return on the necessary investment to do a major version upgrade. The following
dependencies are currently fixed to older versions:

## Notes about overrides

- **cds-upload/axios**: Axios is fixed to the latest version. The override is needed because `cds-upload` requires an old version.
  Once that package is updated to use the latest `axios` version, this override can be safely removed.
