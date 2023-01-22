import React from 'react'
import { Network, Alchemy } from "alchemy-sdk";
import { useState, useEffect } from 'react';
import CREATEPROFNFTADDRESS from '../addresses/CreateProfileNFT';
import env from "react-dotenv";
import ProfileNFTCard from './ProfileNFTCard';



const settings = {
    apiKey: env.ALCHEMY_MUMBAI_APIKEY, // Replace with your Alchemy API Key.
    network: Network.MATIC_MUMBAI, // Replace with your network.
  };

const alchemy = new Alchemy(settings);

const ProfileNFTs = () => {
    const [allProfileNFTs, setAllProfileNFTs] = useState()
    const [activeAccount, setActiveAccount] = useState()


    const displayProfileNfts = () =>{

        return(
            allProfileNFTs["ownedNfts"].map((i) =>{
                return(
                    <ProfileNFTCard id={i["tokenId"]} />
                    )
            })
        )
    }

    const getProfileNfts = async () =>{
        const profileNfts = await alchemy.nft.getNftsForOwner(activeAccount, {
            contractAddresses: [CREATEPROFNFTADDRESS],
        }).then(console.log);
        

        setAllProfileNFTs(profileNfts)
    }

    const checkIfWalletIsConnected = async () =>{
        try{
            const {ethereum} = window;
            if(!ethereum){
                alert("Please install metamask extension")
                return;
            }else{
                console.log("Ethereum Detected")

            }
            const accounts = await ethereum.request({method: "eth_accounts"})
            if(accounts.length !== 0 ){
                setActiveAccount(accounts[0]);
                console.log(`connected to ${activeAccount}`)

               

            }



        }catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
        checkIfWalletIsConnected()
    },[])
    useEffect(()=>{
        getProfileNfts()
    },[activeAccount])

  return (
    <div>
        {!allProfileNFTs ? <p>Loading</p> : displayProfileNfts() }
    </div>
  )
}

export default ProfileNFTs