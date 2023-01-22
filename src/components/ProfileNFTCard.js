import React from 'react'
import {ethers} from "ethers"
import ticketAbi from "../abiAssets/ticketAbi.json"
import { useState, useEffect } from "react";



const ProfileNFTCard = (props) => {
  const [imageUri, setImageUri] = useState()

  const _getTicketNFTImage = async () =>{

    const {ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum)
    const TicketContract = new ethers.Contract(props.address, ticketAbi.abi, provider)

    let ticketUri = await TicketContract.baseUri()
    

    let response = await fetch(ticketUri)
    
    let url = response.url;
    setImageUri(url)

    return url

}

useEffect(()=>{
  _getTicketNFTImage()
},[])
  return (
    <div>
        <h2>Token Id{props.id}</h2>
        <p>Contract Address{props.address}</p>
        <img src={imageUri}  alt='profile nfts'/>
    </div>
  )
}

export default ProfileNFTCard