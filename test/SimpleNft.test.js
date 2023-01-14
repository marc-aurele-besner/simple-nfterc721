const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const Helper = require('./shared');

describe("Simple NFT", function () {
  before(async function () {
      [provider, owner, user1, user2, user3] = await Helper.setupProviderAndAccount();
  });

  beforeEach(async function () {
      contract = await Helper.setupContract();
  });

  it('Does contract owner can start minting? (should be)', async function () {
    // Add test logic here
  });

  it('Does anyone can start minting? (should not)', async function () {
    // Add test logic here
  });

  it('Does contract owner can update contract uri? (should be)', async function () {
    // Add test logic here
  });

  it('Does anyone can update contract uri? (should not)', async function () {
    // Add test logic here
  });

  it('Does contract owner can update base uri? (should be)', async function () {
    // Add test logic here
  });

  it('Does anyone can update base uri? (should not)', async function () {
    // Add test logic here
  });

  it('Does contract owner can update contract uri and base uri? (should be)', async function () {
    // Add test logic here
  });

  it('Does anyone can update contract uri and base uri? (should not)', async function () {
    // Add test logic here
  });

  it('Does contract owner can withdraw ether from contract? (should be)', async function () {
    // Add test logic here
  });

  it('Does contract owner can withdraw ether from contract, after 1 first regular mint? (should be)', async function () {
    // Add test logic here
  });

  it('Does anyone can withdraw ether from contract? (should not)', async function () {
    // Add test logic here
  });
});
