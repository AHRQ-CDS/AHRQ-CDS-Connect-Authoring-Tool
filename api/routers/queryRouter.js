const express = require('express');
const queryHandler = require('../handlers/queryHandler');

const QueryRouter = express.Router();

//  Routes for /authoring/api/query/implicitconversion
QueryRouter.route('/implicitconversion').get(queryHandler.implicitConversionInfo);

//  Routes for /authoring/api/query/operator?typeSpecifier=<Type>&elementTypes=<elementType>
QueryRouter.route('/operator').get(queryHandler.operatorQuery);

//  Routes for /authoring/api/query/resources/<resourceName>?fhirversion=<1.0.2|3.0.0|4.0.0|4.0.1>
QueryRouter.route('/resources/:resourceName').get(queryHandler.resourceQuery);

module.exports = QueryRouter;
