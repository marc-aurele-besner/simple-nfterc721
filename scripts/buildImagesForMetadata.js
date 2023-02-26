const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

const constants = require('../constants');

async function main() {
  const currentFolder = path.resolve(__dirname, '../metaData/');

  if (fs.existsSync(currentFolder) && fs.existsSync(currentFolder + '/sample')) {
    if (fs.existsSync(currentFolder + '/sample/0.jpg')) {
      for (let i = 0; i < constants.MAX_SUPPLY; i++) {
        console.log('\x1b[32m', `Building Image's for tokenId ${i}`, '\x1b[0m');

        fs.copyFileSync(currentFolder + '/sample/0.jpg', `${currentFolder}/images/${i}.jpg`);
      }
    } else throw new Error('Folder metaData/sample/0.jpg does not exist');
  } else throw new Error('Folder metaData/ and metaData/sample does not exist');

  console.log('\x1b[32m', "Done building ABI's", '\x1b[0m');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
