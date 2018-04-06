const TransactionPool = require('./transaction-pool');
const Transacction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', () => {
  let tp, wallet, transaction;
  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = Transacction.newTransaction(wallet, 'r4nd-4dr355', 30);
    tp.updateOrAddTransaction(transaction);
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
});
