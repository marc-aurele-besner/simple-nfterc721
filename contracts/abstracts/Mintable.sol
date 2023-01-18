// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

// TotalSupply: 1000
// Name: SimpleNft
// Symbol: SNFT
// PaymentType: ETH AND ERC20 USDC
// StartPrice: 0.5 ETH or equivalent in USDC
// How many WL: 100
// How many reserved: 50 (free())
// WL: 2 per address
// Public: 2 per address (WL can min public also)

abstract contract Mintable is ERC721 {
  uint256 internal maxSupply = 0;

  mapping(address => uint8) private _WLminted;
  mapping(address => uint8) private _minted;

  event Mint(address indexed to, uint256 indexed quantity);

  constructor(string memory name_, string memory symbol_, uint256 _maxSupply) ERC721(name_, symbol_) {
    maxSupply = _maxSupply;
  }

  /**
   * @dev Override _mint(address,uint256) function to use _mint(address,uint256,uin256) - Internal function
   * @param to - Address to mint the token for
   * @param tokenId - number of tokens to mint
   */
  function _mint(address to, uint256 tokenId) internal virtual override {
    _mint(to, 1, 2, false);
  }

  /**
   * @dev Main mint - Internal function
   * @param to - Address to mint the token for
   * @param quantity - number of tokens to mint
   * @param maxMint - maximum number of tokens that can be minted per user
   * @param isWL - true/false if the address is whitelisted
   *  - Verify that total supply is less than maxSupply
   *  - Verify that the address has not minted more than maxMint and the WhiteListMaxMint
   *  - Increment the address minted counter
   *  - Mint the token
   */
  function _mint(address to, uint256 quantity, uint256 maxMint, bool isWL) internal virtual {}

  /**
   * @dev Whitelist Mint - Internal function
   * @param to - Address to mint the token for
   *  - Call _mint(address,uint256,uint256) - Internal function with maxMint = 2
   */
  function _mintWhitelist(address to) internal virtual {}
}
