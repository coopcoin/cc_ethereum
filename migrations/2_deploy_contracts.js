var AssetToken = artifacts.require("./AssetToken.sol");

module.exports = function(deployer) {
  deployer.deploy(AssetToken);
};
