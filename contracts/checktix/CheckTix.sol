// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../interfaces/ICryptickets.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";

contract CheckTix{
    address public validator;
    address public ticketContract;

    bool public checkInClosed;

    modifier IsClosed {
        require(checkInClosed == false, "no longer checking tickets");
        _;
    }

    mapping(uint => bool) public checkedIn;

    receive() external payable{}

    constructor(address _showAdd){
        ticketContract = _showAdd;
        validator = msg.sender;
    }

    function checkInNft(uint nftNumber) public IsClosed returns(bool){
        require(msg.sender == validator, "validator");
        require(checkedIn[nftNumber] == false, "already checked in");
        require(nftNumber <= ICryptickets(ticketContract).returnCurrentCount(), "ticket does not exist");

        checkedIn[nftNumber] = true;

        return true;
        
    }

    function viewCheckedIn(uint nftNum) public view returns(bool){
        return checkedIn[nftNum];

    }



    function changeValidator(address newValidator) public {
        require(msg.sender == validator, "only validator");

        validator = newValidator;
    }

    function closeCheckIn() public {
        require(msg.sender == validator, "only validator");
        checkInClosed = true;

    }
    

    
}