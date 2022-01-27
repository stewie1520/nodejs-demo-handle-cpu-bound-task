const { parentPort } = require('worker_threads');

const { SubsetSum } = require('../subsetSum/subsetsum');

parentPort.on('message', msg => {
  const subsetsum = new SubsetSum(msg.sum, msg.set);
  subsetsum.on('match', data => {
    parentPort.postMessage({ event: 'match', data });
  });

  subsetsum.on('end', data => {
    parentPort.postMessage({ event: 'end', data });
  });

  subsetsum.start();
});
