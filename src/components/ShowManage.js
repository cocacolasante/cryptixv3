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
            const venue = await TicketContract.venueAddress()
            

        }catch(error){
            console.log(error)
        }
    }
    
    
    useEffect(()=>{
    checkIfWalletIsConnected()


    },[])
  
  return (
    <div>
        <h2>Show Name: </h2>
        <img src={imageUri} alt="nft" className='lrg-thumbnail' />
        <h2>Band/Guest: </h2>
        <p>Show Date</p>
        <p>Price</p>
        <button>Purchase ticket</button>
    </div>
  )
}

export default ShowManage