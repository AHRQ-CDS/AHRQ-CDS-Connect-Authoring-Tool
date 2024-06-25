// Generated from cql.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by cqlParser.

function cqlVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

cqlVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
cqlVisitor.prototype.constructor = cqlVisitor;

// Visit a parse tree produced by cqlParser#library.
cqlVisitor.prototype.visitLibrary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#libraryDefinition.
cqlVisitor.prototype.visitLibraryDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#usingDefinition.
cqlVisitor.prototype.visitUsingDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#includeDefinition.
cqlVisitor.prototype.visitIncludeDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#localIdentifier.
cqlVisitor.prototype.visitLocalIdentifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#accessModifier.
cqlVisitor.prototype.visitAccessModifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#parameterDefinition.
cqlVisitor.prototype.visitParameterDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#codesystemDefinition.
cqlVisitor.prototype.visitCodesystemDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#valuesetDefinition.
cqlVisitor.prototype.visitValuesetDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#codesystems.
cqlVisitor.prototype.visitCodesystems = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#codesystemIdentifier.
cqlVisitor.prototype.visitCodesystemIdentifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#libraryIdentifier.
cqlVisitor.prototype.visitLibraryIdentifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#codeDefinition.
cqlVisitor.prototype.visitCodeDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#conceptDefinition.
cqlVisitor.prototype.visitConceptDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#codeIdentifier.
cqlVisitor.prototype.visitCodeIdentifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#codesystemId.
cqlVisitor.prototype.visitCodesystemId = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#valuesetId.
cqlVisitor.prototype.visitValuesetId = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#versionSpecifier.
cqlVisitor.prototype.visitVersionSpecifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#codeId.
cqlVisitor.prototype.visitCodeId = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#typeSpecifier.
cqlVisitor.prototype.visitTypeSpecifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#namedTypeSpecifier.
cqlVisitor.prototype.visitNamedTypeSpecifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#modelIdentifier.
cqlVisitor.prototype.visitModelIdentifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#listTypeSpecifier.
cqlVisitor.prototype.visitListTypeSpecifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#intervalTypeSpecifier.
cqlVisitor.prototype.visitIntervalTypeSpecifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#tupleTypeSpecifier.
cqlVisitor.prototype.visitTupleTypeSpecifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#tupleElementDefinition.
cqlVisitor.prototype.visitTupleElementDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#choiceTypeSpecifier.
cqlVisitor.prototype.visitChoiceTypeSpecifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#statement.
cqlVisitor.prototype.visitStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#expressionDefinition.
cqlVisitor.prototype.visitExpressionDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#contextDefinition.
cqlVisitor.prototype.visitContextDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#functionDefinition.
cqlVisitor.prototype.visitFunctionDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#operandDefinition.
cqlVisitor.prototype.visitOperandDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#functionBody.
cqlVisitor.prototype.visitFunctionBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#querySource.
cqlVisitor.prototype.visitQuerySource = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#aliasedQuerySource.
cqlVisitor.prototype.visitAliasedQuerySource = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#alias.
cqlVisitor.prototype.visitAlias = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#queryInclusionClause.
cqlVisitor.prototype.visitQueryInclusionClause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#withClause.
cqlVisitor.prototype.visitWithClause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#withoutClause.
cqlVisitor.prototype.visitWithoutClause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#retrieve.
cqlVisitor.prototype.visitRetrieve = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#codePath.
cqlVisitor.prototype.visitCodePath = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#terminology.
cqlVisitor.prototype.visitTerminology = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#qualifier.
cqlVisitor.prototype.visitQualifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#query.
cqlVisitor.prototype.visitQuery = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#sourceClause.
cqlVisitor.prototype.visitSourceClause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#letClause.
cqlVisitor.prototype.visitLetClause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#letClauseItem.
cqlVisitor.prototype.visitLetClauseItem = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#whereClause.
cqlVisitor.prototype.visitWhereClause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#returnClause.
cqlVisitor.prototype.visitReturnClause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#sortClause.
cqlVisitor.prototype.visitSortClause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#sortDirection.
cqlVisitor.prototype.visitSortDirection = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#sortByItem.
cqlVisitor.prototype.visitSortByItem = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#qualifiedIdentifier.
cqlVisitor.prototype.visitQualifiedIdentifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#durationBetweenExpression.
cqlVisitor.prototype.visitDurationBetweenExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#inFixSetExpression.
cqlVisitor.prototype.visitInFixSetExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#retrieveExpression.
cqlVisitor.prototype.visitRetrieveExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#timingExpression.
cqlVisitor.prototype.visitTimingExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#queryExpression.
cqlVisitor.prototype.visitQueryExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#notExpression.
cqlVisitor.prototype.visitNotExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#booleanExpression.
cqlVisitor.prototype.visitBooleanExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#orExpression.
cqlVisitor.prototype.visitOrExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#castExpression.
cqlVisitor.prototype.visitCastExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#andExpression.
cqlVisitor.prototype.visitAndExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#betweenExpression.
cqlVisitor.prototype.visitBetweenExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#membershipExpression.
cqlVisitor.prototype.visitMembershipExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#differenceBetweenExpression.
cqlVisitor.prototype.visitDifferenceBetweenExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#inequalityExpression.
cqlVisitor.prototype.visitInequalityExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#equalityExpression.
cqlVisitor.prototype.visitEqualityExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#existenceExpression.
cqlVisitor.prototype.visitExistenceExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#impliesExpression.
cqlVisitor.prototype.visitImpliesExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#termExpression.
cqlVisitor.prototype.visitTermExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#typeExpression.
cqlVisitor.prototype.visitTypeExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#dateTimePrecision.
cqlVisitor.prototype.visitDateTimePrecision = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#dateTimeComponent.
cqlVisitor.prototype.visitDateTimeComponent = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#pluralDateTimePrecision.
cqlVisitor.prototype.visitPluralDateTimePrecision = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#additionExpressionTerm.
cqlVisitor.prototype.visitAdditionExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#indexedExpressionTerm.
cqlVisitor.prototype.visitIndexedExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#widthExpressionTerm.
cqlVisitor.prototype.visitWidthExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#setAggregateExpressionTerm.
cqlVisitor.prototype.visitSetAggregateExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#timeUnitExpressionTerm.
cqlVisitor.prototype.visitTimeUnitExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#ifThenElseExpressionTerm.
cqlVisitor.prototype.visitIfThenElseExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#timeBoundaryExpressionTerm.
cqlVisitor.prototype.visitTimeBoundaryExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#elementExtractorExpressionTerm.
cqlVisitor.prototype.visitElementExtractorExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#conversionExpressionTerm.
cqlVisitor.prototype.visitConversionExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#typeExtentExpressionTerm.
cqlVisitor.prototype.visitTypeExtentExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#predecessorExpressionTerm.
cqlVisitor.prototype.visitPredecessorExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#pointExtractorExpressionTerm.
cqlVisitor.prototype.visitPointExtractorExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#multiplicationExpressionTerm.
cqlVisitor.prototype.visitMultiplicationExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#aggregateExpressionTerm.
cqlVisitor.prototype.visitAggregateExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#durationExpressionTerm.
cqlVisitor.prototype.visitDurationExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#differenceExpressionTerm.
cqlVisitor.prototype.visitDifferenceExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#caseExpressionTerm.
cqlVisitor.prototype.visitCaseExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#powerExpressionTerm.
cqlVisitor.prototype.visitPowerExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#successorExpressionTerm.
cqlVisitor.prototype.visitSuccessorExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#polarityExpressionTerm.
cqlVisitor.prototype.visitPolarityExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#termExpressionTerm.
cqlVisitor.prototype.visitTermExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#invocationExpressionTerm.
cqlVisitor.prototype.visitInvocationExpressionTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#caseExpressionItem.
cqlVisitor.prototype.visitCaseExpressionItem = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#dateTimePrecisionSpecifier.
cqlVisitor.prototype.visitDateTimePrecisionSpecifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#relativeQualifier.
cqlVisitor.prototype.visitRelativeQualifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#offsetRelativeQualifier.
cqlVisitor.prototype.visitOffsetRelativeQualifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#exclusiveRelativeQualifier.
cqlVisitor.prototype.visitExclusiveRelativeQualifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#quantityOffset.
cqlVisitor.prototype.visitQuantityOffset = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#temporalRelationship.
cqlVisitor.prototype.visitTemporalRelationship = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#concurrentWithIntervalOperatorPhrase.
cqlVisitor.prototype.visitConcurrentWithIntervalOperatorPhrase = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#includesIntervalOperatorPhrase.
cqlVisitor.prototype.visitIncludesIntervalOperatorPhrase = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#includedInIntervalOperatorPhrase.
cqlVisitor.prototype.visitIncludedInIntervalOperatorPhrase = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#beforeOrAfterIntervalOperatorPhrase.
cqlVisitor.prototype.visitBeforeOrAfterIntervalOperatorPhrase = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#withinIntervalOperatorPhrase.
cqlVisitor.prototype.visitWithinIntervalOperatorPhrase = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#meetsIntervalOperatorPhrase.
cqlVisitor.prototype.visitMeetsIntervalOperatorPhrase = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#overlapsIntervalOperatorPhrase.
cqlVisitor.prototype.visitOverlapsIntervalOperatorPhrase = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#startsIntervalOperatorPhrase.
cqlVisitor.prototype.visitStartsIntervalOperatorPhrase = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#endsIntervalOperatorPhrase.
cqlVisitor.prototype.visitEndsIntervalOperatorPhrase = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#invocationTerm.
cqlVisitor.prototype.visitInvocationTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#literalTerm.
cqlVisitor.prototype.visitLiteralTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#externalConstantTerm.
cqlVisitor.prototype.visitExternalConstantTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#intervalSelectorTerm.
cqlVisitor.prototype.visitIntervalSelectorTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#tupleSelectorTerm.
cqlVisitor.prototype.visitTupleSelectorTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#instanceSelectorTerm.
cqlVisitor.prototype.visitInstanceSelectorTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#listSelectorTerm.
cqlVisitor.prototype.visitListSelectorTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#codeSelectorTerm.
cqlVisitor.prototype.visitCodeSelectorTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#conceptSelectorTerm.
cqlVisitor.prototype.visitConceptSelectorTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#parenthesizedTerm.
cqlVisitor.prototype.visitParenthesizedTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#ratio.
cqlVisitor.prototype.visitRatio = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#booleanLiteral.
cqlVisitor.prototype.visitBooleanLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#nullLiteral.
cqlVisitor.prototype.visitNullLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#stringLiteral.
cqlVisitor.prototype.visitStringLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#numberLiteral.
cqlVisitor.prototype.visitNumberLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#dateTimeLiteral.
cqlVisitor.prototype.visitDateTimeLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#timeLiteral.
cqlVisitor.prototype.visitTimeLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#quantityLiteral.
cqlVisitor.prototype.visitQuantityLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#ratioLiteral.
cqlVisitor.prototype.visitRatioLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#intervalSelector.
cqlVisitor.prototype.visitIntervalSelector = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#tupleSelector.
cqlVisitor.prototype.visitTupleSelector = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#tupleElementSelector.
cqlVisitor.prototype.visitTupleElementSelector = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#instanceSelector.
cqlVisitor.prototype.visitInstanceSelector = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#instanceElementSelector.
cqlVisitor.prototype.visitInstanceElementSelector = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#listSelector.
cqlVisitor.prototype.visitListSelector = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#displayClause.
cqlVisitor.prototype.visitDisplayClause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#codeSelector.
cqlVisitor.prototype.visitCodeSelector = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#conceptSelector.
cqlVisitor.prototype.visitConceptSelector = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#identifier.
cqlVisitor.prototype.visitIdentifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#externalConstant.
cqlVisitor.prototype.visitExternalConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#memberInvocation.
cqlVisitor.prototype.visitMemberInvocation = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#functionInvocation.
cqlVisitor.prototype.visitFunctionInvocation = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#thisInvocation.
cqlVisitor.prototype.visitThisInvocation = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#indexInvocation.
cqlVisitor.prototype.visitIndexInvocation = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#totalInvocation.
cqlVisitor.prototype.visitTotalInvocation = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#func.
cqlVisitor.prototype.visitFunc = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#paramList.
cqlVisitor.prototype.visitParamList = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#quantity.
cqlVisitor.prototype.visitQuantity = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by cqlParser#unit.
cqlVisitor.prototype.visitUnit = function(ctx) {
  return this.visitChildren(ctx);
};



exports.cqlVisitor = cqlVisitor;