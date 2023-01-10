import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {ethers} from "ethers"
import ticketAbi from "../abiAssets/ticketAbi.json"
import env from "react-dotenv";
import { Buffer } from "buffer";
import { create as ipfsClient} from "ipfs-http-client"
import PROFILECONTRACTADDRESS from '../addresses/ProfileContract';
import profileContractAbi from "../abiAssets/profileContractAbi.json"
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { TwitterShareButton, TwitterIcon } from 'react-share';
import { LinkedinShareButton, LinkedinIcon } from 'react-share';

const ShowManage = () => {
    const nullAddress = "0x0000000000000000000000000000000000000000"
    
    const auth =
      'Basic ' + Buffer.from(env.PROJECT_ID + ':' + env.PROJECT_CODE).toString('base64');
    
    const client = ipfsClient({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: auth,
            },
        });
    
    const toWeiStr = (num) => ethers.utils.parseEther(num.toString())
    const toWeiInt = (num) => ethers.utils.parseEther(num) 
    const fromWei = (num) => ethers.utils.formatEther(num)
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

    const[tixSold, setTixSold] = useState()
    const [maxAvail, setMaxAvail] = useState()


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
    const buyTickets = async () =>{
        try{
            const {ethereum} = window;
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()

            const TicketContract = new ethers.Contract(params.address, ticketAbi.abi, signer)

            let baseURI = await TicketContract.baseUri()
            let ticketNumber = await TicketContract._tokenIds()
            let ticketPrice = await TicketContract.ticketPrice()
            ticketPrice= ticketPrice.toString()

            console.log(baseURI)
            console.log(ticketPrice)
            let result = await client.add(JSON.stringify({ShowName: showName, Band: band, Venue: venue, TicketNumber: ticketNumber.toString(), image: baseURI  }))

            console.log(`https://cryptix.infura-ipfs.io/ipfs/${result.path}`)


            let txn = await TicketContract.purchaseTickets(1, `https://cryptix.infura-ipfs.io/ipfs/${result.path}`, {value: ticketPrice})
            let res = await txn.wait()


            
            if(res.status === 1){
                console.log("Success")
                
            }else{
                console.log("Failed")
            }

            const ProfileContract = new ethers.Contract(PROFILECONTRACTADDRESS, profileContractAbi.abi, signer)

    
            txn = await ProfileContract.setPurchasedShow(params.address)
            res = await txn.wait()
        
            if(res.status === 1 ){
                alert("Successfully Added")
            } else{
                alert("failed")
            }
    
            

        }catch(err){
            console.log(err)
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
            // get ticket information
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const TicketContract = new ethers.Contract(params.address, ticketAbi.abi, provider)

            const bandAddress = await TicketContract.bandAddress()
            setBand(bandAddress)

            const venueAddress = await TicketContract.venueAddress()
            setVenue(venueAddress)

            let ticketPrice = await TicketContract.ticketPrice()
            ticketPrice = ticketPrice.toString()
            ticketPrice = fromWei(ticketPrice)
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

            let ticketNumber = await TicketContract._tokenIds()
            ticketNumber = ticketNumber.toString()
            setTixSold(ticketNumber)

            let maxSup = await TicketContract.maxSupply()
            maxSup = maxSup.toString()
            setMaxAvail(maxSup)

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

            console.log(bandStruct)


            


        }catch(error){
            console.log(error)
        }
    }
    
    const displayShowStatus = () =>{
        if(showCompleted){
            return(
                <p>Status: Completed</p>
            )
        }else if(showCancelled){
            return(
                <p>Status: Cancelled</p>
            )
        }else{
            return(
                <p>Status: Still Running</p>
            )
        }
    }

    const displayShow = () =>{
        return(
            <div className='border-radius-outline view-lrg-show-card'>
                <h2>Show Name: {showName} </h2>
                <img src={imageUri} alt="nft" className='lrg-thumbnail' />
                <h2>Band/Guest: {band} </h2>
                <h2>Host: {venue} </h2>
                <p>Show Date: {displayShowDate(showDate)} </p>
                <p>Price: {(tixPrice)} Matic</p>
                <p>Number of Tickets Sold: {tixSold} </p>
                <p>Total Amount of Tickets Available: {maxAvail} </p>
                {displayShowStatus()}

                <button onClick={buyTickets} className='buy-button'>Purchase ticket</button>
                <br />

                <button className='buy-button' >Share Event</button>
                <div>
                    <FacebookShareButton
                        url={`https://plain-butterfly-8263.on.fleek.co/#/browse/${params.address}`}
                        quote={'Check out this event! Buy Your NFT Ticket Today!'}
                        hashtag="#muo"
                    >
                    <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton
                        url={`https://plain-butterfly-8263.on.fleek.co/#/browse/${params.address}`}
                        quote={'Dummy text!'}
                        hashtag="#muo"
                    >
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <LinkedinShareButton
                        url={`https://plain-butterfly-8263.on.fleek.co/#/browse/${params.address}`}
                        quote={'Dummy text!'}
                        hashtag="#muo"
                    >
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                </div>
        </div>

        )
    }
    
    
    useEffect(()=>{
        checkIfWalletIsConnected()


    },[])
  
  return (
    <div className='home-container'>
        {!band ? <p>loading</p> : displayShow() }
    </div>

    )


}

export default ShowManage