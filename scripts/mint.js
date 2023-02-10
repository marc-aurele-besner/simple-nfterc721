// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const SimpleNft = await hre.ethers.getContractFactory('SimpleNft');

  const contractInstance = new hre.ethers.Contract('0x10C3e6FbdFBb43459B13B6957f77097EE5aC7931', SimpleNft.interface, deployer);

  const contractName = await contractInstance.name();
  const contractSymbol = await contractInstance.symbol();

  console.log(`Contract SimpleNft deployed to ${contractInstance.address}`);
  console.log(`Contract SimpleNft has Symbol: ${contractName} and Name: ${contractSymbol}`);

  const mintTx = await contractInstance.mint(1, { value: hre.ethers.utils.parseEther('0.05') });

  console.log('txHash: ', mintTx.hash);

  await mintTx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
