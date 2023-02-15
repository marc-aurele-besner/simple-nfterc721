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

abstract contract MintableUpgradeable is ERC721 {
  uint256 private maxSupply = 0;
  uint256 private mintCount = 0;

  mapping(address => uint8) private _WLminted;
  mapping(address => uint8) private _minted;

  event Mint(address indexed to, uint256 indexed quantity);

  constructor(string memory name_, string memory symbol_, uint256 _maxSupply) ERC721(name_, symbol_) {
    maxSupply = _maxSupply;
  }

  function totalSupply() external view returns (uint256) {
    return mintCount;
  }

  /**
   * @dev Main mint - Internal function
   * @param to - Address to mint the token for
   * @param quantity - number of tokens to mint
   *  - Verify that total supply is less than maxSupply
   *  - Mint the token
   */
  function _mint(address to, uint256 quantity) internal virtual override {
    require(mintCount < maxSupply, 'Mintable: max supply reached');
    for (uint256 i = 0; i < quantity; i++) {
      super._mint(to, mintCount);
      mintCount++;
    }
    emit Mint(to, quantity);
  }

  /**
   * @dev Public Mint - Internal function
   * @param to - Address to mint the token for
   *  - Call _mint(address,uint256) - Internal function with maxMint = 2
   */
  function _mintPublic(address to, uint8 quantity) internal virtual {
    require(_minted[to] + quantity <= 2, 'Mintable: maximum minted');
    _minted[to] += quantity;
    _mint(to, quantity);
  }

  /**
   * @dev Whitelist Mint - Internal function
   * @param to - Address to mint the token for
   *  - Call _mint(address,uint256) - Internal function with maxMint = 2
   */
  function _mintWhitelist(address to, uint8 quantity) internal virtual {
    require(_WLminted[to] + quantity <= 2, 'Mintable: maximum minted for Whitelist');
    _WLminted[to] += quantity;
    _mint(to, quantity);
  }
}
