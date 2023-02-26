// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/utils/Context.sol';
import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';

abstract contract WListable is Context {
  bytes32 private root;

  /**
   * @dev Verify proofs against root for caller
   * @param proofs - Array of bytes32 hashes proofs
   * @return bool - True if proofs are valid
   */
  function isWhitelistValid(bytes32[] calldata proofs) external view virtual returns (bool) {
    return _isWhitelistValid(proofs);
  }

  /**
   * @dev Verify proofs against root for caller - Internal function
   * @param proofs - Array of bytes32 hashes proofs
   * @return bool - True if proofs are valid
   */
  function _isWhitelistValid(bytes32[] calldata proofs) internal view virtual returns (bool) {
    return MerkleProof.verifyCalldata(proofs, root, keccak256(abi.encodePacked(msg.sender)));
  }

  /**
   * @dev Update Whitelist Root - Internal function
   * @param _root - New root
   */
  function _updateWhitelistRoot(bytes32 _root) internal virtual {
    root = _root;
  }
}
