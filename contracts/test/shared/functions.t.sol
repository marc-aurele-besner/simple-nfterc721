// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'foundry-test-utility/contracts/utils/console.sol';
import { CheatCodes } from 'foundry-test-utility/contracts/utils/cheatcodes.sol';

import { Constants } from './constants.t.sol';
import { Errors } from './errors.t.sol';
import { TestStorage } from './testStorage.t.sol';
import { TestData } from './testData.t.sol';

import { SimpleNft } from '../../SimpleNft.sol';

contract Functions is Constants, Errors, TestStorage, TestData {
  SimpleNft public nftContract;

  enum TestType {
    Standard
  }

  function initialize_tests(uint8 LOG_LEVEL_) public returns (SimpleNft) {
    // Set general test settings
    _LOG_LEVEL = LOG_LEVEL_;
    vm.roll(1);
    vm.warp(100);
    vm.startPrank(ADMIN);

    nftContract = new SimpleNft(NAME_ERC721, SYMBOL_ERC721, MAX_SUPPLY_ERC721);

    nftContract.updateWhitelistRoot(_ROOT_WHITELIST);

    vm.stopPrank();
    vm.roll(block.number + 1);
    vm.warp(block.timestamp + 100);

    return nftContract;
  }

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
  event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

  function verify_tokenTransfer(
    address from_,
    address to_,
    uint256 tokenId_,
    uint256 originalSenderBalance_,
    uint256 originalReceiverBalance_,
    Errors.RevertStatus revertType_
  ) internal {
    if (revertType_ == Errors.RevertStatus.Success) {
      assertEq(nftContract.balanceOf(from_), originalSenderBalance_ - 1);
      assertEq(nftContract.balanceOf(to_), originalReceiverBalance_ + 1);
      assertEq(nftContract.ownerOf(tokenId_), to_);
    }
  }

  // Controllable
  function help_startMinting(address prank_, uint256 timestamp_, uint256 timestampWL_, Errors.RevertStatus revertType_) internal {
    vm.prank(prank_);
    verify_revertCall(revertType_);
    nftContract.startMinting(timestamp_, timestampWL_);
    if (revertType_ == Errors.RevertStatus.Success && timestampWL_ <= block.timestamp) assertTrue(nftContract.isWhiteListStarted());
    if (revertType_ == Errors.RevertStatus.Success && timestamp_ <= block.timestamp) assertTrue(nftContract.isStarted());
  }

  function help_startMinting(address prank_, uint256 timestamp_, uint256 timestampWL_) internal {
    help_startMinting(prank_, timestamp_, timestampWL_, Errors.RevertStatus.Success);
  }

  function help_startMinting(uint256 timestamp_, uint256 timestampWL_) internal {
    help_startMinting(ADMIN, timestamp_, timestampWL_);
  }

  function help_startMinting() internal {
    help_startMinting(ADMIN, block.timestamp + 1000, block.timestamp);
  }

  function help_mintWhiteList(address sender, uint8 quantity, bytes32[] calldata proofs, uint256 value, Errors.RevertStatus revertType_) internal {
    uint256 totalSupply = nftContract.totalSupply();
    help_startMinting();
    vm.prank(sender);
    vm.deal(sender, value);
    verify_revertCall(revertType_);
    nftContract.mintWhiteList{ value: value }(quantity, proofs);

    uint256 finalTotalSupply = nftContract.totalSupply();
    if (revertType_ == Errors.RevertStatus.Success) {
      assertEq(finalTotalSupply, totalSupply + quantity);
      assertEq(nftContract.ownerOf(totalSupply), sender);
      assertEq(nftContract.ownerOf(totalSupply + 1), sender);
    }
  }

  function help_mintWhiteList(address sender, uint8 quantity, bytes32[] calldata proofs, uint256 value) internal {
    help_mintWhiteList(sender, quantity, proofs, value, Errors.RevertStatus.Success);
  }

  function help_withdrawEther(address sender, Errors.RevertStatus revertType_) internal {
    uint256 senderBalanceBefore = sender.balance;
    uint256 nftContractBalanceBefore = address(nftContract).balance;

    vm.prank(sender);
    verify_revertCall(revertType_);
    nftContract.withdrawEther();

    uint256 senderBalanceAfter = sender.balance;
    uint256 nftContractBalanceAfter = address(nftContract).balance;

    if (revertType_ == Errors.RevertStatus.Success) {
      assertTrue(nftContractBalanceAfter == 0);
      assertEq(senderBalanceAfter, senderBalanceBefore + nftContractBalanceBefore);
    }
  }

  function help_withdrawEther(address sender) internal {
    help_withdrawEther(sender, Errors.RevertStatus.Success);
  }
}
