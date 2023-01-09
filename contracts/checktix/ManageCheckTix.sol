// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../checktix/CheckTix.sol";
import "../interfaces/ICryptickets.sol";


contract ManageCheckTix {

    // mapping of ticket address to check in struct
    mapping(address=>CheckIn) public tixToCheckIn;
    //maps check in address to ticket address
    mapping(address=>address) public checkInToTix;

    struct CheckIn{
        address ticketContract;
        address checkInContract;
    }

    function createCheckIn(address ticketAddress) public {
        require(msg.sender == ICryptickets(ticketAddress).returnVenueAddress(), "only creator can call" );
        require(tixToCheckIn[ticketAddress].checkInContract == address(0) , "already created");

        CheckTix newCheckIn = new CheckTix(ticketAddress);
        newCheckIn.changeValidator(msg.sender);

        tixToCheckIn[ticketAddress] = CheckIn(ticketAddress, address(newCheckIn));

        checkInToTix[address(newCheckIn)] = ticketAddress;



    }
}