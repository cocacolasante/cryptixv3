import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {ethers} from "ethers"
import checkinAbi from "../abiAssets/checkinAbi.json"
import PROFILECONTRACTADDRESS from '../addresses/ProfileContract';
import profileContractAbi from "../abiAssets/profileContractAbi.json"
import ticketAbi from "../abiAssets/ticketAbi.json"


const nullAddress = "0x0000000000000000000000000000000000000000"

const toWeiStr = (num) => ethers.utils.parseEther(num.toString())
const toWeiInt = (num) => ethers.utils.parseEther(num) 
const fromWei = (num) => ethers.utils.formatEther(num)

const CheckInTickets = () => {
  const params = useParams()
  const[activeAccount, setActiveAccount] = useState()
  const [validator, setValidator] = useState()
  const [ticketAddress, setTicketAddress] = useState()
  const [band, setBand] = useState()
  const [ venue, setVenue] = useState()
  const [showCancelled, setShowCancelled] = useState()
  const [showDate, setShowDate] = useState()
  const[showName, setShowName] = useState()
  const [ showCompleted, setShowCompleted] = useState()
  const [maxAvail, setMaxAvail] = useState()

  const [imageUri, setImageUri ] = useState()

  const [ticketNumber, setTicketNumber] = useState()

  const checkInTicket = async () =>{
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      
      const CheckInContract = new ethers.Contract(params.address, checkinAbi.abi, signer)

      let txn, res
      txn = await CheckInContract.checkInNft(ticketNumber)

      res = await txn.wait()

      if(res.status === 1){
        alert("Checked In Successful")
      }else{
        alert("Failed to Check In")
      }

    }catch(error){
      console.log(error)
    }
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
            // await _getShowInfo()



        }


    }catch(error){
        console.log(error)
    }
  }
  
  const _getTicketNFTImage = async () =>{

    const {ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum)
    const TicketContract = new ethers.Contract(ticketAddress, ticketAbi.abi, provider)

    let ticketUri = await TicketContract.baseUri()
    

    let response = await fetch(ticketUri)
    
    let url = response.url;
    setImageUri(url)

    return url

}

  const getCheckInContract = async () =>{
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        const CheckInContract = new ethers.Contract(params.address, checkinAbi.abi, provider)

        const tixValidator = await CheckInContract.validator()
        console.log(tixValidator)
        setValidator(tixValidator)

        const tixAddress = await CheckInContract.ticketContract()
        console.log(tixAddress)
        setTicketAddress(tixAddress) 

        


    }catch(error){
      console.log(error)
    }
  }

  const _getShowInfo = async () =>{
    try{
        // get ticket information
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const TicketContract = new ethers.Contract(ticketAddress, ticketAbi.abi, provider)

        const bandAddress = await TicketContract.bandAddress()
        setBand(bandAddress)

        const venueAddress = await TicketContract.venueAddress()
        setVenue(venueAddress)



        let endDateInSecs = await TicketContract.endDate()
        endDateInSecs = endDateInSecs.toString()
        setShowDate(endDateInSecs)

        const showComplete = await TicketContract.showCompleted()
        setShowCompleted(showComplete)

        const showCancel = await TicketContract.showCancelled()
        setShowCancelled(showCancel)

        const _showName = await TicketContract.name()
        setShowName(_showName)

        let maxSup = await TicketContract.maxSupply()
        maxSup = maxSup.toString()
        setMaxAvail(maxSup)

        await _getTicketNFTImage()

        

        // get profile information
        const ProfileContract = new ethers.Contract(PROFILECONTRACTADDRESS, profileContractAbi.abi, provider)

        const hostUserStruct = await ProfileContract.users(venueAddress)

        if(hostUserStruct["user"] !== nullAddress){
            const hostUsername = hostUserStruct["username"]
            setVenue(hostUsername)
        }

        const bandStruct = await ProfileContract.users(bandAddress)
        if(bandStruct["user"] !== nullAddress){
            const bandUsername = bandStruct["username"]
            setBand(bandUsername)
        }
        


    }catch(error){
        console.log(error)
    }
  } 

  const displayContractInfo = () =>{
    return(
      <div className='border-radius-outline view-lrg-show-card'>
        {<h2>Ticket Address: {ticketAddress} </h2>}
        <h2>Show Name: {showName} </h2>
        <img src={imageUri} alt="nft" className='lrg-thumbnail' />
        <h2>Band/Guest: {band} </h2>
        <h2>Host: {venue} </h2>

      </div>
    )
  }

  const returnCheckedInNFTs = async () =>{
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      const CheckInContract = new ethers.Contract(params.address, checkinAbi.abi, provider)

      for(let i =0; i <= maxAvail; i++){
        let output = []
        let ticket = await CheckInContract.checkedIn(i);
        if(ticket === true){
          output.push({
            ticketNumber: i,
            checkedIn: true
          })
          console.log(output)
          return output
        }
      }
       


    }catch(error){
      console.log(error)
    }
  }

  const displayCheckInFunctions = () =>{
    return(
      <div className='border-radius-outline view-lrg-show-card'>
        <input placeholder='Ticket Number' onChange={e=>setTicketNumber(e.target.value)} />
        <button onClick={checkInTicket} className='event-btm'>Check In Ticket</button>

      </div>
    )
  }


  useEffect(()=>{
    checkIfWalletIsConnected()
    getCheckInContract()
  },[])

  useEffect(()=>{
    _getShowInfo()
    returnCheckedInNFTs()
    
  },[ticketAddress])




  return (
    <div>
      <h1>Check In Tickets</h1>
      {!ticketAddress ? <p>Loading...</p> : displayContractInfo()}
      {!ticketAddress ? <p>Loading...</p> : displayCheckInFunctions()}

    </div>
  )
}

export default CheckInTickets