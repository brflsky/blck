const TransactionPool = require('./transaction-pool');
const Transacction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain/');

describe('TransactionPool', () => {
  let tp, wallet, transaction, bc;
  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    bc = new Blockchain();
    // transaction = Transacction.newTransaction(wallet, 'r4nd-4dr355', 30);
    // tp.updateOrAddTransaction(transaction);
    // Line below is doing same thing as the 2 above
    transaction = wallet.createTransaction('r4nd-4dr355', 30, bc, tp);
  });

  it('adds transaction to the pool', () => {
    expect(tp.transactions[0]).toEqual(transaction);
  });

  it('updates transaction in the pool', () => {
    // const oldTR = JSON.stringify(transaction);
    // console.log('before:', transaction);
    const newTR = Transacction.newTransaction(wallet, 'r4nd-4dr355', 30);
    newTR.id = transaction.id;
    newTR.update(wallet, 'newaddress', 70);
    // console.log('after', transaction);
    // console.log('in pool', tp.transactions[0]);
    tp.updateOrAddTransaction(newTR);
    // expect(JSON.stringify(tp.transactions[0])).not.toEqual(oldTR);
    expect(tp.transactions[0]).toEqual(newTR);
  });
  // it('updates a transaction in the pool', () => {
  //   const oldTransaction = JSON.stringify(transaction);
  //   const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40);
  //   // tp.updateOrAddTransaction(newTransaction);
  //   expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
  //     .not.toEqual(oldTransaction);
  // });

  it('clear transactions in the pool', () => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
  });

  describe('mixing valid and corrupted transactions', () => {
    let validTransactions;
    beforeEach(() => {
      validTransactions = [...tp.transactions];
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction('r4nd-4ddr355', 30, bc, tp);
        if (i % 2 === 0) {
          transaction.input.amount = 99999;
        } else {
          validTransactions.push(transaction);
        }
      }
    });
    it('shows a difference between valid and corrupt transactions', () => {
      expect(JSON.stringify(tp.transaction)).not.toEqual(JSON.stringify(validTransactions));
    });
    it('grabs valid transaction from the pool', () => {
      expect(JSON.stringify(tp.validTransactions())).toEqual(JSON.stringify(validTransactions));
    });
  });
});
