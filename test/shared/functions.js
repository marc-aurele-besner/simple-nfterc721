const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { expect } = require('chai');

const constants = require('../../constants');
const methods = require('./methods');

const buildRoot = async (addresses = constants.ADDRESSES) => {
  const leaves = addresses.map((x) => keccak256(x));
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  const buf2hex = (x) => '0x' + x.toString('hex');

  const root = buf2hex(tree.getRoot());

  return { tree, root };
};

const returnBuildRoot = async (addresses = constants.ADDRESSES) => {
  const { root } = await buildRoot(addresses);
  return root;
};

const buildProof = async (address, addresses = constants.ADDRESSES) => {
  const leaves = addresses.map((x) => keccak256(x));
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  const buf2hex = (x) => '0x' + x.toString('hex');

  const leaf = keccak256(address);
  const proof = tree.getProof(leaf).map((data) => buf2hex(data.data));

  return { tree, proof };
};

const returnBuildProof = async (address, addresses = constants.ADDRESSES) => {
  const { proof } = await buildProof(address, addresses);
  return proof;
};

const sendRawTxn = async (input, sender, ethers, provider) => {
  const txCount = await provider.getTransactionCount(sender.address);
  const rawTx = {
    chainId: network.config.chainId,
    nonce: ethers.utils.hexlify(txCount),
    to: input.to,
    value: input.value || 0x00,
    gasLimit: ethers.utils.hexlify(3000000),
    gasPrice: ethers.utils.hexlify(25000000000),
    data: input.data
  };
  const rawTransactionHex = await sender.signTransaction(rawTx);
  const { hash } = await provider.sendTransaction(rawTransactionHex);
  return await provider.waitForTransaction(hash);
};

const checkRawTxnResult = async (input, sender, error) => {
  let result;
  if (error)
    if (network.name === 'hardhat') await expect(sendRawTxn(input, sender, ethers, ethers.provider)).to.be.revertedWith(error);
    else expect.fail('AssertionError: ' + error);
  else {
    result = await sendRawTxn(input, sender, ethers, ethers.provider);
    expect(result.status).to.equal(1);
  }
  return result;
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const returnCurrentTimestamp = async () => {
  const currentBlockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(currentBlockNumber);
  return block.timestamp;
};

const help_startMinting = async (contract, sender, startPublicTimestamp, startWhiteListTimestamp, error) => {
  const input = await contract.connect(sender).populateTransaction.startMinting(startPublicTimestamp, startWhiteListTimestamp);
  await checkRawTxnResult(input, sender, error);
};

const help_isWhitelistValid = async (contract, sender, allAddresses, isValid) => {
  const proofs = await returnBuildProof(sender.address, allAddresses);
  const isWhitelistValid = await contract.connect(sender).isWhitelistValid(proofs);
  expect(isWhitelistValid).to.be.equal(isValid);
};

const help_tokenURI = async (contract, sender, tokenId, error) => {
  const input = await contract.connect(sender).populateTransaction.tokenURI(tokenId);
  await checkRawTxnResult(input, sender, error);
};

const help_mint = async (contract, sender, quantity, value, error) => {
  const totalSupply = await contract.totalSupply();

  const input = await contract.connect(sender).populateTransaction.mint(quantity, {
    value
  });
  await checkRawTxnResult(input, sender, error);
  if (!error) {
    const finalTotalSupply = await contract.totalSupply();
    expect(ethers.BigNumber.from(totalSupply).add(quantity)).to.equal(ethers.BigNumber.from(finalTotalSupply));
    if (quantity === 1) {
      expect(await contract.ownerOf(totalSupply)).to.equal(sender.address);
    } else if (quantity === 2) {
      expect(await contract.ownerOf(totalSupply)).to.equal(sender.address);
      expect(await contract.ownerOf(totalSupply + 1)).to.equal(sender.address);
    }
  }
};

const help_mintWhiteList = async (contract, sender, quantity, proofs, value, error) => {
  const totalSupply = await contract.totalSupply();

  const input = await contract.connect(sender).populateTransaction.mintWhiteList(quantity, proofs, {
    value
  });
  await checkRawTxnResult(input, sender, error);

  if (!error) {
    const finalTotalSupply = await contract.totalSupply();
    expect(ethers.BigNumber.from(totalSupply).add(quantity)).to.equal(ethers.BigNumber.from(finalTotalSupply));
    if (quantity === 1) {
      expect(await contract.ownerOf(totalSupply)).to.equal(sender.address);
    } else if (quantity === 2) {
      expect(await contract.ownerOf(totalSupply)).to.equal(sender.address);
      expect(await contract.ownerOf(totalSupply + 1)).to.equal(sender.address);
    }
  }
};

const help_withdrawEther = async (contract, sender, error) => {
  const senderBalanceStart = await ethers.provider.getBalance(sender.address);
  console.log('senderBalanceStart', ethers.utils.formatEther(senderBalanceStart));

  const input = await contract.connect(sender).populateTransaction.withdrawEther();
  await checkRawTxnResult(input, sender, error);

  if (!error) {
    const senderBalanceAfter = await ethers.provider.getBalance(sender.address);
    console.log('ownerBalanceAfter', ethers.utils.formatEther(senderBalanceAfter));
    const contractBalanceAfter = await ethers.provider.getBalance(contract.address);
    const txGasCost = senderBalanceAfter.sub(senderBalanceStart).sub(ethers.utils.parseEther('0.5'));
    expect(contractBalanceAfter).to.equal(0);
    expect(ethers.utils.formatEther(senderBalanceStart)).to.equal(
      ethers.utils.formatEther(senderBalanceAfter.add(ethers.utils.parseEther('0.5')).add(txGasCost))
    );
  }
};

module.exports = {
  buildRoot,
  returnBuildRoot,
  buildProof,
  returnBuildProof,
  sendRawTxn,
  checkRawTxnResult,
  getRandomInt,
  returnCurrentTimestamp,
  help_startMinting,
  help_isWhitelistValid,
  help_tokenURI,
  help_mint,
  help_mintWhiteList,
  help_withdrawEther
};
