var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = "";
var mnemonic = "";
infura_apikey = "AnDdg2WMcPy7KT57WYZT";
mnemonic = "shoulder muffin ten cupboard trust siren elite lady try breeze behave holiday";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
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
      provider: new HDWalletProvider(mnemonic, "https://kovan.infura.io/"+infura_apikey),
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
