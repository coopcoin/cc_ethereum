var PriceFeed = artifacts.require("./PriceFeed.sol");

module.exports = function(deployer) {
  deployer.deploy(PriceFeed);
};
