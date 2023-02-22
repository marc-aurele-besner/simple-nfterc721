const { time, loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');

const Helper = require('./shared');
const { ethers } = require('hardhat');
let contract;

describe('Simple NFT - Enzo', function () {
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

    // const input = await contract.connect(user1).populateTransaction.setBaseURI('test base uri');
    // await Helper.checkRawTxnResult(input, user1);
    await contract.setBaseURI('test base uri');

    const baseURI_finale = await contract.baseURI();
  });

  it('Does a user has a isApprovedForAll ?', async function () {
    const isApprovedForAll = await contract.isApprovedForAll(owner.address, user1.address);

    await contract.setApprovalForAll(user1.address, true);

    const isApprovedForAll_final = await contract.isApprovedForAll(owner.address, user1.address);
  });

  it('Does a user has a getApproved ?', async function () {
    await contract.mint(1, {
      value: ethers.utils.parseEther('0.5')
    });

    const getApproved = await contract.getApproved(0);

    await contract.approve(user1.address, 0);

    const approve = await contract.getApproved(0);
  });

  it('Does tokenURI return a value on non-existent token', async function () {
    await Helper.help_tokenURI(contract, owner, 0, Helper.errors.INVALID_TOKENURI);
  });

  it('Does tokenURI return a tokenURI after minting the 1st token', async function () {
    await Helper.help_tokenURI(contract, owner, 0, Helper.errors.INVALID_TOKENURI);

    await Helper.help_mint(contract, owner, 1, ethers.utils.parseEther('0.5'));

    await Helper.help_tokenURI(contract, owner, 0);
  });

  it('Can we mint 0 token', async function () {
    await Helper.help_mint(contract, owner, 0, ethers.utils.parseEther('0.5'), Helper.errors.QUANTITY_MUST_NOT_BE_ZERO);
  });

  it('Can we mint 1 token', async function () {
    await Helper.help_mint(contract, owner, 1, ethers.utils.parseEther('0.5'));
  });

  it('Can we mint 2 token for the price of 1', async function () {
    await Helper.help_mint(contract, owner, 2, ethers.utils.parseEther('0.5'), Helper.errors.TRANSACTION_VALUE_BELOW_MINT_PRICE);
  });

  it('Can we mint 2 token for the price of 2', async function () {
    await Helper.help_mint(contract, owner, 2, ethers.utils.parseEther('1'));
  });

  it('Can we mint 2 token for the price of 2 (from user1) before mint started', async function () {
    await Helper.help_mint(contract, user1, 2, ethers.utils.parseEther('1'), Helper.errors.CALLER_NOT_OWNER_OR_MINT_NOT_STARTED);
  });

  it('Can we mint 3 token', async function () {
    await Helper.help_mint(contract, owner, 3, ethers.utils.parseEther('1.5'), Helper.errors.MAXIMUM_QTY_MINTED);
  });

  it('Can we mint 1 token from the whitelist', async function () {
    const currentTimestamp = await Helper.returnCurrentTimestamp();
    await Helper.help_startMinting(contract, owner, currentTimestamp + 100, currentTimestamp);

    const proofs = await Helper.returnBuildProof(user1.address, [...Helper.WhiteList, user1.address, user2.address]);

    const isWhitelistValid = await contract.connect(user1).isWhitelistValid(proofs);

    await Helper.help_mintWhiteList(contract, user1, 1, proofs, ethers.utils.parseEther('0.5'));

    expect(await contract.ownerOf(0)).to.equal(user1.address);
  });

  it('Does contract owner can update base uri? (should be)', async function () {
    expect(await contract.baseURI()).to.equal('');

    await contract.setBaseURI('Test New BaseURI');

    expect(await contract.baseURI()).to.equal('Test New BaseURI');
  });

  it('Does anyone can update contract uri? (should not)', async function () {
    expect(await contract.contractURI()).to.equal('');

    const input = await contract.connect(user2).populateTransaction.setContractURI('Test New ContractURI');

    Helper.checkRawTxnResult(input, user2, 'Ownable: caller is not the owner')

    expect(await contract.contractURI()).to.equal('');
  });

  it('Does anyone can update base uri? (should not)', async function () {
    expect(await contract.baseURI()).to.equal('');

    await contract.connect(user2).setBaseURI('Test New BaseURI');

    expect(await contract.baseURI()).to.equal('Test New BaseURI');
  });

  it('Does contract owner can update contract uri? (should be)', async function () {
    expect(await contract.contractURI()).to.equal('');

    await contract.setContractURI('Test New ContractURI');

    expect(await contract.contractURI()).to.equal('Test New ContractURI');
  });

  it('Does contract owner can update contract uri and base uri? (should be)', async function () {
    expect(await contract.contractURI()).to.equal('');
    expect(await contract.baseURI()).to.equal('');

    await contract.setContractURI('Test');
    await contract.setBaseURI('Test');

    expect(await contract.contractURI()).to.equal('Test');
    expect(await contract.baseURI()).to.equal('Test');
  });

  it('Does anyone can update contract uri and base uri? (should not)', async function () {
    expect(await contract.contractURI()).to.equal('');
    expect(await contract.baseURI()).to.equal('');

    await contract.connect(user2).setContractURI('Test');
    await contract.connect(user2).setBaseURI('Test');

    expect(await contract.contractURI()).to.equal('Test');
    expect(await contract.baseURI()).to.equal('Test');
  });

  it('Does contract owner can withdraw ether from contract? (should be)', async function () {
    let balance = await provider.getBalance(owner.address);
    console.log('balance : ', balance);

    await Helper.help_mint(contract, owner, 1, ethers.utils.parseEther('0.5'));

    expect(await contract.totalSupply()).to.equal('1');

    let balance_mid = await provider.getBalance(owner.address);
    console.log('balance : ', balance_mid);

    await contract.withdrawEther();

    let balance_final = await provider.getBalance(owner.address);
    console.log('balance : ', balance_final);
  });

  it('Does anyone can withdraw ether from contract? (should not)', async function () {
    await Helper.help_mint(contract, owner, 1, ethers.utils.parseEther('0.5'));

    expect(await contract.totalSupply()).to.equal('1');

    let balance = await provider.getBalance(user2.address);
    expect(ethers.utils.formatEther(await balance.toString())).to.equal('10000.0');

    await contract.connect(user2).withdrawEther();

    let balance_final = await provider.getBalance(user2.address);
    expect(ethers.utils.formatEther(await balance_final.toString())).to.equal(balance);
  });
});
