// Based on https://github.com/HL7/cql/blob/master/spec/dist/cql.js

const rules = {
  // The 'result' and 'datetime' rules were added to the base CQL highlighting rules
  result: /==> ..+/,
  datetime: /@[T0-9:-]+/,
  // The remaining rules come from the base CQL highlighting rules
  comment: {
    pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:\/\/|#).*)/,
    lookbehind: true
  },
  string: {
    pattern: /(')(?:\\[\s\S]|(?!\1)[^\\]|\1\1)*\1/,
    greedy: true
  },
  variable: {
    pattern: /(["`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
    greedy: true
  },
  keyword:
    /\b(?:after|all|and|as|asc|ascending|before|between|by|called|case|cast|code|Code|codesystem|codesystems|collapse|concept|Concept|contains|context|convert|date|day|days|default|define|desc|descending|difference|display|distinct|div|duration|during|else|end|ends|except|exists|expand|false|flatten|from|function|hour|hours|if|implies|in|include|includes|included in|intersect|Interval|is|let|library|List|maximum|meets|millisecond|milliseconds|minimum|minute|minutes|mod|month|months|not|null|occurs|of|on|or|overlaps|parameter|per|predecessor|private|properly|public|return|same|singleton|second|seconds|start|starts|sort|successor|such that|then|time|timezoneoffset|to|true|Tuple|union|using|valueset|version|week|weeks|where|when|width|with|within|without|xor|year|years)\b/i,
  boolean: /\b(?:true|false|null)\b/i,
  number: /\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,
  punctuation: /[;[\]()`,.]/,
  operator: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?\b/i
};

export default rules;
