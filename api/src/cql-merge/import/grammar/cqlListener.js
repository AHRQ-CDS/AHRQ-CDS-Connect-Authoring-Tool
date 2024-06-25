// Generated from cql.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by cqlParser.
function cqlListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

cqlListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
cqlListener.prototype.constructor = cqlListener;

// Enter a parse tree produced by cqlParser#library.
cqlListener.prototype.enterLibrary = function(ctx) {
};

// Exit a parse tree produced by cqlParser#library.
cqlListener.prototype.exitLibrary = function(ctx) {
};


// Enter a parse tree produced by cqlParser#libraryDefinition.
cqlListener.prototype.enterLibraryDefinition = function(ctx) {
};

// Exit a parse tree produced by cqlParser#libraryDefinition.
cqlListener.prototype.exitLibraryDefinition = function(ctx) {
};


// Enter a parse tree produced by cqlParser#usingDefinition.
cqlListener.prototype.enterUsingDefinition = function(ctx) {
};

// Exit a parse tree produced by cqlParser#usingDefinition.
cqlListener.prototype.exitUsingDefinition = function(ctx) {
};


// Enter a parse tree produced by cqlParser#includeDefinition.
cqlListener.prototype.enterIncludeDefinition = function(ctx) {
};

// Exit a parse tree produced by cqlParser#includeDefinition.
cqlListener.prototype.exitIncludeDefinition = function(ctx) {
};


// Enter a parse tree produced by cqlParser#localIdentifier.
cqlListener.prototype.enterLocalIdentifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#localIdentifier.
cqlListener.prototype.exitLocalIdentifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#accessModifier.
cqlListener.prototype.enterAccessModifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#accessModifier.
cqlListener.prototype.exitAccessModifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#parameterDefinition.
cqlListener.prototype.enterParameterDefinition = function(ctx) {
};

// Exit a parse tree produced by cqlParser#parameterDefinition.
cqlListener.prototype.exitParameterDefinition = function(ctx) {
};


// Enter a parse tree produced by cqlParser#codesystemDefinition.
cqlListener.prototype.enterCodesystemDefinition = function(ctx) {
};

// Exit a parse tree produced by cqlParser#codesystemDefinition.
cqlListener.prototype.exitCodesystemDefinition = function(ctx) {
};


// Enter a parse tree produced by cqlParser#valuesetDefinition.
cqlListener.prototype.enterValuesetDefinition = function(ctx) {
};

// Exit a parse tree produced by cqlParser#valuesetDefinition.
cqlListener.prototype.exitValuesetDefinition = function(ctx) {
};


// Enter a parse tree produced by cqlParser#codesystems.
cqlListener.prototype.enterCodesystems = function(ctx) {
};

// Exit a parse tree produced by cqlParser#codesystems.
cqlListener.prototype.exitCodesystems = function(ctx) {
};


// Enter a parse tree produced by cqlParser#codesystemIdentifier.
cqlListener.prototype.enterCodesystemIdentifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#codesystemIdentifier.
cqlListener.prototype.exitCodesystemIdentifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#libraryIdentifier.
cqlListener.prototype.enterLibraryIdentifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#libraryIdentifier.
cqlListener.prototype.exitLibraryIdentifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#codeDefinition.
cqlListener.prototype.enterCodeDefinition = function(ctx) {
};

// Exit a parse tree produced by cqlParser#codeDefinition.
cqlListener.prototype.exitCodeDefinition = function(ctx) {
};


// Enter a parse tree produced by cqlParser#conceptDefinition.
cqlListener.prototype.enterConceptDefinition = function(ctx) {
};

// Exit a parse tree produced by cqlParser#conceptDefinition.
cqlListener.prototype.exitConceptDefinition = function(ctx) {
};


// Enter a parse tree produced by cqlParser#codeIdentifier.
cqlListener.prototype.enterCodeIdentifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#codeIdentifier.
cqlListener.prototype.exitCodeIdentifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#codesystemId.
cqlListener.prototype.enterCodesystemId = function(ctx) {
};

// Exit a parse tree produced by cqlParser#codesystemId.
cqlListener.prototype.exitCodesystemId = function(ctx) {
};


// Enter a parse tree produced by cqlParser#valuesetId.
cqlListener.prototype.enterValuesetId = function(ctx) {
};

// Exit a parse tree produced by cqlParser#valuesetId.
cqlListener.prototype.exitValuesetId = function(ctx) {
};


// Enter a parse tree produced by cqlParser#versionSpecifier.
cqlListener.prototype.enterVersionSpecifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#versionSpecifier.
cqlListener.prototype.exitVersionSpecifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#codeId.
cqlListener.prototype.enterCodeId = function(ctx) {
};

// Exit a parse tree produced by cqlParser#codeId.
cqlListener.prototype.exitCodeId = function(ctx) {
};


// Enter a parse tree produced by cqlParser#typeSpecifier.
cqlListener.prototype.enterTypeSpecifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#typeSpecifier.
cqlListener.prototype.exitTypeSpecifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#namedTypeSpecifier.
cqlListener.prototype.enterNamedTypeSpecifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#namedTypeSpecifier.
cqlListener.prototype.exitNamedTypeSpecifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#modelIdentifier.
cqlListener.prototype.enterModelIdentifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#modelIdentifier.
cqlListener.prototype.exitModelIdentifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#listTypeSpecifier.
cqlListener.prototype.enterListTypeSpecifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#listTypeSpecifier.
cqlListener.prototype.exitListTypeSpecifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#intervalTypeSpecifier.
cqlListener.prototype.enterIntervalTypeSpecifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#intervalTypeSpecifier.
cqlListener.prototype.exitIntervalTypeSpecifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#tupleTypeSpecifier.
cqlListener.prototype.enterTupleTypeSpecifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#tupleTypeSpecifier.
cqlListener.prototype.exitTupleTypeSpecifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#tupleElementDefinition.
cqlListener.prototype.enterTupleElementDefinition = function(ctx) {
};

// Exit a parse tree produced by cqlParser#tupleElementDefinition.
cqlListener.prototype.exitTupleElementDefinition = function(ctx) {
};


// Enter a parse tree produced by cqlParser#choiceTypeSpecifier.
cqlListener.prototype.enterChoiceTypeSpecifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#choiceTypeSpecifier.
cqlListener.prototype.exitChoiceTypeSpecifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#statement.
cqlListener.prototype.enterStatement = function(ctx) {
};

// Exit a parse tree produced by cqlParser#statement.
cqlListener.prototype.exitStatement = function(ctx) {
};


// Enter a parse tree produced by cqlParser#expressionDefinition.
cqlListener.prototype.enterExpressionDefinition = function(ctx) {
};

// Exit a parse tree produced by cqlParser#expressionDefinition.
cqlListener.prototype.exitExpressionDefinition = function(ctx) {
};


// Enter a parse tree produced by cqlParser#contextDefinition.
cqlListener.prototype.enterContextDefinition = function(ctx) {
};

// Exit a parse tree produced by cqlParser#contextDefinition.
cqlListener.prototype.exitContextDefinition = function(ctx) {
};


// Enter a parse tree produced by cqlParser#functionDefinition.
cqlListener.prototype.enterFunctionDefinition = function(ctx) {
};

// Exit a parse tree produced by cqlParser#functionDefinition.
cqlListener.prototype.exitFunctionDefinition = function(ctx) {
};


// Enter a parse tree produced by cqlParser#operandDefinition.
cqlListener.prototype.enterOperandDefinition = function(ctx) {
};

// Exit a parse tree produced by cqlParser#operandDefinition.
cqlListener.prototype.exitOperandDefinition = function(ctx) {
};


// Enter a parse tree produced by cqlParser#functionBody.
cqlListener.prototype.enterFunctionBody = function(ctx) {
};

// Exit a parse tree produced by cqlParser#functionBody.
cqlListener.prototype.exitFunctionBody = function(ctx) {
};


// Enter a parse tree produced by cqlParser#querySource.
cqlListener.prototype.enterQuerySource = function(ctx) {
};

// Exit a parse tree produced by cqlParser#querySource.
cqlListener.prototype.exitQuerySource = function(ctx) {
};


// Enter a parse tree produced by cqlParser#aliasedQuerySource.
cqlListener.prototype.enterAliasedQuerySource = function(ctx) {
};

// Exit a parse tree produced by cqlParser#aliasedQuerySource.
cqlListener.prototype.exitAliasedQuerySource = function(ctx) {
};


// Enter a parse tree produced by cqlParser#alias.
cqlListener.prototype.enterAlias = function(ctx) {
};

// Exit a parse tree produced by cqlParser#alias.
cqlListener.prototype.exitAlias = function(ctx) {
};


// Enter a parse tree produced by cqlParser#queryInclusionClause.
cqlListener.prototype.enterQueryInclusionClause = function(ctx) {
};

// Exit a parse tree produced by cqlParser#queryInclusionClause.
cqlListener.prototype.exitQueryInclusionClause = function(ctx) {
};


// Enter a parse tree produced by cqlParser#withClause.
cqlListener.prototype.enterWithClause = function(ctx) {
};

// Exit a parse tree produced by cqlParser#withClause.
cqlListener.prototype.exitWithClause = function(ctx) {
};


// Enter a parse tree produced by cqlParser#withoutClause.
cqlListener.prototype.enterWithoutClause = function(ctx) {
};

// Exit a parse tree produced by cqlParser#withoutClause.
cqlListener.prototype.exitWithoutClause = function(ctx) {
};


// Enter a parse tree produced by cqlParser#retrieve.
cqlListener.prototype.enterRetrieve = function(ctx) {
};

// Exit a parse tree produced by cqlParser#retrieve.
cqlListener.prototype.exitRetrieve = function(ctx) {
};


// Enter a parse tree produced by cqlParser#codePath.
cqlListener.prototype.enterCodePath = function(ctx) {
};

// Exit a parse tree produced by cqlParser#codePath.
cqlListener.prototype.exitCodePath = function(ctx) {
};


// Enter a parse tree produced by cqlParser#terminology.
cqlListener.prototype.enterTerminology = function(ctx) {
};

// Exit a parse tree produced by cqlParser#terminology.
cqlListener.prototype.exitTerminology = function(ctx) {
};


// Enter a parse tree produced by cqlParser#qualifier.
cqlListener.prototype.enterQualifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#qualifier.
cqlListener.prototype.exitQualifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#query.
cqlListener.prototype.enterQuery = function(ctx) {
};

// Exit a parse tree produced by cqlParser#query.
cqlListener.prototype.exitQuery = function(ctx) {
};


// Enter a parse tree produced by cqlParser#sourceClause.
cqlListener.prototype.enterSourceClause = function(ctx) {
};

// Exit a parse tree produced by cqlParser#sourceClause.
cqlListener.prototype.exitSourceClause = function(ctx) {
};


// Enter a parse tree produced by cqlParser#letClause.
cqlListener.prototype.enterLetClause = function(ctx) {
};

// Exit a parse tree produced by cqlParser#letClause.
cqlListener.prototype.exitLetClause = function(ctx) {
};


// Enter a parse tree produced by cqlParser#letClauseItem.
cqlListener.prototype.enterLetClauseItem = function(ctx) {
};

// Exit a parse tree produced by cqlParser#letClauseItem.
cqlListener.prototype.exitLetClauseItem = function(ctx) {
};


// Enter a parse tree produced by cqlParser#whereClause.
cqlListener.prototype.enterWhereClause = function(ctx) {
};

// Exit a parse tree produced by cqlParser#whereClause.
cqlListener.prototype.exitWhereClause = function(ctx) {
};


// Enter a parse tree produced by cqlParser#returnClause.
cqlListener.prototype.enterReturnClause = function(ctx) {
};

// Exit a parse tree produced by cqlParser#returnClause.
cqlListener.prototype.exitReturnClause = function(ctx) {
};


// Enter a parse tree produced by cqlParser#sortClause.
cqlListener.prototype.enterSortClause = function(ctx) {
};

// Exit a parse tree produced by cqlParser#sortClause.
cqlListener.prototype.exitSortClause = function(ctx) {
};


// Enter a parse tree produced by cqlParser#sortDirection.
cqlListener.prototype.enterSortDirection = function(ctx) {
};

// Exit a parse tree produced by cqlParser#sortDirection.
cqlListener.prototype.exitSortDirection = function(ctx) {
};


// Enter a parse tree produced by cqlParser#sortByItem.
cqlListener.prototype.enterSortByItem = function(ctx) {
};

// Exit a parse tree produced by cqlParser#sortByItem.
cqlListener.prototype.exitSortByItem = function(ctx) {
};


// Enter a parse tree produced by cqlParser#qualifiedIdentifier.
cqlListener.prototype.enterQualifiedIdentifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#qualifiedIdentifier.
cqlListener.prototype.exitQualifiedIdentifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#durationBetweenExpression.
cqlListener.prototype.enterDurationBetweenExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#durationBetweenExpression.
cqlListener.prototype.exitDurationBetweenExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#inFixSetExpression.
cqlListener.prototype.enterInFixSetExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#inFixSetExpression.
cqlListener.prototype.exitInFixSetExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#retrieveExpression.
cqlListener.prototype.enterRetrieveExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#retrieveExpression.
cqlListener.prototype.exitRetrieveExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#timingExpression.
cqlListener.prototype.enterTimingExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#timingExpression.
cqlListener.prototype.exitTimingExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#queryExpression.
cqlListener.prototype.enterQueryExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#queryExpression.
cqlListener.prototype.exitQueryExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#notExpression.
cqlListener.prototype.enterNotExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#notExpression.
cqlListener.prototype.exitNotExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#booleanExpression.
cqlListener.prototype.enterBooleanExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#booleanExpression.
cqlListener.prototype.exitBooleanExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#orExpression.
cqlListener.prototype.enterOrExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#orExpression.
cqlListener.prototype.exitOrExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#castExpression.
cqlListener.prototype.enterCastExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#castExpression.
cqlListener.prototype.exitCastExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#andExpression.
cqlListener.prototype.enterAndExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#andExpression.
cqlListener.prototype.exitAndExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#betweenExpression.
cqlListener.prototype.enterBetweenExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#betweenExpression.
cqlListener.prototype.exitBetweenExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#membershipExpression.
cqlListener.prototype.enterMembershipExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#membershipExpression.
cqlListener.prototype.exitMembershipExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#differenceBetweenExpression.
cqlListener.prototype.enterDifferenceBetweenExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#differenceBetweenExpression.
cqlListener.prototype.exitDifferenceBetweenExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#inequalityExpression.
cqlListener.prototype.enterInequalityExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#inequalityExpression.
cqlListener.prototype.exitInequalityExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#equalityExpression.
cqlListener.prototype.enterEqualityExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#equalityExpression.
cqlListener.prototype.exitEqualityExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#existenceExpression.
cqlListener.prototype.enterExistenceExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#existenceExpression.
cqlListener.prototype.exitExistenceExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#impliesExpression.
cqlListener.prototype.enterImpliesExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#impliesExpression.
cqlListener.prototype.exitImpliesExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#termExpression.
cqlListener.prototype.enterTermExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#termExpression.
cqlListener.prototype.exitTermExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#typeExpression.
cqlListener.prototype.enterTypeExpression = function(ctx) {
};

// Exit a parse tree produced by cqlParser#typeExpression.
cqlListener.prototype.exitTypeExpression = function(ctx) {
};


// Enter a parse tree produced by cqlParser#dateTimePrecision.
cqlListener.prototype.enterDateTimePrecision = function(ctx) {
};

// Exit a parse tree produced by cqlParser#dateTimePrecision.
cqlListener.prototype.exitDateTimePrecision = function(ctx) {
};


// Enter a parse tree produced by cqlParser#dateTimeComponent.
cqlListener.prototype.enterDateTimeComponent = function(ctx) {
};

// Exit a parse tree produced by cqlParser#dateTimeComponent.
cqlListener.prototype.exitDateTimeComponent = function(ctx) {
};


// Enter a parse tree produced by cqlParser#pluralDateTimePrecision.
cqlListener.prototype.enterPluralDateTimePrecision = function(ctx) {
};

// Exit a parse tree produced by cqlParser#pluralDateTimePrecision.
cqlListener.prototype.exitPluralDateTimePrecision = function(ctx) {
};


// Enter a parse tree produced by cqlParser#additionExpressionTerm.
cqlListener.prototype.enterAdditionExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#additionExpressionTerm.
cqlListener.prototype.exitAdditionExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#indexedExpressionTerm.
cqlListener.prototype.enterIndexedExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#indexedExpressionTerm.
cqlListener.prototype.exitIndexedExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#widthExpressionTerm.
cqlListener.prototype.enterWidthExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#widthExpressionTerm.
cqlListener.prototype.exitWidthExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#setAggregateExpressionTerm.
cqlListener.prototype.enterSetAggregateExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#setAggregateExpressionTerm.
cqlListener.prototype.exitSetAggregateExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#timeUnitExpressionTerm.
cqlListener.prototype.enterTimeUnitExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#timeUnitExpressionTerm.
cqlListener.prototype.exitTimeUnitExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#ifThenElseExpressionTerm.
cqlListener.prototype.enterIfThenElseExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#ifThenElseExpressionTerm.
cqlListener.prototype.exitIfThenElseExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#timeBoundaryExpressionTerm.
cqlListener.prototype.enterTimeBoundaryExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#timeBoundaryExpressionTerm.
cqlListener.prototype.exitTimeBoundaryExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#elementExtractorExpressionTerm.
cqlListener.prototype.enterElementExtractorExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#elementExtractorExpressionTerm.
cqlListener.prototype.exitElementExtractorExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#conversionExpressionTerm.
cqlListener.prototype.enterConversionExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#conversionExpressionTerm.
cqlListener.prototype.exitConversionExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#typeExtentExpressionTerm.
cqlListener.prototype.enterTypeExtentExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#typeExtentExpressionTerm.
cqlListener.prototype.exitTypeExtentExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#predecessorExpressionTerm.
cqlListener.prototype.enterPredecessorExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#predecessorExpressionTerm.
cqlListener.prototype.exitPredecessorExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#pointExtractorExpressionTerm.
cqlListener.prototype.enterPointExtractorExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#pointExtractorExpressionTerm.
cqlListener.prototype.exitPointExtractorExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#multiplicationExpressionTerm.
cqlListener.prototype.enterMultiplicationExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#multiplicationExpressionTerm.
cqlListener.prototype.exitMultiplicationExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#aggregateExpressionTerm.
cqlListener.prototype.enterAggregateExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#aggregateExpressionTerm.
cqlListener.prototype.exitAggregateExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#durationExpressionTerm.
cqlListener.prototype.enterDurationExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#durationExpressionTerm.
cqlListener.prototype.exitDurationExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#differenceExpressionTerm.
cqlListener.prototype.enterDifferenceExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#differenceExpressionTerm.
cqlListener.prototype.exitDifferenceExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#caseExpressionTerm.
cqlListener.prototype.enterCaseExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#caseExpressionTerm.
cqlListener.prototype.exitCaseExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#powerExpressionTerm.
cqlListener.prototype.enterPowerExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#powerExpressionTerm.
cqlListener.prototype.exitPowerExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#successorExpressionTerm.
cqlListener.prototype.enterSuccessorExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#successorExpressionTerm.
cqlListener.prototype.exitSuccessorExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#polarityExpressionTerm.
cqlListener.prototype.enterPolarityExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#polarityExpressionTerm.
cqlListener.prototype.exitPolarityExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#termExpressionTerm.
cqlListener.prototype.enterTermExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#termExpressionTerm.
cqlListener.prototype.exitTermExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#invocationExpressionTerm.
cqlListener.prototype.enterInvocationExpressionTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#invocationExpressionTerm.
cqlListener.prototype.exitInvocationExpressionTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#caseExpressionItem.
cqlListener.prototype.enterCaseExpressionItem = function(ctx) {
};

// Exit a parse tree produced by cqlParser#caseExpressionItem.
cqlListener.prototype.exitCaseExpressionItem = function(ctx) {
};


// Enter a parse tree produced by cqlParser#dateTimePrecisionSpecifier.
cqlListener.prototype.enterDateTimePrecisionSpecifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#dateTimePrecisionSpecifier.
cqlListener.prototype.exitDateTimePrecisionSpecifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#relativeQualifier.
cqlListener.prototype.enterRelativeQualifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#relativeQualifier.
cqlListener.prototype.exitRelativeQualifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#offsetRelativeQualifier.
cqlListener.prototype.enterOffsetRelativeQualifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#offsetRelativeQualifier.
cqlListener.prototype.exitOffsetRelativeQualifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#exclusiveRelativeQualifier.
cqlListener.prototype.enterExclusiveRelativeQualifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#exclusiveRelativeQualifier.
cqlListener.prototype.exitExclusiveRelativeQualifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#quantityOffset.
cqlListener.prototype.enterQuantityOffset = function(ctx) {
};

// Exit a parse tree produced by cqlParser#quantityOffset.
cqlListener.prototype.exitQuantityOffset = function(ctx) {
};


// Enter a parse tree produced by cqlParser#temporalRelationship.
cqlListener.prototype.enterTemporalRelationship = function(ctx) {
};

// Exit a parse tree produced by cqlParser#temporalRelationship.
cqlListener.prototype.exitTemporalRelationship = function(ctx) {
};


// Enter a parse tree produced by cqlParser#concurrentWithIntervalOperatorPhrase.
cqlListener.prototype.enterConcurrentWithIntervalOperatorPhrase = function(ctx) {
};

// Exit a parse tree produced by cqlParser#concurrentWithIntervalOperatorPhrase.
cqlListener.prototype.exitConcurrentWithIntervalOperatorPhrase = function(ctx) {
};


// Enter a parse tree produced by cqlParser#includesIntervalOperatorPhrase.
cqlListener.prototype.enterIncludesIntervalOperatorPhrase = function(ctx) {
};

// Exit a parse tree produced by cqlParser#includesIntervalOperatorPhrase.
cqlListener.prototype.exitIncludesIntervalOperatorPhrase = function(ctx) {
};


// Enter a parse tree produced by cqlParser#includedInIntervalOperatorPhrase.
cqlListener.prototype.enterIncludedInIntervalOperatorPhrase = function(ctx) {
};

// Exit a parse tree produced by cqlParser#includedInIntervalOperatorPhrase.
cqlListener.prototype.exitIncludedInIntervalOperatorPhrase = function(ctx) {
};


// Enter a parse tree produced by cqlParser#beforeOrAfterIntervalOperatorPhrase.
cqlListener.prototype.enterBeforeOrAfterIntervalOperatorPhrase = function(ctx) {
};

// Exit a parse tree produced by cqlParser#beforeOrAfterIntervalOperatorPhrase.
cqlListener.prototype.exitBeforeOrAfterIntervalOperatorPhrase = function(ctx) {
};


// Enter a parse tree produced by cqlParser#withinIntervalOperatorPhrase.
cqlListener.prototype.enterWithinIntervalOperatorPhrase = function(ctx) {
};

// Exit a parse tree produced by cqlParser#withinIntervalOperatorPhrase.
cqlListener.prototype.exitWithinIntervalOperatorPhrase = function(ctx) {
};


// Enter a parse tree produced by cqlParser#meetsIntervalOperatorPhrase.
cqlListener.prototype.enterMeetsIntervalOperatorPhrase = function(ctx) {
};

// Exit a parse tree produced by cqlParser#meetsIntervalOperatorPhrase.
cqlListener.prototype.exitMeetsIntervalOperatorPhrase = function(ctx) {
};


// Enter a parse tree produced by cqlParser#overlapsIntervalOperatorPhrase.
cqlListener.prototype.enterOverlapsIntervalOperatorPhrase = function(ctx) {
};

// Exit a parse tree produced by cqlParser#overlapsIntervalOperatorPhrase.
cqlListener.prototype.exitOverlapsIntervalOperatorPhrase = function(ctx) {
};


// Enter a parse tree produced by cqlParser#startsIntervalOperatorPhrase.
cqlListener.prototype.enterStartsIntervalOperatorPhrase = function(ctx) {
};

// Exit a parse tree produced by cqlParser#startsIntervalOperatorPhrase.
cqlListener.prototype.exitStartsIntervalOperatorPhrase = function(ctx) {
};


// Enter a parse tree produced by cqlParser#endsIntervalOperatorPhrase.
cqlListener.prototype.enterEndsIntervalOperatorPhrase = function(ctx) {
};

// Exit a parse tree produced by cqlParser#endsIntervalOperatorPhrase.
cqlListener.prototype.exitEndsIntervalOperatorPhrase = function(ctx) {
};


// Enter a parse tree produced by cqlParser#invocationTerm.
cqlListener.prototype.enterInvocationTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#invocationTerm.
cqlListener.prototype.exitInvocationTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#literalTerm.
cqlListener.prototype.enterLiteralTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#literalTerm.
cqlListener.prototype.exitLiteralTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#externalConstantTerm.
cqlListener.prototype.enterExternalConstantTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#externalConstantTerm.
cqlListener.prototype.exitExternalConstantTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#intervalSelectorTerm.
cqlListener.prototype.enterIntervalSelectorTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#intervalSelectorTerm.
cqlListener.prototype.exitIntervalSelectorTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#tupleSelectorTerm.
cqlListener.prototype.enterTupleSelectorTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#tupleSelectorTerm.
cqlListener.prototype.exitTupleSelectorTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#instanceSelectorTerm.
cqlListener.prototype.enterInstanceSelectorTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#instanceSelectorTerm.
cqlListener.prototype.exitInstanceSelectorTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#listSelectorTerm.
cqlListener.prototype.enterListSelectorTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#listSelectorTerm.
cqlListener.prototype.exitListSelectorTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#codeSelectorTerm.
cqlListener.prototype.enterCodeSelectorTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#codeSelectorTerm.
cqlListener.prototype.exitCodeSelectorTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#conceptSelectorTerm.
cqlListener.prototype.enterConceptSelectorTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#conceptSelectorTerm.
cqlListener.prototype.exitConceptSelectorTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#parenthesizedTerm.
cqlListener.prototype.enterParenthesizedTerm = function(ctx) {
};

// Exit a parse tree produced by cqlParser#parenthesizedTerm.
cqlListener.prototype.exitParenthesizedTerm = function(ctx) {
};


// Enter a parse tree produced by cqlParser#ratio.
cqlListener.prototype.enterRatio = function(ctx) {
};

// Exit a parse tree produced by cqlParser#ratio.
cqlListener.prototype.exitRatio = function(ctx) {
};


// Enter a parse tree produced by cqlParser#booleanLiteral.
cqlListener.prototype.enterBooleanLiteral = function(ctx) {
};

// Exit a parse tree produced by cqlParser#booleanLiteral.
cqlListener.prototype.exitBooleanLiteral = function(ctx) {
};


// Enter a parse tree produced by cqlParser#nullLiteral.
cqlListener.prototype.enterNullLiteral = function(ctx) {
};

// Exit a parse tree produced by cqlParser#nullLiteral.
cqlListener.prototype.exitNullLiteral = function(ctx) {
};


// Enter a parse tree produced by cqlParser#stringLiteral.
cqlListener.prototype.enterStringLiteral = function(ctx) {
};

// Exit a parse tree produced by cqlParser#stringLiteral.
cqlListener.prototype.exitStringLiteral = function(ctx) {
};


// Enter a parse tree produced by cqlParser#numberLiteral.
cqlListener.prototype.enterNumberLiteral = function(ctx) {
};

// Exit a parse tree produced by cqlParser#numberLiteral.
cqlListener.prototype.exitNumberLiteral = function(ctx) {
};


// Enter a parse tree produced by cqlParser#dateTimeLiteral.
cqlListener.prototype.enterDateTimeLiteral = function(ctx) {
};

// Exit a parse tree produced by cqlParser#dateTimeLiteral.
cqlListener.prototype.exitDateTimeLiteral = function(ctx) {
};


// Enter a parse tree produced by cqlParser#timeLiteral.
cqlListener.prototype.enterTimeLiteral = function(ctx) {
};

// Exit a parse tree produced by cqlParser#timeLiteral.
cqlListener.prototype.exitTimeLiteral = function(ctx) {
};


// Enter a parse tree produced by cqlParser#quantityLiteral.
cqlListener.prototype.enterQuantityLiteral = function(ctx) {
};

// Exit a parse tree produced by cqlParser#quantityLiteral.
cqlListener.prototype.exitQuantityLiteral = function(ctx) {
};


// Enter a parse tree produced by cqlParser#ratioLiteral.
cqlListener.prototype.enterRatioLiteral = function(ctx) {
};

// Exit a parse tree produced by cqlParser#ratioLiteral.
cqlListener.prototype.exitRatioLiteral = function(ctx) {
};


// Enter a parse tree produced by cqlParser#intervalSelector.
cqlListener.prototype.enterIntervalSelector = function(ctx) {
};

// Exit a parse tree produced by cqlParser#intervalSelector.
cqlListener.prototype.exitIntervalSelector = function(ctx) {
};


// Enter a parse tree produced by cqlParser#tupleSelector.
cqlListener.prototype.enterTupleSelector = function(ctx) {
};

// Exit a parse tree produced by cqlParser#tupleSelector.
cqlListener.prototype.exitTupleSelector = function(ctx) {
};


// Enter a parse tree produced by cqlParser#tupleElementSelector.
cqlListener.prototype.enterTupleElementSelector = function(ctx) {
};

// Exit a parse tree produced by cqlParser#tupleElementSelector.
cqlListener.prototype.exitTupleElementSelector = function(ctx) {
};


// Enter a parse tree produced by cqlParser#instanceSelector.
cqlListener.prototype.enterInstanceSelector = function(ctx) {
};

// Exit a parse tree produced by cqlParser#instanceSelector.
cqlListener.prototype.exitInstanceSelector = function(ctx) {
};


// Enter a parse tree produced by cqlParser#instanceElementSelector.
cqlListener.prototype.enterInstanceElementSelector = function(ctx) {
};

// Exit a parse tree produced by cqlParser#instanceElementSelector.
cqlListener.prototype.exitInstanceElementSelector = function(ctx) {
};


// Enter a parse tree produced by cqlParser#listSelector.
cqlListener.prototype.enterListSelector = function(ctx) {
};

// Exit a parse tree produced by cqlParser#listSelector.
cqlListener.prototype.exitListSelector = function(ctx) {
};


// Enter a parse tree produced by cqlParser#displayClause.
cqlListener.prototype.enterDisplayClause = function(ctx) {
};

// Exit a parse tree produced by cqlParser#displayClause.
cqlListener.prototype.exitDisplayClause = function(ctx) {
};


// Enter a parse tree produced by cqlParser#codeSelector.
cqlListener.prototype.enterCodeSelector = function(ctx) {
};

// Exit a parse tree produced by cqlParser#codeSelector.
cqlListener.prototype.exitCodeSelector = function(ctx) {
};


// Enter a parse tree produced by cqlParser#conceptSelector.
cqlListener.prototype.enterConceptSelector = function(ctx) {
};

// Exit a parse tree produced by cqlParser#conceptSelector.
cqlListener.prototype.exitConceptSelector = function(ctx) {
};


// Enter a parse tree produced by cqlParser#identifier.
cqlListener.prototype.enterIdentifier = function(ctx) {
};

// Exit a parse tree produced by cqlParser#identifier.
cqlListener.prototype.exitIdentifier = function(ctx) {
};


// Enter a parse tree produced by cqlParser#externalConstant.
cqlListener.prototype.enterExternalConstant = function(ctx) {
};

// Exit a parse tree produced by cqlParser#externalConstant.
cqlListener.prototype.exitExternalConstant = function(ctx) {
};


// Enter a parse tree produced by cqlParser#memberInvocation.
cqlListener.prototype.enterMemberInvocation = function(ctx) {
};

// Exit a parse tree produced by cqlParser#memberInvocation.
cqlListener.prototype.exitMemberInvocation = function(ctx) {
};


// Enter a parse tree produced by cqlParser#functionInvocation.
cqlListener.prototype.enterFunctionInvocation = function(ctx) {
};

// Exit a parse tree produced by cqlParser#functionInvocation.
cqlListener.prototype.exitFunctionInvocation = function(ctx) {
};


// Enter a parse tree produced by cqlParser#thisInvocation.
cqlListener.prototype.enterThisInvocation = function(ctx) {
};

// Exit a parse tree produced by cqlParser#thisInvocation.
cqlListener.prototype.exitThisInvocation = function(ctx) {
};


// Enter a parse tree produced by cqlParser#indexInvocation.
cqlListener.prototype.enterIndexInvocation = function(ctx) {
};

// Exit a parse tree produced by cqlParser#indexInvocation.
cqlListener.prototype.exitIndexInvocation = function(ctx) {
};


// Enter a parse tree produced by cqlParser#totalInvocation.
cqlListener.prototype.enterTotalInvocation = function(ctx) {
};

// Exit a parse tree produced by cqlParser#totalInvocation.
cqlListener.prototype.exitTotalInvocation = function(ctx) {
};


// Enter a parse tree produced by cqlParser#func.
cqlListener.prototype.enterFunc = function(ctx) {
};

// Exit a parse tree produced by cqlParser#func.
cqlListener.prototype.exitFunc = function(ctx) {
};


// Enter a parse tree produced by cqlParser#paramList.
cqlListener.prototype.enterParamList = function(ctx) {
};

// Exit a parse tree produced by cqlParser#paramList.
cqlListener.prototype.exitParamList = function(ctx) {
};


// Enter a parse tree produced by cqlParser#quantity.
cqlListener.prototype.enterQuantity = function(ctx) {
};

// Exit a parse tree produced by cqlParser#quantity.
cqlListener.prototype.exitQuantity = function(ctx) {
};


// Enter a parse tree produced by cqlParser#unit.
cqlListener.prototype.enterUnit = function(ctx) {
};

// Exit a parse tree produced by cqlParser#unit.
cqlListener.prototype.exitUnit = function(ctx) {
};



exports.cqlListener = cqlListener;