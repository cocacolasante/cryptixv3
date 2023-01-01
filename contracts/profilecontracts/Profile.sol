// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";

contract Profile {

    mapping(address => UserProfile) public users;

    mapping(address=>address[]) public purchasedShows; 

    struct UserProfile{
        address user;
        address profileNFT;
        uint tokenId;
        string statusMessage;
        string username;
    }

    function createProfile(string memory username) public {
        require(users[msg.sender].user == address(0), "already created profile");

        users[msg.sender] = UserProfile(msg.sender, address(0), 0, "default status", username);

    }

    function setProfileNFt(address nftContract, uint tokenId) public {
        require(msg.sender == users[msg.sender].user, "can only update your own profile");
        require(msg.sender == IERC721(nftContract).ownerOf(tokenId), "incorrect nft owner");

        users[msg.sender].profileNFT = nftContract;
        users[msg.sender].tokenId = tokenId;

    }

    function setMessage(string memory newStatus) public{
        require(msg.sender == users[msg.sender].user, "only can update own profile");

        users[msg.sender].statusMessage = newStatus;
        
    }

    function setPurchasedShow(address newShow) public {
        require(msg.sender == users[msg.sender]. user, "only user can update own profile");
        purchasedShows[msg.sender].push(newShow);

    }
    
}