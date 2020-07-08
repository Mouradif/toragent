const Promise = require('bluebird');
const exec    = Promise.promisify(require('child_process').exec);

exports.isProcessRunning = function(pid) {
  const cmd = 'ps -p ' + pid;
  const opts = {encoding: 'utf8', maxBuffer: 1000 * 1024};

  return exec(cmd, opts).spread((stdout) => {
    return stdout.indexOf(pid) !== -1;
  }).catch(() => {
    return false;
  });
};
