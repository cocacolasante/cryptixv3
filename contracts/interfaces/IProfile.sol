// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IProfile {
    function setPurchasedShow(address newShow) external; 
    function setProfileNFt(address nftContract, uint tokenId) external; 

}