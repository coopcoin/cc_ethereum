const ethers = require('ethers');
const ABIS = {
  AssetToken: require('./abis/AssetToken.json')
};
const ADDRESSES = {
  AssetToken: require('./addresses/AssetToken.json')
};

class CoopCoin {

  constructor(provider, signer, options = {}) {
    let { addresses, abis } = options;

    this.provider = provider;
    this.signer = signer;
    this.addresses = options.addresses || ADDRESSES;
    this.abis = options.abis || ABIS;
    this.contracts = {};
  }

  get AssetToken() {
    return this.contractFor('AssetToken');
  }

  contractFor(contractName) {
    if (this.contracts[name]) {
      return this.contracts[name];
    }

    const address = this.addresses[contractName];
    const abi = this.abis[contractName];
    if (!address || !abi) {
      throw new Error(`Address or ABI not found for ${contractName}`);
    }

    let signerOrProvider = this.signer || this.provider;
    this.contracts[contractName] = new ethers.Contract(address, abi, signerOrProvider);
    return this.contracts[name];
  }
}

module.exports = CoopCoin;
