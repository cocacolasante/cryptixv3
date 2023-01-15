// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC721.sol";

contract CryptixMarketplace{
    address public admin;


    mapping(address=>Listing) public tixListing;

    struct Listing{
        address _showAddress;
        address owner;
        uint listingPrice;
        uint ticketNumber;
    }

    constructor() {
        admin = msg.sender;
    }

    function listTicket(address showAddress, uint pricePerTicket, uint _ticketNumber) public {
        require(IERC721(showAddress).ownerOf(_ticketNumber) == msg.sender, "only owner" );
        tixListing[msg.sender] = Listing(showAddress, msg.sender, pricePerTicket, _ticketNumber);
        // get nft spend approval

        
        // transfer nft to marketplace  
        IERC721(showAddress).transferFrom(msg.sender, address(this), _ticketNumber);
        


    }
}