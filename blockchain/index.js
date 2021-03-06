const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    const lastBlock = this.chain[this.chain.length - 1];
    const block = Block.mineBlock(lastBlock, data);
    this.chain.push(block);

    return block;
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

    for (let i = 1; i < chain.length; i++) {
      if (chain[i - 1].hash !== chain[i].lastHash ||
        chain[i].hash !== Block.blockHash(chain[i])) return false;
    }

    return true;
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log('Received chain is not longer then current one');
      return;
    }
    if (!this.isValidChain(newChain)) {
      console.log('Received chain is invalid');
      return;
    }
    console.log('Replacing chain');
    this.chain = newChain;
  }
}

module.exports = Blockchain;
