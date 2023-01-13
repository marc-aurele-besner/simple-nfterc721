// SPDX-License-Identifier: UNLICENSED
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

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract Controlable is Ownable {
    uint256 _startBlock;
    uint256 _startWhitelistBlock;
    uint256 _contractURI;
    

    function transferOwnership(address newOwner) public override onlyOwner {
        // Disable this function
    }

}
