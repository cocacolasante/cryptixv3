import { useState, useEffect } from 'react';
import {ethers} from "ethers"
import { useParams } from 'react-router-dom';
import PROFILECONTRACTADDRESS from '../addresses/ProfileContract';
import profileContractAbi from "../abiAssets/profileContractAbi.json"
import ticketAbi from "../abiAssets/ticketAbi.json"
import controllerAbi from "../abiAssets/controllerAbi.json"

const toWeiStr = (num) => ethers.utils.parseEther(num.toString())
const toWeiInt = (num) => ethers.utils.parseEther(num) 
const fromWei = (num) => ethers.utils.formatEther(num)

const EventManage = () => {
    const params = useParams()

    const [event, setEvent ] = useState(params.address)

    const[activeAccount, setActiveAccount] = useState()
  
    const returnControllerInfo = async () =>{
        try{
            const provider = await ethers.providers.Web3Provider(window.ethereum)

            const ControllerContract = new ethers.Contract(params.address, controllerAbi.abi, provider)

            const ticketAddress = await ControllerContract.ticketContract()

            const TicketContract = new ethers.Contract(ticketAddress, ticketAbi.abi, provider)

            
            

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
    const displayShowDate = (seconds) =>{
      let newSeconds = parseInt(seconds)
      const newDate = new Date(newSeconds * 1000)
      
      const hour = newDate.getHours()
      const minutes = newDate.getMinutes()
      const day = newDate.getDay()
      const month = newDate.getMonth() + 1
      const year = newDate.getFullYear()
      
      const formatTime = (hours) =>{
          if(hours > 12){
              return(
                  <p>{hours - 12}:{minutes} PM {month}/{day}/{year}</p>
              )
          }else{
              return(<p>{hours}:{minutes} AM {month}/{day}/{year}</p>)
          }
      }
  
      return(
          <div>
              <>{formatTime(hour)}</>
          </div>
      )
  
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
      checkIfWalletIsConnected()
      console.log(params)
    },[])
  return (
    <div>
        <p>Ticket Contract: {params.address}</p>
    </div>
  )
}

export default EventManage