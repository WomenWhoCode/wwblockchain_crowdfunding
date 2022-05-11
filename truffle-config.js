const HDWalletProvider = require("@truffle/hdwallet-provider");
const metamask_seed_frase = `heavy jar cattle champion have smooth knock myself provide dynamic scene advance`;

module.exports = {
    networks: {
      development: {
        host: "localhost",
        port: 8545,
        network_id: "*" // Match any network id
      }, 
      rinkeby: {
        provider: () => new HDWalletProvider(metamask_seed_frase, `https://rinkeby.infura.io/v3/ec20aa6cd3ca4c91a9eb269ab8e9c6b2`),
        network_id: 4,       // rinkeby's id
        gas: 5500000,        // rinkeby has a lower block limit than mainnet
        gasPrice: 10000000000,
        confirmations: 2,    // # of confs to wait between deployments. (default: 0)
        timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
        skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
      }
    },
    compilers: {
      solc: {
        version: "^0.8.0"
      }
    },
};  