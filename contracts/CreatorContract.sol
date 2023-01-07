// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/ICreateController.sol";
import "./interfaces/IControlShow.sol";
import "./Escrow.sol";
import "./interfaces/ICryptickets.sol";
import "./interfaces/ICreateTix.sol";



contract CreatorContract{
    uint public showNumber;
    address public createContAdd;
    address public createTickAdd;

    mapping(uint => Show) public allShows;
    
    // mapping by ticket address
    mapping(address => Show) public showAddress;

    struct Show{
        string showName;
        address ticketAddress;
        address escrowAddress;
        address controllerContract;
        address band;
        address venue;
        uint showTime;
        uint price;
        bool completed;
    }
    
    receive() external payable{}

    constructor(address _createCon, address _createTickAdd){
        createContAdd = _createCon;
        createTickAdd =_createTickAdd;
    }

    function createShow(string memory _name, string memory _symbol, address _bandAddress, uint endDate, uint price) public{
        showNumber++;
        
        uint endTime = endDate + block.timestamp;

        Escrow newEscrow = new Escrow();

        address newTickets = ICreateTickets(createTickAdd).createTicket(_name, _symbol, address(newEscrow), _bandAddress, msg.sender, endTime, price);
        
        address newController = ICreateController(createContAdd).createController(showNumber, _bandAddress, msg.sender, address(newTickets));

        ICryptickets(newTickets).changeAdmin(newController);

        newEscrow.setTicketContract(address(newTickets));

        allShows[showNumber] = Show(_name, address(newTickets), address(newEscrow),newController, _bandAddress, msg.sender, endTime, price, false);
        
        showAddress[address(newTickets)] = Show(_name, address(newTickets), address(newEscrow),newController, _bandAddress, msg.sender, endTime, price, false);
        

    }

    function returnAllShows() public view returns(Show[] memory){
        Show[] memory allReturnedShows = new Show[](showNumber);
        for(uint i; i < showNumber; i++){
            allReturnedShows[i] = allShows[i];
        }
        return allReturnedShows;
    }


}