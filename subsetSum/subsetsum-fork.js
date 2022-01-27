const { EventEmitter } = require('events');
const path = require('path');
const { ProcessPool } = require('../processPool');

const workerFile = path.join(__dirname, '..', 'workers', 'subsetSumProcessWorker.js');
const workers = new ProcessPool(workerFile, 2);

class SubsetSum extends EventEmitter {
  constructor(sum, set) {
    super();
    this.sum = sum;
    this.set = set;
  }

  async start() {
    const worker = await workers.acquire();
    worker.send({ sum: this.sum, set: this.set });

    const onMessage = msg => {
      if (msg.event === 'end') {
        worker.removeListener('message', onMessage);
        workers.release(worker);
      }
      this.emit(msg.event, msg.data)
    };

    worker.on('message', onMessage);
  }
}

module.exports = { SubsetSum };
