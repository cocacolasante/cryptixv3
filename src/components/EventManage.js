import { useState, useEffect } from 'react';
import {ethers} from "ethers"
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PROFILECONTRACTADDRESS from '../addresses/ProfileContract';
import profileContractAbi from "../abiAssets/profileContractAbi.json"
import ticketAbi from "../abiAssets/ticketAbi.json"
import controllerAbi from "../abiAssets/controllerAbi.json"
import managecheckInAddress from '../addresses/managecheckin';
import manageCheckInAbi from "../abiAssets/ManagecheckInAbi.json"


const toWeiStr = (num) => ethers.utils.parseEther(num.toString())
const toWeiInt = (num) => ethers.utils.parseEther(num) 
const fromWei = (num) => ethers.utils.formatEther(num)

const nullAddress = "0x0000000000000000000000000000000000000000"


const EventManage = () => {
    const params = useParams()

    const [eventTixAddress, setEventTixAddress] = useState()

    const [newMax, setNewMax ] = useState()
    const [newEventDate, setNewEventDate] = useState()
    const [imageUri, setImageUri ] = useState()
    const[activeAccount, setActiveAccount] = useState()
    const [checkInContract, setCheckInContract] = useState()



    const setNewMaxSupply = async () =>{
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const ControllerContract = new ethers.Contract(params.address, controllerAbi.abi, signer)

            let txn, res

            txn = await ControllerContract.setNewMaxSupply(newMax)

            res = await txn.wait()

            if(res.status===1){
                console.log("success")
            }else{
                console.log("failed")
            }

        }catch(error){
            console.log(error)
        }
    }
    const completeShow = async () =>{
        alert("You are trying to complete show, this will release funds. Only do this after event is over")
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const ControllerContract = new ethers.Contract(params.address, controllerAbi.abi, signer)

            let txn, res

            txn = await ControllerContract.completeShow()

            res = await txn.wait()

            if(res.status===1){
                console.log("success")
            }else{
                console.log("failed")
            }

        }catch(error){
            console.log(error)
        }
    }
    const cancelShow = async () =>{
        alert("You are trying to cancel your event, all funds will be sent back to purchasees")
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const ControllerContract = new ethers.Contract(params.address, controllerAbi.abi, signer)

            let txn, res

            txn = await ControllerContract.refundShow()

            res = await txn.wait()

            if(res.status===1){
                console.log("success")
            }else{
                console.log("failed")
            }

        }catch(error){
            console.log(error)
        }
    }
    const rescheduleShow = async () =>{
        const secondsToShow = _convertDateTime()
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const ControllerContract = new ethers.Contract(params.address, controllerAbi.abi, signer)

            let txn, res

            txn = await ControllerContract.rescheduleShow(secondsToShow)

            res = await txn.wait()

            if(res.status===1){
                console.log("success")
            }else{
                console.log("failed")
            }

        }catch(error){
            console.log(error)
        }
    }


    const _convertDateTime = () =>{
        const endDate = new Date(newEventDate)
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;
        const currentDateTime = new Date(dateTime)
        let seconds = Math.abs(endDate.getTime() - currentDateTime.getTime())/1000;

        return seconds
        
    }

    const createCheckIn = async () =>{
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const ManageCheckInContract = new ethers.Contract(managecheckInAddress, manageCheckInAbi.abi, signer)

            let txn, res

            txn = await ManageCheckInContract.createCheckIn(eventTixAddress)
            res = await txn.wait()

            if(res.status === 1 ){
                // const checkInStruct = await ManageCheckInContract.tixToCheckIn(params.address)

                alert("Successfully created")
            }else{
                alert("failed")
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
            const currentAct = accounts[0]
              setActiveAccount(currentAct);
              console.log(`connected to ${currentAct}`)
              
  
          }
  
  
      }catch(error){
          console.log(error)
      }
    }
    const getTicketAddress = async () =>{
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)

            const ControllerContract = new ethers.Contract(params.address, controllerAbi.abi, provider)

            const ticketAddress = await ControllerContract.ticketContract()
            

            setEventTixAddress(ticketAddress)

            await _getTicketNFTImage(ticketAddress)
            

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
        setImageUri(url)

        return url

    }

    const getCheckInContract = async () =>{
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)

            const ManageCheckInContract = new ethers.Contract(managecheckInAddress, manageCheckInAbi.abi, provider)

            const checkInStruct = await ManageCheckInContract.tixToCheckIn(eventTixAddress)
            const currentCheckIn = checkInStruct["checkInContract"]
            
            setCheckInContract(currentCheckIn)
            console.log(currentCheckIn)

        }catch(error){
            console.log(error)
        }
    }

    const displayCreateCheckIn = () =>{
        if(checkInContract === nullAddress ){
            return(
                <>
                    <button onClick={createCheckIn} className='buy-button'>Create Check in Contract</button>
                </>
            )
        }else{
            return(
                <>
                    <Link className='buy-button' to={`/manage/checkin/${checkInContract}`} >Check In Contract</Link>
                </>

            )
        }
    }
  
  
    useEffect(()=>{
      checkIfWalletIsConnected()
      getTicketAddress()
      

    },[])

    useEffect(()=>{
        getCheckInContract()
    },[eventTixAddress])




  return (
    <div className='event-manage-div'>

    <div className='border-radius-outline show-card event-card'>
        {!eventTixAddress ? <></> :<p>Ticket Contract: {eventTixAddress.slice(0, 6)}...{eventTixAddress.slice(-6)}</p>}
        <p>Controller Contract: {params.address.slice(0, 6)}...{params.address.slice(-6)}</p>
        <img className='thumbnail event-img' src={imageUri} alt="nft" />
        <input onChange={e=>setNewMax(e.target.value)} type="number" placeholder='Enter New Max tix' />
        <button className='buy-button' onClick={setNewMaxSupply} >Set Max Tix</button>
        <br />
        <input type="datetime-local" onChange={e=>setNewEventDate(e.target.value)} />
        <button className='buy-button' >Change Event Date</button>
        <br />
        <input placeholder='Input New Ticket Price' type='number' />
        <button className='buy-button' >Set New Ticket Price</button>
        <br />
        {displayCreateCheckIn()}
        <br />
        <button className='buy-button' onClick={completeShow} >Complete Show</button>
        <button className='cancel-button' onClick={cancelShow} >Cancel Show</button>
    </div>
    </div>
  )
}

export default EventManage