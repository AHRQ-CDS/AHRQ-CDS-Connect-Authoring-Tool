var childProcess = require('child_process');
var path = require('path');

function runScript(scriptPath, callback) {
  var invoked = false;
  var process = childProcess.fork(scriptPath);

  // listen for errors as they may prevent the exit event from firing
  process.on('error', function (err) {
    if (invoked) return;
    invoked = true;
    callback(err);
  });

  // execute the callback once the process has finished running
  process.on('exit', function (code) {
    if (invoked) return;
    invoked = true;
    var err = code === 0 ? null : new Error('exit code ' + code);
    callback(err);
  });
}
runScript(path.join(__dirname, 'src', 'dstu2_dataelementparser.js'), function (err) {
  if (err) throw err;
  console.log('finished running DSTU2 Resource Generation');
});
runScript(path.join(__dirname, 'src', 'stu3_dataelementparser.js'), function (err) {
  if (err) throw err;
  console.log('finished running STU3 Resource Generation');
});
runScript(path.join(__dirname, 'src', 'r4_dataelementparser.js'), function (err) {
  if (err) throw err;
  console.log('finished running R4 Resource Generation');
});
