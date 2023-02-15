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

import './SimpleNftUpgradeable.sol';

contract SimpleNftUpgradeableV2 is SimpleNftUpgradeable {
  string private _masterOwner;

  function setMasterOwner(string memory masterOwner_) public onlyOwner {
    _masterOwner = masterOwner_;
  }

  function whoIsMasterOwner() public view returns (string memory) {
    return _masterOwner;
  }
}
