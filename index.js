const { createServer } = require('http');
const { SubsetSum } = require('./subsetSum/subsetsum-thread');

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname !== '/subsetSum') {
    res.writeHead(200);
    res.end('Hello');
    return;
  }

  const data = JSON.parse(url.searchParams.get('data'));
  const sum = JSON.parse(url.searchParams.get('sum'));
  res.writeHead(200);

  const subsetSum = new SubsetSum(sum, data);
  subsetSum.on('match', match => {
    res.write(`Match: ${JSON.stringify(match)}\n`);
  });

  subsetSum.on('end', () => res.end());
  subsetSum.start();
}).listen(8000, () => console.log('server started'));
