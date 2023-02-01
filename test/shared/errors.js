module.exports = {
  MERKLE_PROOF_INVALID: 'MerkleProof: invalid multiproof',

  CALLER_NOT_OWNER: 'Ownable: caller is not the owner',
  NEW_OWNER_IS_ZERO: 'Ownable: new owner is the zero address',

  INVALID_TOKENURI: 'SimpleNft: URI query for nonexistent token',
  QUANTITY_MUST_NOT_BE_ZERO: 'SimpleNft: quantity must be greater than 0',
  TRANSACTION_VALUE_BELOW_MINT_PRICE: 'SimpleNft: Transaction value below mint price',
  MAXIMUM_QTY_MINTED: 'Mintable: maximum minted',
  CALLER_NOT_OWNER_OR_MINT_NOT_STARTED: 'SimpleNft: caller is not the owner or mint not started',

  PANIC_CODE_0x11:
    'VM Exception while processing transaction: reverted with panic code 0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)'
};
