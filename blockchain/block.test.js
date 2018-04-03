const Block = require('./block');

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
    expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
  });

  it('lowers difficulty for slowly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 3600000)).toEqual(block.difficulty - 1);
  });

  it('rises difficulty for slowly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);
  });
});
