const REPL = require('repl');
const promptly = require('promptly');

const ethers = require('ethers');
const CoopCoin = require('../lib/index.js');

module.exports = async function(callback) {
  const networkId = parseInt(web3.version.network);
  const ethProvider = new ethers.providers.Web3Provider(
    web3.currentProvider, { chainId: networkId }
  );

  const coopcoin = new CoopCoin(ethProvider, ethProvider.getSigner());

  let contractName = await promptly.prompt('Contract Name: ');
  const contractWrapper = coopcoin[contractName];

  let method;
  method = await promptly.prompt('Function (? for available functions): ');
  while (method === '?') {
    console.log(`Contract functions: ${JSON.stringify(Object.keys(contractWrapper.functions))}`);
    console.log("\n");

    method = await promptly.prompt('Function: ');
  }
  if (!contractWrapper.functions[method]) {
    callback(new Error(`Method ${method} is not defined on ${contractName}`));
    return;
  }
  let argumentInput = await promptly.prompt('Arguments (comma separated): ', { default: '' });
  let args = [];
  if (argumentInput !== '') {
    args = argumentInput.split(',').map(a => a.trim());
  }
  console.log(`Using ${contractName} at ${contractWrapper.address}`);
  console.log(`Calling ${method} with ${JSON.stringify(args)}`);

  contractWrapper.functions[method].apply(contractWrapper, args).then((result) => {
    console.log("\nResult:");
    console.log(result);

    console.log("\nStartig a REPL. (type .exit to exit)");
    console.log(`defined variables: result, ${contractName}, coopcoin`);
    let r = REPL.start();
    r.context.result = result;
    r.context[contractName] = contractWrapper;
    r.context.coopcoin = coopcoin;

    r.on('exit', () => {
      console.log('Bye');
      callback();
    })
  }).catch((error) => {
    console.log("Call failed. Probably the contract raised an error?\n");
    console.log("...");
    callback(error);
  });

}
