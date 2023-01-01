import React from 'react'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PROFILECONTRACTADDRESS from '../addresses/ProfileContract';
import profileContractAbi from "../abiAssets/profileContractAbi.json"
import ticketAbi from "../abiAssets/ticketAbi.json"




const MyTickets = () => {
    const [myTickets, setMyTickets] = useState()
    const [activeAccount, setActiveAccount] = useState()


    const returnMyShows = async () =>{
        try {
          const {ethereum} = window;
          if(ethereum){
            const provider = new ethers.providers.Web3Provider(ethereum)
    
            const ProfileContract = new ethers.Contract(PROFILECONTRACTADDRESS, profileContractAbi.abi, provider)
            
            const usersShowArray = await ProfileContract.returnAllUsersShows(activeAccount)

            console.log(usersShowArray)

          }
    
        }catch(error){
          console.log(error)
        }
      }
    const _getTicketNFTImage = async (ticketAddress) =>{
  
      const {ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum)
      const TicketContract = new ethers.Contract(ticketAddress, ticketAbi.abi, provider)
  
      let ticketUri = await TicketContract.baseUri()
      
  
      let response = await fetch(ticketUri)
      
      let url = response.url;
  
      return url
  
    }

    const checkIfWalletIsConnected = async () =>{
      try{
          const {ethereum} = window;
          if(!ethereum){
              alert("Please install metamask")
              return;
          }else{
              console.log("Ethereum Detected")

          }
          const accounts = await ethereum.request({method: "eth_accounts"})
          if(accounts.length !== 0 ){
              setActiveAccount(accounts[0]);
              console.log(`connected to ${accounts[0]}`)

          }


      }catch(error){
          console.log(error)
      }
  }

  useEffect(()=>{
      checkIfWalletIsConnected();
      returnMyShows();
  },[])


  return (
    <div>MyTickets</div>
  )
}

export default MyTickets