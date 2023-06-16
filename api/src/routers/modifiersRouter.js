const express = require('express');
const modifiers = require('../handlers/modifiersHandler');
const ModifiersRouter = express.Router();

// Routes for /authoring/api/modifiers
ModifiersRouter.route('/:artifact').get(modifiers.allGet);

module.exports = ModifiersRouter;
