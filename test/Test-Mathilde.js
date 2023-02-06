const { expect } = require('chai');
const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe('SimpleNft', function () {
  it('Deployment should assign the total supply of NFT to the owner', async function () {
    const [owner] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory('SimpleNft');

    const hardhatNFT = await NFT.deploy('SimpleNft', 'SNFT', 1000);

    const ownerBalance = await hardhatNFT.balanceOf(owner.address);
    expect(await hardhatNFT.totalSupply()).to.equal(ownerBalance);
  });
});

//erreur: TypeError: hardhatToken.transfer is not a function
//Using a different account than the owner
it('Should transfer NFT between accounts', async function () {
  const [owner, addr1, addr2] = await ethers.getSigners();

  const Token = await ethers.getContractFactory('SimpleNft');

  const hardhatToken = await Token.deploy('SimpleNft', 'SNFT', 1000);

  // Transfer 1 NFT from owner to addr1:
  await hardhatToken.transfer(addr1.address, 1);
  expect(await hardhatToken.balanceOf(addr1.address)).to.equal(1);

  // Transfer 1 NFT from addr1 to addr2:
  await hardhatToken.connect(addr1).transfer(addr2.address, 1);
  expect(await hardhatToken.balanceOf(addr2.address)).to.equal(1);
});

//

// essai d'utilisation de loadFixture

describe('SimpleNft', function () {
  async function deployNFTFixture() {
    const NFT = await ethers.getContractFactory('SimpleNft');
    const [owner, addr1, addr2] = await ethers.getSigners();

    const hardhatNFT = await NFT.deploy('SimpleNft', 'SNFT', 1000);

    await hardhatNFT.deployed();

    return { NFT, hardhatNFT, owner, addr1, addr2 };
  }

  it('Deployment should assign the total supply of NFT to the owner', async function () {
    const { hardhatNFT, owner } = await loadFixture(deployNFTFixture);

    const ownerBalance = await hardhatNFT.balanceOf(owner.address);
    expect(await hardhatNFT.totalSupply()).to.equal(ownerBalance);
  });
  // erreur: TypeError: hardhatNFT.transfer is not a function
  it('Should transfer NFT between accounts', async function () {
    const { hardhatNFT, owner, addr1, addr2 } = await loadFixture(deployNFTFixture);

    // Transfer 1 NFT from owner to addr1
    await expect(hardhatNFT.transfer(addr1.address, 1)).to.changeNFTBalances(hardhatNFT, [owner, addr1], [-1, 1]);

    // Transfer 1 NFT from addr1 to addr2 (another account than the default one)
    await expect(hardhatNFT.connect(addr1).transfer(addr2.address, 1)).to.changeNFTBalances(hardhatNFT, [addr1, addr2], [-1, 1]);
  });
});

// test Controlable.sol:

describe('SimpleNft', function () {
  it('Does the function contractURI return the string _contractURI?', async function () {
    const NFT = await ethers.getContractFactory('SimpleNft');

    const hardhatNFT = await NFT.deploy('SimpleNft', 'SNFT', 1000);

    const contractURI = await hardhatNFT.contractURI();
    await expect(hardhatNFT._contractURI); // pas sur de cette ligne
  });
});

//tester si tokenid existe
//tester si fonction tokenURI retourne bien une string avec adresse de type IPFS
