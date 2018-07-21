pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/price/IncreasingPriceCrowdsale.sol";

contract CoopCoinCrowdsale is CappedCrowdsale, AllowanceCrowdsale, IncreasingPriceCrowdsale {
  constructor(
    address _wallet,
    ERC20 _token,
    uint256 _cap,
    uint256 _initialRate,
    uint256 _finalRate,
    uint256 _openingTime,
    uint256 _closingTime
  )
  public
  Crowdsale(_initialRate, _wallet, _token)
  CappedCrowdsale(_cap)
  TimedCrowdsale(_openingTime, _closingTime)
  IncreasingPriceCrowdsale(_initialRate, _finalRate)
  AllowanceCrowdsale(_wallet) {

  }
}
