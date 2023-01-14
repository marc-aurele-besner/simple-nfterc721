const hre = require('hardhat');
const fs = require('fs');
const constants = require('../constants');
const functions = require('../test/shared/functions');

const foundryTestDataFileName = 'testData';
const foundryTestFolderPath = './contracts/test/shared';
const foundryTestFileExtension = 't.sol';
const foundryTestDataFilePath = `${foundryTestFolderPath}/${foundryTestDataFileName}.${foundryTestFileExtension}`;

async function main() {
    console.log(
        '\x1b[36m%s\x1b[0m',
        constants.FIGLET_NAME,
        '\x1b[33m',
        'Building ' + foundryTestDataFileName + '.' + foundryTestFileExtension + '...',
        '\x1b[0m'
    );

    const addressesWhiteList = [];
    for (let i = 11; i <= 20; i++) {
        addressesWL.push(`0x00000000000000000000000000000000000000${i}`);
    }

    const rootWhiteList = await functions.returnBuildRoot(addressesWhiteList);

    const proofsWhiteList = [];

    let solidityProofsWhiteList = '';

    let solidityTestUsersWhiteList = '';

    console.log('rootWhiteLis', rootWhiteList);

    for (let i = 11; i <= 20; i++) {
        const proofs = await functions.returnBuildProof(`0x00000000000000000000000000000000000000${i}`, addressesWhiteList);
        proofsWhiteList.push(proofs);
        solidityTestUsersWhiteList += `  address user${i} = 0x00000000000000000000000000000000000000${i};\n`;
        solidityProofsWhiteList += `    // Proofs for WL user ${i}\n`;
        for (let j = 0; j < proofs.length; j++) {
            solidityProofs_WL += `    _ADDRESS${i}_WL_PROOFS.push(bytes32(${proofs[j]}));\n`;
        }
    }
    for (let i = 0; i < functions.getRandomInt(1, 10); i++) {
        proofsWhiteList.push(`0x1100000000000000000000000000000000000000${i}`);
    }

    fs.writeFileSync(
        foundryTestDataFilePath,
        `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestData {
  // Data use for the tests.
  bytes32 public constant _ROOT_WHITELIST = bytes32(${rootWL});

  // Test Users - WHITELIST
${solidityTestUsersWhiteList}
  // Proofs for WHITELIST users
  bytes32[] public _ADDRESS11_WL_PROOFS;
  bytes32[] public _ADDRESS12_WL_PROOFS;
  bytes32[] public _ADDRESS13_WL_PROOFS;
  bytes32[] public _ADDRESS14_WL_PROOFS;
  bytes32[] public _ADDRESS15_WL_PROOFS;
  bytes32[] public _ADDRESS16_WL_PROOFS;
  bytes32[] public _ADDRESS17_WL_PROOFS;
  bytes32[] public _ADDRESS18_WL_PROOFS;
  bytes32[] public _ADDRESS19_WL_PROOFS;
  bytes32[] public _ADDRESS20_WL_PROOFS;

  constructor() {
${solidityProofsWhiteList} }
}`
    );

    console.log('\x1b[32m', `${foundryTestDataFileName}.${foundryTestFileExtension} file created in foundry ${foundryTestFolderPath} folder`);
    console.log('\x1b[0m', ` with ${addressesWhiteList.length} addresses in WhiteList`);
    console.log('\x1b[0m', ` with ${proofsWhiteList.length} proofs in WhiteList`);
    console.log('\x1b[0m', ` with WhiteList roots: ${rootWhiteList}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
