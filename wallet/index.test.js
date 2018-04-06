const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');


describe('Wallet', () => {
  let wallet, tp;

  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
  });

  describe('creating a transaction', () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = 'random-adrress';
      transaction = wallet.createTransaction(recipient, sendAmount, tp);
    });

    describe('and doing the samte transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, tp);
      });
      it('doubles `sendAmount` subtracted from the wallet balacne', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
          .toEqual(wallet.balance - (sendAmount * 2));
      });

      it('clones `sendAmount` output for recipient', () => {
        expect(transaction.outputs.filter(output => output.address === recipient)
          .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
      });
    });
  });
});
