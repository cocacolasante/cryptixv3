import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import env from "react-dotenv";
import {ethers} from "ethers"
import ticketAbi from "../abiAssets/ticketAbi.json"





const settings = {
    apiKey: env.ALCHEMY_MUMBAI_APIKEY, // Replace with your Alchemy API Key.
    network: Network.MATIC_MUMBAI, // Replace with your network.
  };

const alchemy = new Alchemy(settings);

const ViewMyTickets = () => {
    const params = useParams();

    const [tickets, setTickets] = useState()
    const[activeAccount, setActiveAccount] = useState()
    const [imageUri, setImageUri ] = useState()


    // USE CREATOR CONTRACT TO SEARCH BY TICKETS ADDRESS PARAMS.ADDRESS TO REVERSE SEARCH UP THE CHECK TIX CONTRACT

    


    const displayTickets = () =>{
        return (tickets["ownedNfts"].map((i)=>{
            console.log(i)
            return(
                <div className='view-ticket-card'>
                    <h4>Ticket Number: {i["tokenId"]} </h4>
                    <img src={imageUri} alt="nft ticket art" className='thumbnail' />
                    <p>Redeemed: {}</p>
                    <button className='buy-button' onClick={null} >Redeem</button>
                    <button className='buy-button' onClick={null} >List for sale (coming soon)</button>
                </div>
            )
        }))
    }

    const getTicketNfts = async () =>{

        const profileNfts = await alchemy.nft.getNftsForOwner(activeAccount, {
            contractAddresses: [params.address],
        })
        
        setTickets(profileNfts)

        return profileNfts
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
    },[])

    useEffect(()=>{
        getTicketNfts()
        _getTicketNFTImage()
    },[activeAccount])

  return (
    <div className='home-container'>
        <h2>View My Tickets</h2>

    <div className='view-my-tix-div'>
        {!tickets ? <p> loading</p> : displayTickets()}
    </div>
    </div>
  )
}


export default ViewMyTickets