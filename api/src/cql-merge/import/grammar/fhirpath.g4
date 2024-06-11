grammar fhirpath;

// Grammar rules

//prog: line (line)*;
//line: ID ( '(' expr ')') ':' expr '\r'? '\n';

// This differs from that used in the default clinical_quality_language, because
// in order to support JavaScript/TypeScript, we needed to remove the CQL `function`
// keyword. This has been replaced with `func`.

expression
        : term                                                      #termExpression
        | expression '.' invocation                                 #invocationExpression
        | expression '[' expression ']'                             #indexerExpression
        | ('+' | '-') expression                                    #polarityExpression
        | expression ('*' | '/' | 'div' | 'mod') expression         #multiplicativeExpression
        | expression ('+' | '-' | '&') expression                   #additiveExpression
        | expression ('is' | 'as') typeSpecifier                    #typeExpression
        | expression '|' expression                                 #unionExpression
        | expression ('<=' | '<' | '>' | '>=') expression           #inequalityExpression
        | expression ('=' | '~' | '!=' | '!~') expression           #equalityExpression
        | expression ('in' | 'contains') expression                 #membershipExpression
        | expression 'and' expression                               #andExpression
        | expression ('or' | 'xor') expression                      #orExpression
        | expression 'implies' expression                           #impliesExpression
        //| (IDENTIFIER)? '=>' expression                             #lambdaExpression
        ;

term
        : invocation                                            #invocationTerm
        | literal                                               #literalTerm
        | externalConstant                                      #externalConstantTerm
        | '(' expression ')'                                    #parenthesizedTerm
        ;

literal
        : '{' '}'                                               #nullLiteral
        | ('true' | 'false')                                    #booleanLiteral
        | STRING                                                #stringLiteral
        | NUMBER                                                #numberLiteral
        | DATETIME                                              #dateTimeLiteral
        | TIME                                                  #timeLiteral
        | quantity                                              #quantityLiteral
        ;

externalConstant
        : '%' identifier
        ;

invocation                          // Terms that can be used after the function/member invocation '.'
        : identifier                                            #memberInvocation
        | func                                                  #functionInvocation
        | '$this'                                               #thisInvocation
        | '$index'                                              #indexInvocation
        | '$total'                                              #totalInvocation
        ;

func
        : identifier '(' paramList? ')'
        ;

paramList
        : expression (',' expression)*
        ;

quantity
        : NUMBER unit?
        ;

unit
        : dateTimePrecision
        | pluralDateTimePrecision
        | STRING // UCUM syntax for units of measure
        ;

dateTimePrecision
        : 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'
        ;

pluralDateTimePrecision
        : 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds'
        ;

typeSpecifier
        : qualifiedIdentifier
        ;

qualifiedIdentifier
        : identifier ('.' identifier)*
        ;

identifier
        : IDENTIFIER
        | DELIMITEDIDENTIFIER
        | 'as'
        | 'is'
        ;


/****************************************************************
    Lexical rules
*****************************************************************/

// Not sure why, but with these as lexical rules, when the grammar is imported into CQL, they are not correctly recognized
// Moving the same rules into the literal production rule above corrects the issue
//EMPTY
//        : '{' '}'
//        ;                      // To create an empty array (and avoid a NULL literal)

//BOOL
//        : 'true'
//        | 'false'
//        ;

DATETIME
        : '@'
            [0-9][0-9][0-9][0-9] // year
            (
                '-'[0-9][0-9] // month
                (
                    '-'[0-9][0-9] // day
                    (
                        'T' TIMEFORMAT
                    )?
                 )?
             )?
             'Z'? // UTC specifier
        ;

TIME
        : '@' 'T' TIMEFORMAT
        ;

fragment TIMEFORMAT
        :
            [0-9][0-9] (':'[0-9][0-9] (':'[0-9][0-9] ('.'[0-9]+)?)?)?
            ('Z' | ('+' | '-') [0-9][0-9]':'[0-9][0-9])? // timezone
        ;

IDENTIFIER
        : ([A-Za-z] | '_')([A-Za-z0-9] | '_')*            // Added _ to support CQL (FHIR could constrain it out)
        ;

DELIMITEDIDENTIFIER
        : '`' (ESC | .)*? '`'
        ;

STRING
        : '\'' (ESC | .)*? '\''
        ;

// Also allows leading zeroes now (just like CQL and XSD)
NUMBER
        : [0-9]+('.' [0-9]+)?
        ;

// Pipe whitespace to the HIDDEN channel to support retrieving source text through the parser.
WS
        : [ \r\n\t]+ -> channel(HIDDEN)
        ;

COMMENT
        : '/*' .*? '*/' -> channel(HIDDEN)
        ;

LINE_COMMENT
        : '//' ~[\r\n]* -> channel(HIDDEN)
        ;

fragment ESC
        : '\\' ([`'\\/fnrt] | UNICODE)    // allow \`, \', \\, \/, \f, etc. and \uXXX
        ;

fragment UNICODE
        : 'u' HEX HEX HEX HEX
        ;

fragment HEX
        : [0-9a-fA-F]
        ;
