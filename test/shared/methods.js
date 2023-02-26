module.exports = {
  // Controllable
  CONTRACT_URI: 'contractURI()',
  SET_CONTRACT_URI: 'setContractURI(string)',
  BASE_URI: 'baseURI()',
  SET_BASE_URI: 'setBaseURI(string)',
  IS_STARTED: 'isStarted()',
  START_MINTING: 'startMinting()',
  WITHDRAW_ETHER: 'withdrawEther()',

  // Mintable
  MINT_WHITELIST: 'mintWhitelist(bytes32[])',
  MINT: 'mint(uint256)',

  TOKEN_URI: 'tokenURI(uint256)',
  UPDATE_WHITELIS_ROOT: 'updateWhitelistRoot(bytes32)',

  // Whitelistable
  IS_WHITELIS_VALID: 'isWhitelistValid(bytes32[])',

  // 721
  OWNER_OF: 'ownerOf(uint256)',
  BALANCE_OF: 'balanceOf(address)',
  TOKEN_OF_OWNER_BY_INDEX: 'tokenOfOwnerByIndex(address,uint256)',
  TOKEN_BY_INDEX: 'tokenByIndex(uint256)'
};
