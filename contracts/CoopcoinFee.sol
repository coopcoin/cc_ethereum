pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract CoopcoinFee is Ownable {
  uint256 fee;
  uint8 public decimals;

  function getFee() public view returns(uint) {
    return fee;
  }

  function setFee(uint256 newFee) public onlyOwner {
    fee = newFee;
  }
}
