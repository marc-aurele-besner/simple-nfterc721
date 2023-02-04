// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

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

  function test_SimpleNft_basic_contractUri() public {
    assertEq(nftContract.contractURI(), '');
    vm.prank(ADMIN);
    nftContract.setContractURI('test contractURI');
    assertEq(nftContract.contractURI(), 'test contractURI');
  }

  function test_SimpleNft_any_contractUri() public {
    assertEq(nftContract.contractURI(), '');
    vm.prank(address(2));
    vm.expectRevert('Caller is not the owner');
    nftContract.setContractURI('test contractURI');
    assertEq(nftContract.contractURI(), 'test contractURI');
  }
}
