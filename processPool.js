const { fork } = require('child_process');

class ProcessPool {
  constructor(file, poolMax) {
    this.file = file;
    this.poolMax = poolMax;
    this.pool = [];
    this.active = [];
    this.waiting = [];
  }

  acquire() {
    return new Promise((resolve, reject) => {
      let worker;
      if (this.pool.length > 0) {
        worker = this.pool.pop();
        this.active.push(worker);
        return resolve(worker);
      }

      if (this.active.length >= this.poolMax) {
        return this.waiting.push({ resolve, reject });
      }

      worker = fork(this.file);
      worker.once('message', message => {
        if (message === 'ready') {
          this.active.push(worker);
          return resolve(worker);
        }
        worker.kill();
        reject(new Error('improper process start'));
      });

      worker.once('exit', code => {
        console.log(`worker exited with code ${code}`);
        this.active = this.active.filter(w => worker !== w);
        this.pool = this.pool.filter(w => worker !== w);
      });
    });
  }

  release(worker) {
    if (this.waiting.length > 0) {
      const { resolve } = this.waiting.shift();
      return resolve(worker);
    }
    this.active = this.active.filter(w => worker !== w);
    this.pool.push(worker);
  }
}

module.exports = { ProcessPool };
