import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import env from "react-dotenv";
import {ethers} from "ethers"
import ticketAbi from "../abiAssets/ticketAbi.json"
import managecheckInAddress from '../addresses/managecheckin';
import managecheckinAbi from "../abiAssets/ManagecheckInAbi.json"
import DisplayTicketCard from './DisplayTicketCard';


const settings = {
    apiKey: env.ALCHEMY_MUMBAI_APIKEY, 
    network: Network.MATIC_MUMBAI,
  };

const alchemy = new Alchemy(settings);

const ViewMyTickets = () => {
    const params = useParams();

    const [tickets, setTickets] = useState()
    const [activeAccount, setActiveAccount] = useState()
    const [imageUri, setImageUri ] = useState()

    const [checkInAddress, setCheckInAddress ] = useState()


    const displayCard = () =>{
        return (tickets["ownedNfts"].map((i)=>{
            return(
                <DisplayTicketCard key={i["tokenId"]} tokenId={i["tokenId"]} checkInAddress={checkInAddress} imgurl={imageUri} ticketId={i["tokenId"]} />
            )
        }))
    }

    const getCheckInContract = async () =>{
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)

            const ManageCheckInContract = new ethers.Contract(managecheckInAddress, managecheckinAbi.abi, provider)

            const checkinStruct = await ManageCheckInContract.tixToCheckIn(params.address)

            console.log(checkinStruct)

            setCheckInAddress(checkinStruct["checkInContract"]) 

        }catch(err){
            console.log(err)
        }
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
        getCheckInContract()
    },[])

    useEffect(()=>{
        getTicketNfts()
        _getTicketNFTImage()
       
    },[activeAccount])

  return (
    <div className='home-container'>
        <h2>Purchased Tickets</h2>

    <div className='view-my-tix-div'>
        {!tickets ? <p> loading</p> : displayCard()}
    </div>
   
    </div>
  )
}


export default ViewMyTickets