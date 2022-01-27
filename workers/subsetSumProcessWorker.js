const { SubsetSum } = require('../subsetSum/subsetsum');

process.on('message', msg => {
  const subsetsum = new SubsetSum(msg.sum, msg.set);
  subsetsum.on('match', data => {
    process.send({ event: 'match', data });
  });

  subsetsum.on('end', data => {
    process.send({ event: 'end', data });
  });

  subsetsum.start();
});

process.send('ready')