// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";

contract Profile {

    mapping(address => UserProfile) public users;

    mapping(address=>address[]) public purchasedShows; 

    mapping(address=>address[]) public createdShows;

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
        require(msg.sender == IERC721(nftContract).ownerOf(tokenId), "incorrect nft owner");

        users[msg.sender].profileNFT = nftContract;
        users[msg.sender].tokenId = tokenId;

    }

    function setMessage(string memory newStatus) public{

        users[msg.sender].statusMessage = newStatus;
        
    }

    function setUsername(string memory newUsername) public {
        users[msg.sender].username = newUsername;
    }

    function setPurchasedShow(address newShow) public {
        purchasedShows[msg.sender].push(newShow);

    }
    function setCreatedShow(address newShow) public {
        createdShows[msg.sender].push(newShow);

    }

    function returnAllUsersShows(address user) public view returns(address[] memory){
        address[] memory allUsersShows = new address[](purchasedShows[user].length);
        uint iterateCount = purchasedShows[user].length;
        for(uint i; i < iterateCount; i++){
            allUsersShows[i] = purchasedShows[user][i];
        }

        return allUsersShows;
    }
    function returnAllUsersEvents(address user) public view returns(address[] memory){
        address[] memory allUsersEvents = new address[](createdShows[user].length);
        uint iterateCount = createdShows[user].length;
        for(uint i; i < iterateCount; i++){
            allUsersEvents[i] = createdShows[user][i];
        }

        return allUsersEvents;
    }

    

}