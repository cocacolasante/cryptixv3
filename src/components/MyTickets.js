import React from 'react'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CREATE_SHOW_ADDRESS from '../addresses/createShow'
import createContractAbi from "../abiAssets/createContractAbi.json"
import ticketAbi from "../abiAssets/ticketAbi.json"


const toWeiStr = (num) => ethers.utils.parseEther(num.toString())
const toWeiInt = (num) => ethers.utils.parseEther(num) 
const fromWei = (num) => ethers.utils.formatEther(num)


const MyTickets = () => {
    const [myTickets, setMyTickets] = useState()


    const returnUpcomingShows = async () =>{
        try {
          const {ethereum} = window;
          if(ethereum){
            const provider = new ethers.providers.Web3Provider(ethereum)
    
            const CreateShowContract = new ethers.Contract(CREATE_SHOW_ADDRESS, createContractAbi.abi, provider)
    
            let currentShowNum = await CreateShowContract.showNumber()
            currentShowNum++;
            
            let output = []
            for(let i = 1; i < currentShowNum; i++){
                const show = await CreateShowContract.allShows(i)


                const returnedShow = {
                    showNumber: i,
                    ShowName: show.showName,
                    bandAddress: show.band,
                    venueAddress: show.venue,
                    ticketAddress: show.ticketAddress,
                    escrowAddress: show.escrowAddress,
                    showTime: show.showTime.toString(),
                    showPrice: fromWei(show.price.toString()),
                    image: await _getTicketNFTImage(show.ticketAddress)
                }
                output.push(returnedShow)
    
    
    
    
                
            }
            output.sort((a,b) =>{
              return a.showTime - b.showTime
            })
    
            
    
            console.log(output)
            setMyTickets(output)
    
            return output
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
  return (
    <div>MyTickets</div>
  )
}

export default MyTickets