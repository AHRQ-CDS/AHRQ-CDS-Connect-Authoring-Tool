const config = require('../config');

module.exports = (req, res) => {
  res.type('js');
  // If ForeSee is not active, just send a (mostly) blank response.
  if (!config.get('foreSee.active')) {
    res.status(200).send('// ForeSee not configured');
    return;
  }

  // ForeSee is active, so setup the script w/ the configured src and send it
  const foreSeeScript = `// ForeSee Staging Embed Script v2.01
// DO NOT MODIFY BELOW THIS LINE *****************************************
;(function (g) {
var d = document, am = d.createElement('script'), h = d.head || d.getElementsByTagName("head")[0], fsr = 'fsReady',
aex = {
  "src": "${config.get('foreSee.src').trim()}",
  "type": "text/javascript",
  "async": "true",
  "data-vendor": "fs",
  "data-role": "gateway"
};
for (var attr in aex) { am.setAttribute(attr, aex[attr]); } h.appendChild(am); g[fsr] || (g[fsr] = function () { var aT = '__' + fsr + '_stk__'; g[aT] = g[aT] || []; g[aT].push(arguments); });
})(window);
// DO NOT MODIFY ABOVE THIS LINE *****************************************`;

  res.status(200).send(foreSeeScript);
};
