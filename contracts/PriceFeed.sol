pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract PriceFeed is Ownable {
  mapping(bytes32 => uint) public prices;
  event LogPriceUpdated(string symbol, uint price);

  function getPriceFor(string symbol) public view returns(uint) {
    bytes32 key = keccak256(bytes(symbol));
    return prices[key];
  }

  function setPriceFor(string symbol, uint price) public onlyOwner {
    bytes32 key = keccak256(bytes(symbol));
    prices[key] = price;
  }
}
