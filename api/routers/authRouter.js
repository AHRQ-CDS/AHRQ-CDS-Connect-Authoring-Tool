const express = require('express');
const auth = require('../handlers/authHandler');

const AuthRouter = express.Router();

AuthRouter.route('/login').post(auth.login);

AuthRouter.route('/logout').get(auth.logout);

AuthRouter.route('/user').get(auth.currentUser);

module.exports = AuthRouter;
