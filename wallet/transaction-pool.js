const Transaction = require('./transaction');

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  updateOrAddTransaction(transaction) {
    const transactionWithId = this.transactions.find(t => t.id === transaction.id);

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  existingTransaction(address) {
    return this.transactions.find(t => t.input.address === address);
  }

  validTransactions() {
    return this.transactions.filter((transaction) => {
      const outputTotal = transaction.outputs
        .reduce((total, output) => total + output.amount, 0);

      if (transaction.input.amount !== outputTotal) {
        console.log(`Invalid Transaction From ${transaction.input.address}`);
        return;
      }
      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature From ${transaction.input.address}`);
        return;
      }

      return transaction;
    });
  }
  // validTransactions() {
  //   return this.transactions
  //     .filter(transaction => transaction.input.amount === transaction.outputs
  //       .reduce((prevOutput, currOutput) => prevOutput.amount + currOutput.amount, { amoutn: 0 }));
  // }

  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;
