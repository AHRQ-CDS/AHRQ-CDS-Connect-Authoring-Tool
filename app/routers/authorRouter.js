const express = require('express');
const author = require('../handlers/authorHandler');
const AuthorRouter = express.Router();

// Routes for /api/author
AuthorRouter.route('/')
  .get(author.allGet)
  .post(author.singlePost)
  .put(author.singlePut);

// Routes for /api/author/:author
AuthorRouter.route('/:author')
  .get(author.singleGet)
  .delete(author.singleDelete);

module.exports = AuthorRouter;