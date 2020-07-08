const Promise  = require('bluebird');
const expect   = require('chai').expect;
const TorAgent = require('../lib/agent');
const helpers  = require('./helpers');
const request  = Promise.promisify(require('request'));

describe('toragent', function() {
  let agent;

  // Spawning tor can be slow
  this.timeout(1000000);

  before(() => {
    return TorAgent.create().then(res => {
      agent = res;
    });
  });

  it('spawns a tor process', () => {
    const pid = agent.tor.process.pid;
    return helpers.isProcessRunning(pid).then(running => {
      expect(running).to.be.true;
    });
  });

  it('can be used with request', () => {
    return request({
      url: 'https://www.google.com',
      agent: agent,
    }).spread(res => {
      // Could be blocked
      expect(res.statusCode === 200 || res.statusCode === 503).to.be.ok;
    });
  });

  it('closes the tor process when calling destroy', () => {
    let pid;

    return TorAgent.create().then(agent => {
      pid = agent.tor.process.pid;
      return agent.destroy();
    }).then(() => {
      return helpers.isProcessRunning(pid);
    }).then(running => {
      expect(running).to.be.false;
    });
  });
});
