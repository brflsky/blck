const Block = require('./block');
const { DIFICULTY } = require('../config');

describe('Block', () => {
  let data;
  let lastBlock;
  let block;

  beforeEach(() => {
    data = 'bar';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  it('sets the `data` to match the input ', () => {
    expect(block.data).toEqual(data);
  });

  it('sets the `lastHash` to match hash of the last block', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });

  it('generate hash that matches dificulty', () => {
    expect(block.hash.substring(0, DIFICULTY)).toEqual('0'.repeat(DIFICULTY));
  });
});
