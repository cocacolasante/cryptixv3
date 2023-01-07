import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {ethers} from "ethers"
import ticketAbi from "../abiAssets/ticketAbi.json"
import controllerAbi from "../abiAssets/controllerAbi.json"


const ShowManage = () => {
    let params = useParams();

    const [imageUri, setImageUri ] = useState()
    const[activeAccount, setActiveAccount] = useState()

    const [band, setBand] = useState()
    const [ venue, setVenue] = useState()
    const [tixPrice, setTixPrice] = useState()
    const [walletMax, setWalletMax] = useState()
    const [showDate, setShowDate] = useState()
    const [ showCompleted, setShowCompleted] = useState()
    const [showCancelled, setShowCancelled] = useState()
    const[showName, setShowName] = useState()


    const [purchaseAmount, setPurchaseAmount] = useState()






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
                await _getTicketNFTImage()
                await _getShowInfo()

    
    
            }
    
    
        }catch(error){
            console.log(error)
        }
    }

    const _getTicketNFTImage = async () =>{

        const {ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum)
        const TicketContract = new ethers.Contract(params.address, ticketAbi.abi, provider)

        let ticketUri = await TicketContract.baseUri()
        

        let response = await fetch(ticketUri)
        
        let url = response.url;
        setImageUri(url)

        return url

    }

    const _getShowInfo = async () =>{
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            
            const TicketContract = new ethers.Contract(params.address, ticketAbi.abi, provider)

            const bandAddress = await TicketContract.bandAddress()
            setBand(bandAddress)

            const venueAddress = await TicketContract.venueAddress()
            setVenue(venueAddress)

            let ticketPrice = await TicketContract.ticketPrice()
            ticketPrice = ticketPrice.toString()
            setTixPrice(ticketPrice)

            const maxPerWallet = await TicketContract.ticketLimit()
            setWalletMax(maxPerWallet)

            let endDateInSecs = await TicketContract.endDate()
            endDateInSecs = endDateInSecs.toString()
            setShowDate(endDateInSecs)

            const showComplete = await TicketContract.showCompleted()
            setShowCompleted(showComplete)

            const showCancel = await TicketContract.showCancelled()
            setShowCancelled(showCancel)

            const _showName = await TicketContract.name()
            setShowName(_showName)

            console.log(showCancel)


        }catch(error){
            console.log(error)
        }
    }

    const displayShow = () =>{
        return(
            <div>
                <h2>Show Name: {showName} </h2>
                <img src={imageUri} alt="nft" className='lrg-thumbnail' />
                <h2>Band/Guest: {band} </h2>
                <h2>Host: {venue} </h2>
                <p>Show Date: {showDate} </p>
                <p>Price: {tixPrice} </p>
                {showCompleted ?<p>Status: Completed</p> : <p>Still Running</p> }
                {showCancelled ?<p>Status: Cancelled</p> : <p></p> }
                <input onChange={e=>setPurchaseAmount(e.target.value)} type="number" placeholder='amount of tickets' />
                <button className='buy-button'>Purchase ticket</button>
        </div>

        )
    }
    
    
    useEffect(()=>{
        checkIfWalletIsConnected()


    },[])
  
  return (
    <div>
        {!band ? <p>loading</p> : displayShow() }
    </div>

    )


}

export default ShowManage