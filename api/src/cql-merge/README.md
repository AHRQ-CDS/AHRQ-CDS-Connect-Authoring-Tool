### Origins

This cql-merge code was migrated from a separate node module that was not formerly published.
The original code, however, was developed under the CDS Connect contract, so it carries the
same licensing and data use terms as the CDS Authoring Tool code.

### Purpose

The purpose of this module is to merge multiple CQL files into a single file, including only
the functions that are actually used by the primary logic library.

### Known Limitations

There are known limitations of this module, and it is currently focused on
functionality that supports the CDS Authoring Tool. The known limitations are:

- A requirement for the presence of a `context Patient` statement
- A requirement for statements before the `context Patient` statement to be one line each
- A requirement for the presence of at least one remaining `include` statement (like FHIRHelpers)
- No ability to pull in expressions or valuesets from libraries, rather than functions, codesystems, codes, and concepts
- No ability to recursively inline functions used by other functions past one level deep
- No ability to inline libraries and functions that are quoted
