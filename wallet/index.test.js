const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');


describe('Wallet', () => {
  let wallet, tp, bc;

  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
    bc = new Blockchain();
  });

  describe('creating a transaction', () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = 'random-adrress';
      transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
    });

    describe('and doing the samte transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, bc, tp);
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
  describe('calculating a balance', () => {
    let addBalance, repeatAdd, senderWallet;

    beforeEach(() => {
      senderWallet = new Wallet();
      addBalance = 100;
      repeatAdd = 3;
      for (let i = 0; i < repeatAdd; i++) {
        senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
      }
      bc.addBlock(tp.transactions);
    });

    it('calculate the balance for blockchain matching recipient', () => {
      expect(wallet.calculateBalance(bc)).toBe(INITIAL_BALANCE + (repeatAdd * addBalance));
    });

    it('calculate the balance for blockchain matching sender', () => {
      expect(senderWallet.calculateBalance(bc)).toBe(INITIAL_BALANCE - (repeatAdd * addBalance));
    });

    describe('and the recipient conduct a transaction', () => {
      let substructBalance, recipientBalance;

      beforeEach(() => {
        tp.clear();
        substructBalance = 60;
        recipientBalance = wallet.calculateBalance(bc);
        wallet.createTransaction(senderWallet.publicKey, substructBalance, bc, tp);
        bc.addBlock(tp.transactions);
      });
      describe('the sender sends another transaction to the recipient', () => {
        beforeEach(() => {
          tp.clear();
          senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
          bc.addBlock(tp.transactions);
        });

        it('calutes the recipinet balance ', () => {
          console.log('Walet ending amount:', wallet.calculateBalance(bc));
          console.log('Sender Walet ending amount:', senderWallet.calculateBalance(bc));

          expect(wallet.calculateBalance(bc)).toBe(recipientBalance - substructBalance + addBalance);
        });

        it('calculate a balance after sending and receiving coins', (done) => {
          tp.clear();
          console.log('Walet starting amount:', wallet.calculateBalance(bc));
          console.log('Sender Walet starting amount:', senderWallet.calculateBalance(bc));
          wallet.createTransaction(senderWallet.publicKey, addBalance * 2, bc, tp);
          bc.addBlock(tp.transactions);
          tp.clear();
          console.log('Walet -200 amount:', wallet.calculateBalance(bc));
          console.log('Sender +200 ending amount:', senderWallet.calculateBalance(bc));
          senderWallet.createTransaction(wallet.publicKey, addBalance / 2, bc, tp);
          bc.addBlock(tp.transactions);
          tp.clear();
          console.log('Walet +50 amount:', wallet.calculateBalance(bc));
          console.log('Sender -50 ending amount:', senderWallet.calculateBalance(bc));
          senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
          bc.addBlock(tp.transactions);
          tp.clear();
          console.log('Walet +100 amount:', wallet.calculateBalance(bc));
          console.log('Sender -100 ending amount:', senderWallet.calculateBalance(bc));
          expect(wallet.calculateBalance(bc)).toBe(790);
          expect(senderWallet.calculateBalance(bc)).toBe(210);
          done();
        });
      });
    });
  });
});
