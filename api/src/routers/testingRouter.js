const express = require('express');
const testing = require('../handlers/testingHandler');

const TestingRouter = express.Router();

// Routes for /authoring/api/testing
TestingRouter.route('/').get(testing.allGet).post(testing.singlePost);

// Routes for /authoring/api/testing/:patient
TestingRouter.route('/:patient').get(testing.singleGet).delete(testing.singleDelete);

module.exports = TestingRouter;
