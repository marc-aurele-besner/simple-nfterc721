// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const SimpleNft = await hre.ethers.getContractFactory('SimpleNft');

  const contractAddress = '0x80937baa2c51d4b906767700a0a47aff23e3cd35';
  const baseURI = 'ipfs://QmfLDXrccbeQRhLW2d78GCAdPJWDjvuvNDgw5TJruzoccg';

  console.log('contractAddress: ', contractAddress);

  const formattedAddress = hre.ethers.utils.getAddress(contractAddress);
  console.log('formattedAddress: ', formattedAddress);
  
  contractInstance = new hre.ethers.Contract(formattedAddress, SimpleNft.interface, owner)
  console.log('contract found at: ', contractInstance.address)

  console.log(`Contract SimpleNft deployed to ${contractInstance.address}`);

  const tx = await contractInstance.setBaseURI(baseURI)
  console.log('txHash: ', tx.hash)

  const receipt = await tx.wait()
  console.log('isMined: ', receipt.status)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
