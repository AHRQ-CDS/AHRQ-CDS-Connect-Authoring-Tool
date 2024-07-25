# Dependency Notes

Where possible, dependencies are frequently updated to their latest versions.
In some cases, however, this is not feasible or does not provide sufficient
return on the necessary investment to do a major version upgrade. The following
dependencies are currently fixed to older versions:

- **antlr4**: ANTLR4 versions after 4.8.0 generate code that uses ESM style imports instead of Common JS requires statements. Since the JavaScript runtime must match the version of ANTLR4 used to generate the classes, we cannot upgrade the antlr4 JavaScript runtime module past version 4.8.0.
