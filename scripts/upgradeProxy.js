// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');

const constants = require('../constants');

async function main() {
  const [owner, address] = await hre.ethers.getSigners();
  const SimpleNft = await hre.ethers.getContractFactory('SimpleNftUpgradeable');

  const simpleNft = await upgrades.deployProxy(SimpleNft, [
    constants.TOKEN_NAME,
    constants.TOKEN_SYMBOL,
    constants.MAX_SUPPLY,
  ]);
  console.log('txHash: ', simpleNft.deployTransaction.hash);

  let contractInstance = await simpleNft.deployed();

  const contractName = await contractInstance.name();
  const contractSymbol = await contractInstance.symbol();

  console.log(`Contract SimpleNft deployed to ${contractInstance.address}`);
  console.log(`Contract SimpleNft has Symbol: ${contractName} and Name: ${contractSymbol}`);
  // console.log('Receipt: ', contractInstance.deployTransaction);

  // Before upgrage the contract
  try {
    const whoIsMasterOwner = await contractInstance.whoIsMasterOwner();
    console.log(`This should not happen`, whoIsMasterOwner);
  } catch (error) {
    console.log(`This should happen`);
  }

  // Upgrade the contract

  const SimpleNftV2 = await hre.ethers.getContractFactory('SimpleNftUpgradeableV2');
  contractInstance = await upgrades.upgradeProxy(contractInstance.address, SimpleNftV2);

  console.log(`Contract SimpleNft upgraded to ${contractInstance.address}`);

  await contractInstance.setMasterOwner('Bob');

  const whoIsMasterOwner = await contractInstance.whoIsMasterOwner();
  console.log(`whoIsMasterOwner`, whoIsMasterOwner);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
