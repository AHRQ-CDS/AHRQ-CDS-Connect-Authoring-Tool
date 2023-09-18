# Dependency Notes

Where possible, dependencies are frequently updated to their latest versions.
In some cases, however, this is not feasible or does not provide sufficient
return on the necessary investment to do a major version upgrade. The following
dependencies are currently fixed to older versions:

- **mongoose**: Mongoose is currently tracking the latest v6 versions because the v7 versions removed support for callbacks. This update can be made once the code has been refactored to eliminate use of Mongoose callbacks.
