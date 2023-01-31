const { time, loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');

const Helper = require('./shared');
const { ethers } = require('hardhat');
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

  it('Does the contract return a baseURI ?', async function () {
    const baseURI = await contract.baseURI();
    console.log('baseURI', baseURI);

    // const input = await contract.connect(user1).populateTransaction.setBaseURI('test base uri');
    // await Helper.checkRawTxnResult(input, user1);
    await contract.setBaseURI('test base uri');

    const baseURI_finale = await contract.baseURI();
    console.log('baseURI_finale', baseURI_finale);
  });

  it('Does a user has a isApprovedForAll ?', async function () {
    const isApprovedForAll = await contract.isApprovedForAll(owner.address, user1.address);
    console.log('isApprovedForAll', isApprovedForAll);

    await contract.setApprovalForAll(user1.address, true);

    const isApprovedForAll_final = await contract.isApprovedForAll(owner.address, user1.address);
    console.log('isApprovedForAll_final', isApprovedForAll_final);
    // Add test logic here
  });

  it.only('Does a user has a getApproved ?', async function () {
    await contract.mint(1, {
      value: ethers.utils.parseEther('0.5')
    });

    const getApproved = await contract.getApproved(0);
    console.log('getApproved', getApproved);

    await contract.approve(user1.address, 0);

    const approve = await contract.getApproved(0);
    console.log('approve', approve);
    // Add test logic here
  });

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
