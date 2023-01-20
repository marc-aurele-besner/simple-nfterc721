// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/utils/Strings.sol';

// TotalSupply: 1000
// Name: SimpleNft
// Symbol: SNFT
// PaymentType: ETH AND ERC20 USDC
// StartPrice: 0.5 ETH or equivalent in USDC
// How many WL: 100
// How many reserved: 50 (free())
// WL: 2 per address
// Public: 2 per address (WL can min public also)

import './abstracts/Controlable.sol';
import './abstracts/Mintable.sol';
import './abstracts/WListable.sol';

contract SimpleNft is Controlable, WListable, Mintable {
  using Strings for uint256;

  constructor(string memory name_, string memory symbol_, uint256 maxSupply_) Mintable(name_, symbol_, maxSupply_) {}

  modifier ownerOrMintStarted() {
    require(owner() == _msgSender() || isStarted(), 'SimpleNft: caller is not the owner or mint not started');
    _;
  }

  modifier witeListMintStarted() {
    require(isWhiteListStarted(), 'SimpleNft: whiteList mint not started');
    _;
  }

  function mint(uint8 quantity) external ownerOrMintStarted {
    (bool success, ) = payable(address(this)).call{ value: 0.5 ether }('');
    require(success, 'SimpleNft: ETH transfer failed');
    _mintPublic(_msgSender(), quantity);
  }

  function mintWhiteList(uint8 quantity, bytes32[] calldata proofs) external witeListMintStarted {
    require(_isWhitelistValid(proofs), 'SimpleNft: invalid proof');
    (bool success, ) = payable(address(this)).call{ value: 0.5 ether }('');
    require(success, 'SimpleNft: ETH transfer failed');
    _mintWhitelist(_msgSender(), quantity);
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), 'SimpleNft: URI query for nonexistent token');
    string memory baseURI_ = baseURI();
    return bytes(baseURI_).length != 0 ? string(abi.encodePacked(baseURI_, tokenId, _extensionURI())) : '';
  }

  function updateWhitelistRoot(bytes32 newRoot) external onlyOwner {}
}
