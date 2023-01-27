# Dependency Notes

Where possible, dependencies are frequently updated to their latest versions.
In some cases, however, this is not feasible or does not provide sufficient
return on the necessary investment to do a major version upgrade. The following
dependencies are currently fixed to older versions:

- **mongoose**: Mongoose is tracking the latest v5 versions. Upgrading mongoose to v6 will require ensuring that all deprecated functions are replaced and that all breaking changes are accounted for.
- **connect-mongo**: connect-mongo is tracking the latest v3 versions. Upgrading to v4 requires changes to how the mongoose connection is used to connect to the session. This update should likely be completed along with the mongoose update.

## Notes about overrides

- **axios**: Axios is fixed to the latest version. The override is needed because `cds-upload` requires an old version.
  Once that package is updated to use the latest `axios` version, this override can be safely removed.
- **bson**: BSON is tracking the latest v1 versions. This is needed because `mongodb-migrations` requires an older version.
  If this library updates its `bson` dependency, this override can be removed.
- **underscore**: Underscore is tracking the latest version because `mongodb-migrations` requires an older version.
  If this library updates its `underscore` dependency, this override can be removed.
