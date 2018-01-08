const ValueSet = require('../models/valueSet');

function search(params) {
  const query = {};
  const options = { _id: 0, __v: 0 };
  let sort = { codeCount: -1 };
  const result = {};
  if (typeof params.oid !== 'undefined') {
    query.oid = { '$eq': params.oid };
    result.oid = params.oid;
  }
  if (typeof params.keyword !== 'undefined') {
    // If keywords are an array, create a string that will search the words like an AND query
    // e.g., ['foo', 'bar'] becomes '"foo" "bar"' (as opposed to 'foo bar', which is more like an OR)
    const kw = Array.isArray(params.keyword) ? params.keyword.map(w => `"${w}"`).join(' ') : params.keyword;
    query['$text'] = {
      '$search': kw,
      '$language': 'english'
    }
    result.keyword = kw;
    // Add the score to the result objects
    options.score = { $meta: "textScore" };
    // Add the score as the first thing to sort by
    sort = Object.assign({ score: { $meta: "textScore" } }, sort);
  }
  return new Promise((resolve, reject) => {
    ValueSet.find(query, options).sort(sort).exec((err, valueSets) => {
      if (err) {
        reject(err);
      } else {
        result.count = valueSets.length;
        result.results = valueSets;
        resolve(result);
      }
    });
  })
}

module.exports = search;