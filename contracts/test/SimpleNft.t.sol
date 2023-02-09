// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import 'foundry-test-utility/contracts/utils/console.sol';
import { Helper } from './shared/helper.t.sol';
import { Errors } from './shared/errors.t.sol';

contract SimpleNft_test is Helper {
  uint8 LOG_LEVEL = 0;

  function setUp() public {
    initialize_helper(LOG_LEVEL);
  }

  function test_SimpleNft_basic_name() public {
    assertEq(nftContract.name(), NAME_ERC721);
  }

  function test_SimpleNft_basic_symbol() public {
    assertEq(nftContract.symbol(), SYMBOL_ERC721);
  }

  function test_SimpleNft_basic_canWeStartMinting() public {
    help_startMinting();
    assertTrue(nftContract.isWhiteListStarted(), 'isWhiteListStarted');
    assertTrue(!nftContract.isStarted(), 'isStarted.1');
    vm.warp(block.timestamp + 1000);
    assertTrue(nftContract.isStarted(), 'isStarted.2');
  }

  function test_SimpleNft_basic_baseUri() public {
    assertEq(nftContract.baseURI(), '');
    vm.prank(ADMIN);
    nftContract.setBaseURI('test baseURI');
    assertEq(nftContract.baseURI(), 'test baseURI');
  }

  function test_SimpleNft_mint() public {
    vm.prank(ADMIN);
    vm.deal(ADMIN, 0.5 ether);
    nftContract.mint{ value: 0.5 ether }(1);

    assertEq(nftContract.ownerOf(0), ADMIN);
  }

  function test_SimpleNft_mint_2Tokens() public {
    vm.prank(ADMIN);
    vm.deal(ADMIN, 1 ether);
    nftContract.mint{ value: 1 ether }(2);

    assertEq(nftContract.ownerOf(0), ADMIN);
    assertEq(nftContract.ownerOf(1), ADMIN);
  }

  function test_SimpleNft_mint_2Tokens_for_price_of_one() public {
    vm.prank(ADMIN);
    vm.deal(ADMIN, 0.5 ether);
    verify_revertCall(Errors.RevertStatus.SimpleNftTransactionValueBelowMintPrice);
    nftContract.mint{ value: 0.5 ether }(2);
  }

  function test_SimpleNft_mintWhitelist_2Tokens() public {
    // help_mintWhiteList(address(user11), uint8(2), _ADDRESS11_WL_PROOFS, uint256(1 ether), Errors.RevertStatus.Success);

    uint256 totalSupply = nftContract.totalSupply();
    help_startMinting();
    vm.prank(user11);
    vm.deal(user11, 1 ether);
    nftContract.mintWhiteList{ value: 1 ether }(2, _ADDRESS11_WL_PROOFS);

    uint256 finalTotalSupply = nftContract.totalSupply();
    assertEq(finalTotalSupply, totalSupply + 2);
    assertEq(nftContract.ownerOf(totalSupply), user11);
    assertEq(nftContract.ownerOf(totalSupply + 1), user11);
  }

  function test_SimpleNft_withdrawEther() public {
    vm.prank(ADMIN);
    vm.deal(ADMIN, 0.5 ether);
    nftContract.mint{ value: 0.5 ether }(1);

    assertEq(nftContract.ownerOf(0), ADMIN);

    help_withdrawEther(ADMIN);
  }

  function test_SimpleNft_withdrawEther_after_2whitelistMint() public {
    uint256 totalSupply = nftContract.totalSupply();
    help_startMinting();
    vm.prank(user11);
    vm.deal(user11, 1 ether);
    nftContract.mintWhiteList{ value: 1 ether }(2, _ADDRESS11_WL_PROOFS);

    uint256 finalTotalSupply = nftContract.totalSupply();
    assertEq(finalTotalSupply, totalSupply + 2);
    assertEq(nftContract.ownerOf(totalSupply), user11);
    assertEq(nftContract.ownerOf(totalSupply + 1), user11);

    help_withdrawEther(ADMIN);
  }

  function test_SimpleNft_withdrawEther_by_anyone() public {
    uint256 totalSupply = nftContract.totalSupply();
    help_startMinting();
    vm.prank(user11);
    vm.deal(user11, 1 ether);
    nftContract.mintWhiteList{ value: 1 ether }(2, _ADDRESS11_WL_PROOFS);

    uint256 finalTotalSupply = nftContract.totalSupply();
    assertEq(finalTotalSupply, totalSupply + 2);
    assertEq(nftContract.ownerOf(totalSupply), user11);
    assertEq(nftContract.ownerOf(totalSupply + 1), user11);

    help_withdrawEther(user11, RevertStatus.OwnableCallerNotOwner);
  }
}
