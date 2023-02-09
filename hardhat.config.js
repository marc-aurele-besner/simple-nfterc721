require('dotenv').config({ path: __dirname + '/.env.development' });
require('@nomicfoundation/hardhat-toolbox');
require('hardhat-awesome-cli');
require('transaction-retry-tool');

const { RPC_MAINNET, RPC_GOERLI, PRIVATE_KEY_MAINNET, PRIVATE_KEY_GOERLI, ETHERSCAN_API_KEY } = process.env;
let { DUMMY_PRIVATE_KEY } = process.env;

// if (!DUMMY_PRIVATE_KEY) throw new Error('Please set your DUMMY_PRIVATE_KEY in a .env.development file');
if (!DUMMY_PRIVATE_KEY) DUMMY_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {},
    mainnet: {
      url: `${RPC_MAINNET}`,
      chainId: 1,
      gas: 15000000,
      gasPrice: 2000000000,
      accounts: [`${PRIVATE_KEY_MAINNET || DUMMY_PRIVATE_KEY}`]
    },
    goerli: {
      url: `${RPC_GOERLI}`,
      chainId: 5,
      gas: 15000000,
      gasPrice: 2000000000,
      accounts: [`${PRIVATE_KEY_GOERLI || DUMMY_PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: {
      mainnet: `${ETHERSCAN_API_KEY}`,
      goerli: `${ETHERSCAN_API_KEY}`
    }
  },
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  mocha: {
    timeout: 200000
  }
};
