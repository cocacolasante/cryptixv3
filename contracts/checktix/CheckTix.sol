// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../interfaces/ICryptickets.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";

contract CheckTix{
    address public validator;
    address public ticketContract;

    mapping(uint => bool) public checkedIn;

    constructor(address _showAdd){
        ticketContract = _showAdd;
        validator = msg.sender;
    }

    function checkInNft(uint nftNumber) public returns(bool){
        require(msg.sender == validator, "validator");
        require(checkedIn[nftNumber] == false, "already checked in");

        checkedIn[nftNumber] = true;

        return true;
        
    }

    function viewCheckedIn(uint nftNum) public view returns(bool){
        return checkedIn[nftNum];

    }

    function viewListChecked() public view returns(uint[] memory){
        uint[] memory tixRedemed;
        uint maxSup = ICryptickets(ticketContract).maxSupply();
        for(uint i; i< maxSup; i++){
            if(checkedIn[i]==true){
                tixRedemed[i] = i;
            }
        }
        return tixRedemed;
    }

    function selfCheckIn(uint nftNum) public returns(bool){
        require(IERC721(ticketContract).ownerOf(nftNum) == msg.sender, "not token owner" );

        checkedIn[nftNum] = true;

        return true;
    }

    function changeValidator(address newValidator) public {
        require(msg.sender == validator, "only validator");

        validator = newValidator;
    }

    

    
}