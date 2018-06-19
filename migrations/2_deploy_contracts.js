var ABTRC100Token = artifacts.require("./ABTRC100Token.sol");

module.exports = function(deployer) {
  deployer.deploy(ABTRC100Token);
};
