const ethers = require('ethers');
const ABIS = {
  AssetToken: require('./abis/AssetToken.json'),
  PriceFeed: require('./abis/PriceFeed.json')
};
const ADDRESSES = {
  AssetToken: require('./addresses/AssetToken.json'),
  PriceFeed: require('./addresses/PriceFeed.json')
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

  get PriceFeed() {
    return this.contractFor('PriceFeed');
  }

  contractFor(contractName) {
    if (this.contracts[contractName]) {
      return this.contracts[contractName];
    }

    const address = this.addresses[contractName][this.provider.chainId.toString()];
    const abi = this.abis[contractName];
    if (!address || !abi) {
      throw new Error(`Address or ABI not found for ${contractName}`);
    }

    let signerOrProvider = this.signer || this.provider;
    this.contracts[contractName] = new ethers.Contract(address, abi, signerOrProvider);
    return this.contracts[contractName];
  }
}

module.exports = CoopCoin;
