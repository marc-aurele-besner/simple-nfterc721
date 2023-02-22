// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import './SimpleNft.sol';

contract SimpleNftFactory {

    event ContractCreated(address contractAddress);

    function deployNewContract(string memory name_, string memory symbol_, uint256 maxSupply_) external returns (address) {
        SimpleNft newContract = new SimpleNft(name_, symbol_, maxSupply_);

        newContract.transferOwnership(msg.sender);

        emit ContractCreated(address(newContract));

        return address(newContract);
    }

    

}