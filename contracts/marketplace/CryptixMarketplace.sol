// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "../interfaces/ICryptickets.sol";

contract CryptixMarketplace{
    address public admin;

    uint listingCount;


    mapping(address=>Listing[]) public tixListing;
    mapping(uint =>Listing) public allListings;


    struct Listing{
        address _showAddress;
        address owner;
        uint listingPrice;
        uint ticketNumber;
        bool isForSale;
    }

    event TicketListed(address owner, address ticketAddress, uint ticketNumber, uint listingPrice);

    event ListingCancelled(address owner, address ticketAddress, uint ticketNumber);

    event TicketsPurchased(address from, address to, uint ticketNumber, uint amount);

    constructor() {
        admin = msg.sender;
    }

    function listTicket(address showAddress, uint _ticketNumber, uint pricePerTicket) public returns(uint){
        require(IERC721(showAddress).ownerOf(_ticketNumber) == msg.sender, "only owner" );
        listingCount++;

        tixListing[msg.sender].push(Listing(showAddress, msg.sender, pricePerTicket, _ticketNumber, true));

        allListings[listingCount] = (Listing(showAddress, msg.sender, pricePerTicket, _ticketNumber, true));

        
        // transfer nft to marketplace  
        IERC721(showAddress).transferFrom(msg.sender, address(this), _ticketNumber);

        emit TicketListed(msg.sender, showAddress, _ticketNumber, pricePerTicket);

        return(listingCount);

    }

    function cancelListing(uint listingNumber) public {
        require(allListings[listingNumber].owner == msg.sender, "not your tickets" );
        address showAddress = allListings[listingNumber]._showAddress;

        for(uint i; i < tixListing[msg.sender].length; i++){
            if(tixListing[msg.sender][i]._showAddress == showAddress){
                tixListing[msg.sender][i].isForSale = false;
                tixListing[msg.sender][i].listingPrice = 0;

            }
        }

        allListings[listingNumber].isForSale = false;
        allListings[listingNumber].listingPrice = 0;

        IERC721(showAddress).transferFrom(address(this), msg.sender, allListings[listingNumber].ticketNumber);

        emit ListingCancelled(allListings[listingNumber].owner, allListings[listingNumber]._showAddress, allListings[listingNumber].ticketNumber);


    }


    function buyListing(uint listingNumber) public payable {
        require(msg.value >= allListings[listingNumber].listingPrice, "please pay for ticket");
        require(allListings[listingNumber].isForSale == true, "not currently for sale" );

        allListings[listingNumber].isForSale == false;

        address ticketAddress = allListings[listingNumber]._showAddress;
        
        for(uint i; i < tixListing[allListings[listingNumber].owner].length; i++){
            if(tixListing[allListings[listingNumber].owner][i]._showAddress == ticketAddress){
                tixListing[allListings[listingNumber].owner][i].isForSale == false;

            }
        }

        address band = ICryptickets(ticketAddress).returnBandAddress();

        uint bandAmount = msg.value / 10;

        payable(admin).transfer(bandAmount);
        payable(band).transfer(bandAmount);

        payable(allListings[listingNumber].owner).transfer(msg.value);

        emit TicketsPurchased(allListings[listingNumber].owner, msg.sender, allListings[listingNumber].ticketNumber, msg.value);

    }


}
