var network;
var provider;
var signer;
var ethAccount;
var assetTokenContract;
var tokenBalance;


// Get an ethereum provider and a signer
window.onload = function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    // get network and initialize provider
    web3.version.getNetwork((err, netId) => {
      network = ethers.networks[getNetworkName(netId)];
      provider = new ethers.providers.Web3Provider(web3.currentProvider, network);
      signer = provider.getSigner();
      $("#network").html(network.name);
      init();
    });
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    provider = ethers.providers.getDefaultProvider();
    network = ethers.networks[getNetworkName(provider.chainId)];
    init();
  }
}


function init() {
  // load ABT contract from truffle build
  $.getJSON('build/contracts/AssetToken.json', (contractData) => {
    if (contractData.networks[network.chainId] === undefined) {
      $("#contractAddress").html("Contract not found in this network.");
      return;
    }
    var address = contractData.networks[network.chainId].address;
    var abi = contractData.abi;
    assetTokenContract = new ethers.Contract(address, abi, signer);
    $("#contractAddress").html(assetTokenContract.address);
  });

  // set loop to check for address change
  var stateChangeInterval = setInterval(function () {
    // check if address changed
    if (signer !== undefined) {
      signer.getAddress().then(address => {
        if (address !== ethAccount) {
          ethAccount = address;
          setAddress();
          assetTokenContract.balanceOf(ethAccount).then((b) => {
            tokenBalance = b.toNumber();
            setBalance();
            setTokensTable();
            getTransferHistory({live:true});
          });
        }
      }).catch(err => {
        console.log(err);
        ethAccount = 0;
        setAddress();
      });
    }
  }, 2000);
}


function setBalance() {
  $("#balanceOf").html(tokenBalance.toString());
}


function setTokensTable(){
  $("#mytokens > tbody").html("");
  for (var i=0; i < tokenBalance; i++) {
    assetTokenContract.tokenOfOwnerByIndex(ethAccount, i).then((tokenId) => {
      setTokensTableRow(tokenId);
    })
  }
}


function setTokensTableRow(tokenId) {
  var rowHtml = "";
  rowHtml += "<tr id=tokenId_" +  tokenId + ">";
  rowHtml += "  <td>" + tokenId + "</td>";
  rowHtml += "  <td>";
  rowHtml += "    <form id=transferForm>";
  rowHtml += "      <input type=text id=transferToAddress_" + tokenId + ">";
  rowHtml += "      <button type=button onclick=handleTransferButton(" + tokenId + ")>transfer</button>";
  rowHtml += "    </form>";
  rowHtml += "  </td>";
  rowHtml += "</tr>";
  $("#mytokens > tbody").append(rowHtml);
}


function getNetworkName(network_id) {
  var networkName;
  switch (network_id) {
    case "1":
      networkName = 'mainnet';
      break;
    case "2":
      networkName = 'morden';
      break;
    case "3":
      networkName = 'ropsten';
      break;
    case "4":
      networkName = 'rinkeby';
      break;
    case "42":
      networkName = 'kovan';
      break;
    default:
      networkName = 'unknown';
      break;
  }
  return networkName;
}


function setAddress() {
  if (ethAccount === 0) {
    $("#ethAccount").html("Error loading account, maybe unlock MetaMask?");
    return;
  }
  $("#ethAccount").html(ethAccount);
}


function handleTransferButton(tokenId) {
  var to = $("#transferToAddress_" + tokenId).val();
  console.log("Transfer token id: " + tokenId + " to addres: " + to);
  transfer(ethAccount, to, tokenId)
}


function transfer(from, to, tokenId){
  assetTokenContract.safeTransferFrom(from, to, tokenId).then(tx => {
    console.log(tx);
  }).catch(e => {
    console.log(e);
  });
}


function getTransactionHistory() {
  var options = {live:false}
  getTransactionHistory(options);
}


function getTransferHistory(options) {
  $("#tx_history > tbody").html("");
  var transferInfo = assetTokenContract.interface.events.Transfer;
  var filter = {
    fromBlock: 0,
    toBlock: 'latest',
    address: assetTokenContract.address,
    topics: transferInfo.topics
  };
  provider.getLogs(filter).then((log) => {
    for(var i=0; i < log.length; i++) {
      handleTransferEvent(log[i]);
    }
    if (options.live) {
      provider.on(transferInfo.topics, (liveLog) => handleLiveTransferEvent(liveLog));
    }
  });
}


function getEventTransferData(log) {
  var transferInfo = assetTokenContract.interface.events.Transfer;
  var result = transferInfo.parse(log.topics, log.data);
  if (result._from == ethAccount || result._to == ethAccount) {
    var eventTransferData = {
      from: result._from,
      to: result._to,
      tokenId: result._tokenId.toNumber(),
      txHash: log.transactionHash
    };
    return eventTransferData;
  }
  return false;
}


function handleLiveTransferEvent(liveLog) {
  var eventTransferData = getEventTransferData(liveLog);
  if (eventTransferData) {
    setHistroyTableRow(eventTransferData);
    if (eventTransferData.to == ethAccount) {
      setTokensTableRow(eventTransferData.tokenId);
      tokenBalance++;
    } else {
      $("#tokenId_" + eventTransferData.tokenId).remove();
      tokenBalance--;
    }
    setBalance();
  }
}


function handleTransferEvent(log){
  var eventTransferData = getEventTransferData(log);
  if (eventTransferData) {
    setHistroyTableRow(eventTransferData);
  }
}


function setHistroyTableRow(transferTx) {
  var rowHtml = "";
  rowHtml += "<tr>";
  rowHtml += "  <td>Transfer</td>";
  rowHtml += "  <td>" + transferTx.from + "</td>";
  rowHtml += "  <td>" + transferTx.to + "</td>";
  rowHtml += "  <td>" + transferTx.tokenId + "</td>";
  rowHtml += "  <td>" + transferTx.txHash + "</td>";
  rowHtml += "</tr>";
  $("#tx_history > tbody").append(rowHtml);
}
