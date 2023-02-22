const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

const constants = require('../constants');

async function main() {

  const currentFolder = path.resolve(__dirname, '../metaData/');
  const metadata = 'ipfs://QmU2mMrTKC1necWxKZYSHgdbzZWyBk9Cbh8gD3RrwQYmQ5'

  console.log('currentFolder', currentFolder)
  if (fs.existsSync(currentFolder)) {
      for (let i = 0; i < constants.MAX_SUPPLY; i++) {

        const data = {
          name: `${constants.TOKEN_NAME} #${i}`,
          description: `${constants.TOKEN_NAME} Collection 1`,
          image: `${metadata}/${i}.jpg`,
          edition: i,
          date: Date.now(),
          attributes: [
            {
              trait_type: "TokenId",
              value: i
            }
          ]
        }

        console.log('\x1b[32m', `Building MetaData's for tokenId ${i}`, '\x1b[0m')

        fs.writeFileSync(currentFolder + `/metadata/${i}.json`, JSON.stringify(data, null, 2));
      }
  } else throw new Error('Folder metaData/ and metaData/metadata does not exist');

  console.log('\x1b[32m', "Done building ABI's", '\x1b[0m');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
