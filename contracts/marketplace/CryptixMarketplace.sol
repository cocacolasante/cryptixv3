// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC721.sol";

contract CryptixMarketplace{
    address public admin;


    mapping(address=>Listing[]) public tixListing;

    Listing[] public allListings;

    struct Listing{
        address _showAddress;
        address owner;
        uint listingPrice;
        uint ticketNumber;
        bool isForSale;
    }

    constructor() {
        admin = msg.sender;
    }

    function listTicket(address showAddress, uint pricePerTicket, uint _ticketNumber) public {
        require(IERC721(showAddress).ownerOf(_ticketNumber) == msg.sender, "only owner" );
        tixListing[msg.sender].push(Listing(showAddress, msg.sender, pricePerTicket, _ticketNumber, true));
        allListings.push(Listing(showAddress, msg.sender, pricePerTicket, _ticketNumber, true));

        // get nft spend approval
        
        // transfer nft to marketplace  
        IERC721(showAddress).transferFrom(msg.sender, address(this), _ticketNumber);



    }

    function cancelListing(address showAddress, uint _ticketNumber) public {
        

    }
}