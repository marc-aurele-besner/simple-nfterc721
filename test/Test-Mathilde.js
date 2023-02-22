const { expect } = require('chai');
const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

const Helper = require('./shared');

describe('SimpleNft - Mathilde -1', function () {
  it('Deployment should assign the total supply of NFT to the owner', async function () {
    const [owner] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory('SimpleNft');

    const hardhatNFT = await NFT.deploy('SimpleNft', 'SNFT', 1000);

    const ownerBalance = await hardhatNFT.balanceOf(owner.address);
    expect(await hardhatNFT.totalSupply()).to.equal(ownerBalance);
  });
});

describe('SimpleNft - Mathilde-2', function () {
  //erreur: TypeError: hardhatToken.transfer is not a function
  //Using a different account than the owner
  it('Should transfer NFT between accounts', async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory('SimpleNft');

    const hardhatToken = await Token.deploy('SimpleNft', 'SNFT', 1000);

    await hardhatToken.mint(1, { value: ethers.utils.parseEther('0.5')});

    // Transfer 1 NFT from owner to addr1:
    await hardhatToken.transferFrom(owner.address, addr1.address, 1);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(1);

    // Transfer 1 NFT from addr1 to addr2:
    await hardhatToken.connect(addr1).transferFrom(addr1.address, addr2.address, 1);
    expect(await hardhatToken.balanceOf(addr2.address)).to.equal(1);
  });
});
//

// essai d'utilisation de loadFixture

describe('SimpleNft - Mathilde-3', function () {
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

    await hardhatNFT.mint(1, { value: ethers.utils.parseEther('0.5')});
    await hardhatNFT.transferFrom(owner.address, addr1.address, 0);
    
    // Transfer 1 NFT from owner to addr1
    await expect(await hardhatNFT.ownerOf(0)).to.be.equal(addr1.address);

    await hardhatNFT.transferFrom(addr1.address, addr2.address, 0);

    // Transfer 1 NFT from addr1 to addr2 (another account than the default one)
    await expect(await hardhatNFT.ownerOf(0)).to.be.equal(addr2.address);
  });
});

// test Controlable.sol avec URI:

describe('SimpleNft - Mathilde-4', function () {
  it('Does the function contractURI return the string _contractURI?', async function () {
    const NFT = await ethers.getContractFactory('SimpleNft');

    const hardhatNFT = await NFT.deploy('SimpleNft', 'SNFT', 1000);

    const contractURI = await hardhatNFT.contractURI();
    await expect(hardhatNFT._contractURI); // pas sûr de cette ligne
  });
});

//tester si fonction tokenURI retourne bien une string avec adresse tokenURI
//setContractURI x 2
//setBaseURI x2
//_extensionURI

describe('SimpleNft - Mathilde-5', function () {
  async function deployNFTFixture() {
    const NFT = await ethers.getContractFactory('SimpleNft');
    const [owner, addr1, addr2] = await ethers.getSigners();

    const hardhatNFT = await NFT.deploy('SimpleNft', 'SNFT', 1000);

    await hardhatNFT.deployed();

    return { NFT, hardhatNFT, owner, addr1, addr2 };
  }

  it('Does the function baseURI return the string _baseURI?', async function () {
    const { hardhatNFT } = await loadFixture(deployNFTFixture);

    const baseURI = await hardhatNFT.baseURI();
    await expect(hardhatNFT._baseURI); // pas sûr de la pertinence de ce test
  });
  //test si tokenId existe
  it('Does the function tokenURI return a string of a non-existant tokenId?', async function () {
    const { hardhatNFT } = await loadFixture(deployNFTFixture);

    const tokenURI = await hardhatNFT.tokenURI(3);
    await expect(hardhatNFT.tokenURI); //comment dire que l'on s'attend à une erreur?
  });
});
