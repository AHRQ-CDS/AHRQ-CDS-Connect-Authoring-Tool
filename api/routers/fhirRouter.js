const express = require('express');
const fhir = require('../handlers/fhirHandler');

const FHIRRouter = express.Router();

FHIRRouter.route('/login').post(fhir.login);

FHIRRouter.route('/search').get(fhir.searchForValueSets);

FHIRRouter.route('/vs/:id').get(fhir.getValueSet);

FHIRRouter.route('/code').get(fhir.getCode);

module.exports = FHIRRouter;
