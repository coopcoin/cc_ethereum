const promptly = require('promptly');
const ethers = require('ethers');
const CoopCoin = require('../lib/index.js');

module.exports = async function(callback) {

  const networkId = parseInt(web3.version.network);
  const ethProvider = new ethers.providers.Web3Provider(
    web3.currentProvider, { chainId: networkId }
  );

  const coopcoin = new CoopCoin(ethProvider, ethProvider.getSigner());

  const PriceFeed = coopcoin.PriceFeed;

  const owner = await PriceFeed.owner()
  console.log(`Current owner: ${owner}`);

  const price = await promptly.prompt('Price: ');
  const symbol = await promptly.prompt('Symbol: ');

  const answer = await promptly.confirm(`Do you really want to set the price for ${symbol} to ${price}?`);
  if (!answer) {
    process.exit();
  }

  PriceFeed.functions.setPriceFor(symbol, price).then((result) => {
    console.log('DONE');
    console.log(result);
    callback();
  });

}

