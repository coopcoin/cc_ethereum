var CoopCoin = artifacts.require("./CoopCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(CoopCoin);
};
