const { SubsetSum } = require('./subsetsum');

class SubsetSumDefer extends SubsetSum {
  _combineInterleaved(set, subset) {
    this.runningCombine++;
    setImmediate(() => {
      this._combine(set, subset);
      if (--this.runningCombine === 0) {
        this.emit('end')
      }
    });
  }

  _combine(set, subset) {
    for (let i = 0; i < set.length; i++) {
      const newSubset = subset.concat(set[i]);
      this._combineInterleaved(set.slice(i + 1), newSubset);
      this._processSubset(newSubset);
    }
  }

  start() {
    this.runningCombine = 0;
    this._combineInterleaved(this.set, []);
  }
}

module.exports = {
  SubsetSumDefer
};
