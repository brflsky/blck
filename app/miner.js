const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    console.log('validated');
    // include reword for the miner
    validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
    console.log('rewarded');
    // create block consisting of the valid transaction
    const block = this.blockchain.addBlock(validTransactions);
    console.log('blog added');
    // synchronize chains in peer-2-peer server
    this.p2pServer.syncChains();
    console.log('synchronized');
    // clear the transaction pools
    this.transactionPool.clear();
    console.log('pool cleared');
    // broadcast to every miner to clear their transaction pool
    this.p2pServer.broadcastClearTransactions();
    console.log('cleer_pool broadcasted');
    return block;
  }
}

module.exports = Miner;
