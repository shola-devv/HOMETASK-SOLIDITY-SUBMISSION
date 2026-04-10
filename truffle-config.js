/**
 * NOTE FOR ASSESSOR
 * -----------------
 * gasPrice (20 gwei) was added to fix a Ganache v7+ / WSL compatibility
 * issue. Ganache v7 defaults to the Shanghai EVM hardfork which enforces
 * EIP-1559: transactions must have maxFeePerGas >= baseFeePerGas (7 wei).
 * Truffle's default of 1 wei causes all deployments to revert in this env.
 *
 * To run all tests without facing the above error, use: npm test
 * To run candidate tests: npx truffle test test/CandidateDynamicHouseEdgeTests.js
 * 
 * If running npx truffle test directly, first start Ganache manually:
 *   npx ganache --hardfork istanbul --port 8545
 */

module.exports = {
  networks: {
    development: {
      host:       "127.0.0.1",
      port:       8545,
      network_id: "*",
      gasPrice:   20000000000
    }
  },
  mocha: {
    timeout: 20000000
  },
  compilers: {
    solc: {
      version: "0.5.10"
    }
  }
}