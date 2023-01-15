// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../interfaces/IProfile.sol";


contract CreateProfileNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address public profileContract;

    constructor(address _profileContract) ERC721("Cryptix", "CTX"){
        profileContract = _profileContract;
    }

    function makeNFT(string memory _tokenUri) public returns(uint){
        _tokenIds.increment();

        uint newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenUri);

        IProfile(profileContract).setProfileNFt(address(this), newTokenId);

        return newTokenId;
    }
}