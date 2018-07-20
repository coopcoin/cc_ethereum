pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/StandardBurnableToken.sol";

contract CoopCoin is MintableToken, StandardBurnableToken, DetailedERC20 {
  constructor() DetailedERC20("CoopCoin", "COOP", 18) public {}
}
