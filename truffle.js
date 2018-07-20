require("dotenv").config();
var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = process.env.INFURA_APIKEY;
var mnemonic = process.env.MNEMONIC;

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*", // Match any network id
      //gasLimit: 100000
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey);
      },
      network_id: 3
      // gasLimit: 50000,
      // gasPrice: 20000000000
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://kovan.infura.io/"+infura_apikey);
      },
      network_id: 42,
    }
  },
  solc: {
		optimizer: {
			enabled: true,
			runs: 500
		}
	},
};
