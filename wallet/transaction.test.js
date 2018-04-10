const Transaction = require('./transaction');
const Wallet = require('./index');
const { MINING_REWARD } = require('../config');
// const ChainUtil = require('../chain-util');

describe('Transaction', () => {
  let transaction, wallet, recipient, amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipient = 'r34ddee';
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });

  it('outputs the `amount` substructed from the wallet balance', () => {
    // console.log('transaction:', transaction);
    expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
      .toEqual(wallet.balance - amount);
  });

  it('outputs the `amount` added to receipent account', () => {
    expect(transaction.outputs.find(output => output.address === recipient).amount)
      .toEqual(amount);
  });

  it('inputs the balance of the wallet', () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it('validates a valid transaction', () => {
    expect(Transaction.verifyTransaction(transaction)).toEqual(true);
  });

  it('invalidates a corrupt transaction', () => {
    transaction.outputs[0].amount = 77777777;
    expect(Transaction.verifyTransaction(transaction)).toEqual(false);
  });

  it('should not allow transaction where amount exceeds the ballance', () => {
    const tr1 = Transaction.newTransaction(wallet, recipient, amount * 10000);
    expect(tr1).toEqual(undefined);
  });

  describe('and update transaction', () => {
    let nextAmount, nextRecipient;

    beforeEach(() => {
      nextAmount = 20;
      nextRecipient = 'erwer-wrwe-rwe';
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    });

    it('subracks nextAmount from sender output', () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toBe(wallet.balance - amount - nextAmount);
    });

    it('outputs amout for next recipient', () => {
      expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
        .toBe(nextAmount);
    });
  });

  describe('creating reword transaction', () => {
    beforeEach(() => {
      transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
    });
    it('reowrds miner\'s wallet', () => {
      // console.log('TR:', transaction);
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toBe(MINING_REWARD);
    });
  });
});
