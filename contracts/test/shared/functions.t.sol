// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'foundry-test-utility/contracts/utils/console.sol';
import { CheatCodes } from 'foundry-test-utility/contracts/utils/cheatcodes.sol';

import { Constants } from './constants.t.sol';
import { Errors } from './errors.t.sol';
import { TestStorage } from './testStorage.t.sol';

import { SimpleNft } from '../../SimpleNft.sol';

contract Functions is Constants, Errors, TestStorage {
  SimpleNft public nftContract;

  enum TestType {
    Standard
  }

  function initialize_tests(uint8 LOG_LEVEL_, TestType testType_) public returns (SimpleNft) {
    // Set general test settings
    _LOG_LEVEL = LOG_LEVEL_;
    vm.roll(1);
    vm.warp(100);
    vm.startPrank(ADMIN);

    nftContract = new SimpleNft(NAME_ERC721, SYMBOL_ERC721, MAX_SUPPLY_ERC721);

    vm.stopPrank();
    vm.roll(block.timestamp + 1);
    vm.warp(block.number + 100);

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
    if (revertType_ == Errors.RevertStatus.Success) assertTrue(nftContract.isStarted());
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
}
