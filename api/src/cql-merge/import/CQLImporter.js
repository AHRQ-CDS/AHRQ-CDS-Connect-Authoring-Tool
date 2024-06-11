const { InputStream, CommonTokenStream } = require('antlr4');
const { cqlVisitor } = require('./grammar/cqlVisitor');
const { cqlLexer } = require('./grammar/cqlLexer');
const { cqlParser } = require('./grammar/cqlParser');
const { CQLLibrary } = require('./CQLLibrary');
const { CQLLibraryGroup } = require('./CQLLibraryGroup');
class CQLImporter extends cqlVisitor {
  constructor() {
    super();
  }

  import(libraryRawCQL, dependencyRawCQLs) {
    const library = new CQLLibrary(this.parseLibrary(libraryRawCQL.content), libraryRawCQL);
    const dependencies = dependencyRawCQLs.map(rawCQL => {
      return new CQLLibrary(this.parseLibrary(rawCQL.content), rawCQL);
    });
    return new CQLLibraryGroup(library, dependencies);
  }

  // NOTE: Since the ANTLR parser/lexer is JS (not typescript), we need to use some ts-ignore here.
  parseLibrary(input) {
    const chars = new InputStream(input);
    const lexer = new cqlLexer(chars);
    // @ts-ignore
    lexer.removeErrorListeners();
    // @ts-ignore
    const tokens = new CommonTokenStream(lexer);
    const parser = new cqlParser(tokens);
    // @ts-ignore
    parser.removeErrorListeners();
    // @ts-ignore
    parser.buildParseTrees = true;
    // @ts-ignore
    return parser.library();
  }
}

module.exports = { CQLImporter };
