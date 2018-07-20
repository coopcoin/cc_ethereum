pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract  ABTRC100Token is ERC721Token {

  mapping (bytes32 => Token) public ABTRC100Tokens;
  bytes32[] public tokenHashes;


  struct Token {
    uint256 created;
    bool paid;
    uint256 paidTimestamp;
    uint256 burningFee;
    bool burnt;
  }

  constructor() ERC721Token("Factoring ABTRC100", "ABTRC100") public {}

  function mint(address  _to,
    string _invoiceId,
    string _sellerTaxId,
    bytes2 _invoiceCountryCode,
    string _ipfsHash,
    uint256 _burningFee) public {
      bytes32  tokenHash = getTokenHash(_invoiceCountryCode, _sellerTaxId, _invoiceId);
      require(ABTRC100Tokens[tokenHash].created == 0);
      uint256 tokenId;
      Token memory token = Token({
        created: now,
        paid: false,
        paidTimestamp: 0,
        burningFee: _burningFee,
        burnt: false
      });
      tokenHashes.push(tokenHash);
      tokenId = tokenHashes.length.sub(1);
      _mint(_to, tokenId);
      _setTokenURI(tokenId, _ipfsHash);
      ABTRC100Tokens[tokenHash] = token;
  }

  function getTokenHash(
    bytes3 _countryCode,
    string _sellerTaxId,
    string _invoiceId) public pure returns(bytes32) {
      return keccak256(abi.encodePacked(_countryCode, _sellerTaxId, _invoiceId));
  }

  function burn(address _owner, uint256 _tokenId) public {
    _burn(_owner, _tokenId);
  }
}
