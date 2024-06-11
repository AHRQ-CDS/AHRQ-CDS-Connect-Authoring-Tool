class CQLLibraryGroup {
  constructor(library, dependencies) {
    this.library = library;
    this.dependencies = dependencies;
  }

  getDependencyNames() {
    return this.dependencies.map(d => d.libraryName);
  }
}

module.exports = { CQLLibraryGroup };
