var CoopCoin = artifacts.require("./CoopCoin.sol");
var CoopCoinCrowdsale = artifacts.require("./CoopCoinCrowdsale.sol")

module.exports = function(deployer) {
  const wallet = "0xc20AaD7baea89A1298B99C003020497b7cF542c1";
  const token = CoopCoin.address;
  const cap = new web3.BigNumber(web3.toWei(1000, "ether"));
  const initialRate = new web3.BigNumber(10000);
  const finalRate = new web3.BigNumber(100);
  // const openingTime = web3.eth.getBlock('latest').timestamp + 2;
  const openingTime = 1532135663 + 60 * 5;
  const closingTime = openingTime + 86400 * 60; // 60 days


  deployer.deploy(
    CoopCoinCrowdsale,
    wallet,
    token,
    cap,
    initialRate,
    finalRate,
    openingTime,
    closingTime
  );
};
