const { time, loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');

const Helper = require('./shared');
let contract;

describe('Simple NFT', function () {
  before(async function () {
    [provider, owner, user1, user2, user3] = await Helper.setupProviderAndAccount();
  });

  beforeEach(async function () {
    contract = await Helper.setupContract([user1.address, user2.address]);
  });

  it('Does contract owner can start minting? (should be)', async function () {
    const currentTimestamp = await Helper.returnCurrentTimestamp();
    await Helper.help_startMinting(contract, owner, currentTimestamp + 86400, currentTimestamp);
    expect(await contract.isStarted()).to.be.equal(false);
    expect(await contract.isWhiteListStarted()).to.be.equal(true);
  });

  it('Does anyone can start minting? (should not)', async function () {
    const currentTimestamp = await Helper.returnCurrentTimestamp();
    await Helper.help_startMinting(contract, user1, currentTimestamp + 86400, currentTimestamp, Helper.errors.CALLER_NOT_OWNER);
    expect(await contract.isStarted()).to.be.equal(false);
    expect(await contract.isWhiteListStarted()).to.be.equal(false);
  });

  it('Does the user1 address of the WhiteList can mint a NFT? (it should)', async function () {
    const currentTimestamp = await Helper.returnCurrentTimestamp();
    await Helper.help_startMinting(contract, owner, currentTimestamp + 86400, currentTimestamp);
    await Helper.help_isWhitelistValid(contract, user1, [...Helper.WhiteList, user1.address, user2.address], true);
  });

  it('Does the user3 address of the WhiteList can mint a NFT? (should not)', async function () {
    const currentTimestamp = await Helper.returnCurrentTimestamp();
    await Helper.help_startMinting(contract, user3, currentTimestamp + 86400, currentTimestamp, Helper.errors.CALLER_NOT_OWNER);
    await Helper.help_isWhitelistValid(contract, user3, [...Helper.WhiteList, user1.address, user2.address], false);
  });

  it('Does the user3 address of the WhiteList can mint a NFT even if he had himself to the proofs? (should not)', async function () {
    const currentTimestamp = await Helper.returnCurrentTimestamp();
    await Helper.help_startMinting(contract, user3, currentTimestamp + 86400, currentTimestamp, Helper.errors.CALLER_NOT_OWNER);
    await Helper.help_isWhitelistValid(contract, user3, [...Helper.WhiteList, user1.address, user2.address, user3.address], false);
  });

  // it('Does the contract name match the name use at deployment ?', async function () {
  //   // Add test logic here
  // });

  // it('Does the contract symbol match the symbol use at deployment ?', async function () {
  //   // Add test logic here
  // });

  // it('Does contract owner can update contract uri? (should be)', async function () {
  //   // Add test logic here
  // });

  // it('Does anyone can update contract uri? (should not)', async function () {
  //   // Add test logic here
  // });

  // it('Does contract owner can update base uri? (should be)', async function () {
  //   // Add test logic here
  // });

  // it('Does anyone can update base uri? (should not)', async function () {
  //   // Add test logic here
  // });

  // it('Does contract owner can update contract uri and base uri? (should be)', async function () {
  //   // Add test logic here
  // });

  // it('Does anyone can update contract uri and base uri? (should not)', async function () {
  //   // Add test logic here
  // });

  // it('Does contract owner can withdraw ether from contract? (should be)', async function () {
  //   // Add test logic here
  // });

  // it('Does contract owner can withdraw ether from contract, after 1 first regular mint? (should be)', async function () {
  //   // Add test logic here
  // });

  // it('Does anyone can withdraw ether from contract? (should not)', async function () {
  //   // Add test logic here
  // });
});
