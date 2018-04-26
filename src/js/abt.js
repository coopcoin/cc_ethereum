var assetTokenContract;
var ethAccount;
var network;
var balance;

window.onload = function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  $.getScript("node_modules/truffle-contract/dist/truffle-contract.js", init);
}

function init() {
  // interval to check account changes or network changes
  // also if MetaMask is locked.
  var dataInterval = setInterval(function() {
    // is MetaMask locked?
    if ( web3.eth.accounts[0] === undefined) {
      ethAccount = undefined;
      $("#ethAccount").html("Please Unlock MetaMask");
    }
    else {
      // did the account changed?
      if (web3.eth.accounts[0] !== ethAccount) {
        ethAccount = web3.eth.accounts[0];
        $("#ethAccount").html(ethAccount);
      }
    }
    // get and update network
    web3.version.getNetwork((err, netId) => {
      if (network !== netId) {
        switch (netId) {
          case "1":
            network = 'mainnet';
            break
          case "2":
            network = 'Morden';
            break
          case "3":
            network = 'ropsten';
            break
          case "4":
            network = 'Rinkeby';
            break
          case "42":
            network = 'Kovan';
            break
          default:
            network = 'unknown';
        }
        $("#network").html(network);
        if (assetTokenContract !== undefined) {
          assetTokenContract.deployed().then((inst) => {
            $("#contractAddress").html(inst.address);
          });
        }
      }
    });
  }, 100);
  // initialize contracts
  $.getJSON('build/contracts/AssetToken.json', function(data) {
    // Get the necessary contract artifact file
    //and instantiate it with truffle-contract.
    assetTokenContract = TruffleContract(data);
    assetTokenContract.setProvider(web3.currentProvider);
    assetTokenContract.deployed().then(function(inst) {
      $("#contractAddress").html(inst.address);
    });
    getTokens();
  });
}

function getTokens(){
  assetTokenContract.deployed().then((inst) => {
    return inst.balanceOf(ethAccount);
  }).then((b) => {
    balance = b.toString();
    $("#balanceOf").html(balance);
    for (var i=0; i<balance; i++) {
      $("#mytokens").append("<tr id=tokenIndex_" + i +"><td>" + i + "</td></tr>");
      getTokenOfOwnerByIndex(i);
    }
  });
}

function getTokenOfOwnerByIndex(index) {
  assetTokenContract.deployed().then((inst) => {
    return inst.tokenOfOwnerByIndex(ethAccount, index);
  }).then((tokenId) => {
    $("#tokenIndex_" + index).append("<td>" + tokenId + "</td>");
    $("#tokenIndex_" + index).append("<td><form id=transferForm><input type=text id=transferToAddress_" + tokenId + "><button type=button onclick=handleTransferButton(" + tokenId + ")>transfer</button></form></td>");
  });
}

function handleTransferButton(tokenId) {
  var to = $("#transferToAddress_" + tokenId).val();
  console.log("Transfer token id: " + tokenId + " to addres: " + to);
  transfer(ethAccount, to, tokenId)
}

function transfer(from, to, tokenId){
  assetTokenContract.deployed().then(inst => {
    return inst.safeTransferFrom(from, to, tokenId);
  }).then(recipt => {
    console.log(recipt);
  }).catch(e => {
    console.log(e);
  });
}
