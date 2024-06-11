const { getRawFromContext } = require('../utils/getRawFromContext');

class CQLLibrary {
  constructor(context, raw) {
    this.context = context;
    this.raw = raw;
    this.includeNames = new Map();
    this.rawExpressions = new Map();
    this.rawFunctions = new Map();
    this.rawCodesystems = new Map();
    this.rawCodes = new Map();
    this.rawConcepts = new Map();

    this.libraryName = context.libraryDefinition()?.identifier()?.start.text.replace(/"/g, '');

    context.includeDefinition().forEach(i => {
      const localIdentifier = (i.localIdentifier() || i.identifier()).start.text.replace(/"/g, '');
      const identifier = i.identifier().start.text.replace(/"/g, '');
      this.includeNames.set(identifier, localIdentifier);
    });

    this.statements = context.statement();
    this.statements
      .map(s => s.expressionDefinition())
      .filter(s => s)
      .forEach(s => this.rawExpressions.set(s.identifier().start.text, getRawFromContext(s)));

    this.statements
      .map(s => s.functionDefinition())
      .filter(s => s)
      .forEach(s => this.rawFunctions.set(s.identifier().start.text, getRawFromContext(s)));

    context
      .codesystemDefinition()
      .filter(c => c)
      .forEach(c => this.rawCodesystems.set(c.identifier().start.text, getRawFromContext(c)));

    context
      .codeDefinition()
      .filter(c => c)
      .forEach(c => this.rawCodes.set(c.identifier().start.text, getRawFromContext(c)));

    context
      .conceptDefinition()
      .filter(c => c)
      .forEach(c => this.rawConcepts.set(c.identifier().start.text, getRawFromContext(c)));
  }
}

module.exports = { CQLLibrary };
