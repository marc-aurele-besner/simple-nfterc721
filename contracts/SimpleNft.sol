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

import "./abstracts/Controlable.sol";
import "./abstracts/Mintable.sol";
import "./abstracts/WListable.sol";

contract SimpleNft is Controlable, Mintable, WListable {
    
    constructor() {

    }
    
    modifier ownerOrMintStarted() {
        require(owner() == _msgSender() || mintStarted(), "Controlable: caller is not the owner or mint not started");
        _;
    }
        
    function mint(uint256 quantity) external ownerOrMintStarted {
        
    }

    function mintWhiteList(uint256 quantity) external {
        
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        
    }

    function _baseURI() internal view virtual returns (string memory) {
        
    }

    function _extensionURI() internal view virtual returns (string memory) {
        
    }

    function updateWhitelistRoot(bytes32 newRoot) external onlyOwner {
        
    }
}
