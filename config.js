const process = require('process');

module.exports = {
   mongodb : {
      localhost : 'mongodb://localhost/cds_authoring'
   },
   api : {
      baseUrl: process.env.API_BASE_URL || "http://localhost:3001/api"
   }
}