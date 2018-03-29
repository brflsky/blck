const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', () => {
  let bc;
  let bc2;

  beforeEach(() => {
    bc = new Blockchain();
    bc2 = new Blockchain();
  });

  it('1st element should be genesis block', () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  it('add a data to a chain', () => {
    const data = 'foo';
    bc.addBlock(data);
    expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
  });

  it('validate blockchain', () => {
    bc2.addBlock('foo');
    expect(bc.isValidChain(bc2.chain)).toBe(true);
  });

  it('invalide chain with corrupted genesis block', () => {
    bc2.chain[0].data = 'foo';
    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it('invalide chain with corrupted  block', () => {
    bc2.addBlock('foo');
    bc2.chain[1].data = 'foo fee';
    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it('Replaces the chain with a valid chain', () => {
    bc2.addBlock('foo');
    bc.replaceChain(bc2.chain);
    expect(bc.chain).toEqual(bc2.chain);
  });

  it('Does not replace chain wich is not longer then current one', () => {
    const oldChain = bc.chain;
    bc.replaceChain(bc2.chain);
    expect(bc.chain).toBe(oldChain);
  });
});
