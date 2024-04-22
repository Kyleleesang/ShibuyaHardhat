pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestERC721 is ERC721  {
    constructor() ERC721("Test", "T721") {
        _mint(msg.sender, 10000);
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
    
}