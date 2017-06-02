/**
 * This is a simple launch script for serving up the built (production) react
 * code.  See: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#other-solutions
 *
 * This is mainly used by PM2 and our Docker image.
 */
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(9000);