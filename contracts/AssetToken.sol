pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract  AssetToken is ERC721Token {

  Asset[] assets;

  struct Asset {
    uint256 uid;
  }

  function AssetToken() ERC721Token("CoopCoin", "abt") {}

  function mint(address  _to, uint256 _uid) public {
    uint256 tokenId = createAsset(_uid);
    _mint(_to, tokenId);
  }

  function createAsset(uint256 _uid) private returns (uint256) {
    //Asset asset = Asset(_uid);
    assets.push(Asset(_uid));
    return assets.length - 1;
  }

}
