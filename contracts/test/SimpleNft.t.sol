// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { Helper } from './shared/helper.t.sol';

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
}
