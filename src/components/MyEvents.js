import { useState, useEffect } from 'react';
import {ethers} from "ethers"
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PROFILECONTRACTADDRESS from '../addresses/ProfileContract';
import CREATE_SHOW_ADDRESS from '../addresses/createShow'
import createContractAbi from "../abiAssets/createContractAbi.json"
import profileContractAbi from "../abiAssets/profileContractAbi.json"
import ticketAbi from "../abiAssets/ticketAbi.json"

const toWeiStr = (num) => ethers.utils.parseEther(num.toString())
const toWeiInt = (num) => ethers.utils.parseEther(num) 
const fromWei = (num) => ethers.utils.formatEther(num)

const MyEvents = () => {
  let params = useParams()
  const [myEvents, setMyEvents] = useState()
  const [myEventAddress, setMyEventAddress] = useState()
  const[activeAccount, setActiveAccount] = useState()

  const returnMyEvents = async (account) =>{
    try {

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      

      const ProfileContract = new ethers.Contract(PROFILECONTRACTADDRESS, profileContractAbi.abi, provider)
      
      const userEventsArray = await ProfileContract.returnAllUsersEvents(account)
      setMyEventAddress(userEventsArray)
      console.log(userEventsArray)
      
      // get contract instances for all purchased tickets
      // map through createContract Show datas and filter by ticket address to match those from usersShowArray
      const CreateShowContract = new ethers.Contract(CREATE_SHOW_ADDRESS, createContractAbi.abi, provider)
      
      let output=[]
      
     for(let i = 0; i<userEventsArray.length; i++){
        const show = await CreateShowContract.showAddress(userEventsArray[i])
        const returnedShow = {
          showNumber: i,
          ShowName: show.showName,
          bandAddress: show.band,
          venueAddress: show.venue,
          ticketAddress: show.ticketAddress,
          escrowAddress: show.escrowAddress,
          controllerContract: show.controllerContract,
          showTime: show.showTime.toString(),
          showPrice: fromWei(show.price.toString()),
          image: await _getTicketNFTImage(show.ticketAddress)
      }
      output.push(returnedShow)


     }

      setMyEvents(output)
      console.log(output)

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

            returnMyEvents(accounts[0])

        }


    }catch(error){
        console.log(error)
    }
  }


  useEffect(()=>{
    checkIfWalletIsConnected()
    
  },[])
  
  return (
    <div>
      <h1>My Events</h1>
      {!myEvents ? <p>No events</p> : (  myEvents.map((i)=>{
      return(
        <div className='border-radius-outline show-card' key ={i["showNumber"]}>
        <h4>Show Name: {i["ShowName"]}</h4>
        <img className='thumbnail' src={i["image"] } alt="tickets" />

        <p>Band: {i["bandAddress"].slice(0, 6)}...{i["bandAddress"].slice(-6)}</p>
        <p>Venue: {i["venueAddress"].slice(0, 6)}...{i["venueAddress"].slice(-6)}</p>
        <p>Tickets: {i["ticketAddress"].slice(0, 6)}...{i["ticketAddress"].slice(-6)}</p>
        <p>Price: {i["showPrice"]}</p>

        {displayShowDate(i['showTime'])}
        
        <Link className='event-btm' to={`/manage/${i["controllerContract"]}`} >Manage Event</Link>

    </div>
      )
    }))}
    </div>
  )
}

export default MyEvents