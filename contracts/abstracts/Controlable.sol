// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// TotalSupply: 1000
// Name: SimpleNft
// Symbol: SNFT
// PaymentType: ETH AND ERC20 USDC
// StartPrice: 0.5 ETH or equivalent in USDC
// How many WL: 100
// How many reserved: 50 (free())
// WL: 2 per address
// Public: 2 per address (WL can min public also)

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

abstract contract Controlable is Ownable {
  uint256 private _startTimestamp;
  uint256 private _startWhitelistTimestamp;
  string private _contractURI;
  string private _baseURI;

  /**
   * @dev Return contractURI
   */
  function contractURI() external view virtual returns (string memory) {
    return _contractURI;
  }

  /**
   * @dev Disable transferOwnership function
   */
  function transferOwnership(address newOwner) public override onlyOwner {
    // Disable this function
  }

  /**
   * @dev Return baseURI
   */
  function baseURI() public view virtual returns (string memory) {
    return _baseURI;
  }

  /**
   * @dev Verify if minting has started for whitelist
   */
  function isWhiteListStarted() public view virtual returns (bool) {
    return _startWhitelistTimestamp >= block.timestamp;
  }

  /**
   * @dev Verify if minting has started
   */
  function isStarted() public view virtual returns (bool) {
    return _startTimestamp >= block.timestamp;
  }

  /**
   * @dev Set Public and Whitelist start Minting block timestamp
   *  - Verify that the caller is the owner
   */
  function startMinting(uint256 timestamp_, uint256 timestampWL_) external virtual onlyOwner {
    require(timestamp_ >= block.timestamp, "Controlable: Public minting can't start in the past");
    require(timestamp_ > timestampWL_, "Controlable: Public minting can't start before whitelist minting");
    _startTimestamp = timestamp_;
    _startWhitelistTimestamp = timestamp_;
  }

  /**
   * @dev Allow to set contract URI - Internal function
   * @param newContractURI - IPFS pointing to the new contract URI file
   *  - Verify that the caller is the owner
   */
  function _setContractURI(string memory newContractURI) internal virtual {
    _contractURI = newContractURI;
  }

  /**
   * @dev Allow to set base URI - Internal function
   * @param newBaseURI - IPFS pointing to the new base URI file
   *  - Verify that the caller is the owner
   */
  function _setBaseURI(string memory newBaseURI) internal virtual {
    _baseURI = newBaseURI;
  }

  function _extensionURI() internal view virtual returns (string memory) {
    return '.json';
  }

  /**
   * @dev Allow to set contract URI
   * @param newContractURI - IPFS pointing to the new contract URI file
   *  - Verify that the caller is the owner
   */
  function setContractURI(string memory newContractURI) external virtual onlyOwner {
    _setContractURI(newContractURI);
  }

  /**
   * @dev Allow to set base URI
   * @param newBaseURI - IPFS pointing to the new base URI file
   *  - Verify that the caller is the owner
   */
  function setBaseURI(string memory newBaseURI) external virtual onlyOwner {
    _setBaseURI(newBaseURI);
  }

  /**
   * @dev Allow owner to withdraw any ether sent to this contract
   *  - Verify that the caller is the owner
   */
  function withdrawEther() external virtual onlyOwner returns (bool success) {
    (success, ) = payable(msg.sender).call{ value: address(this).balance }('');
  }

  /**
   * @dev Allow owner to withdraw any ERC20 Token sent to this contract
   *  - Verify that the caller is the owner
   */
  function withdrawERC20Token(address tokenAddres) external virtual onlyOwner returns (bool success) {
    IERC20 token = IERC20(tokenAddres);
    uint256 balance = token.balanceOf(address(this));
    require(token.transfer(msg.sender, balance), 'Controlable: Transfer failed');
    return true;
  }
}
