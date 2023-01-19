import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import profileAbi from "../abiAssets/profileContractAbi.json"
import PROFILECONTRACTADDRESS from '../addresses/ProfileContract';
import MintProfileNFT from './MintProfileNFT';
import ProfileNFTs from './ProfileNFTs';

const nullAddress = "0x0000000000000000000000000000000000000000"

const CurrentUser = () => {
    const [activeAccount, setActiveAccount] = useState()
    const [userName, setUsername] =useState()
    const [status, setStatus] =useState()
    const [profileNft, setProfileNft] =useState()
    const [userStruct, setUserStruct] = useState()


    const createProfile = async () =>{
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const ProfileContract = new ethers.Contract(PROFILECONTRACTADDRESS, profileAbi.abi, signer)

            let txn, res 

            txn = await ProfileContract.createProfile(userName, status)
            res = await txn.wait()

            if(res.status === 1){
                alert("Profile created")
            }else{
                console.log("failed")
            }


        }catch(error){
            console.log(error)
        }
    }

    const updateUsername = async () =>{
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const ProfileContract = new ethers.Contract(PROFILECONTRACTADDRESS, profileAbi.abi, signer)

            let txn, res 

            txn = await ProfileContract.setUsername(userName)
            res = await txn.wait()

            if(res.status === 1){
                alert("Profile created")
            }else{
                console.log("failed")
            }


        }catch(error){
            console.log(error)
        }
    }
    const updateStatus = async () =>{
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const ProfileContract = new ethers.Contract(PROFILECONTRACTADDRESS, profileAbi.abi, signer)

            let txn, res 

            txn = await ProfileContract.setMessage(status)
            res = await txn.wait()

            if(res.status === 1){
                alert("Profile created")
            }else{
                console.log("failed")
            }


        }catch(error){
            console.log(error)
        }
    }

    const returnUserProfile = async (account) =>{
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const ProfileContract = new ethers.Contract(PROFILECONTRACTADDRESS, profileAbi.abi, provider)

            const currentUserStruct = await ProfileContract.users(account)
            console.log(currentUserStruct)
            setUserStruct(currentUserStruct)



        }catch(error){
            console.log(error)
        }
    }

    const displayCurrentNFT = () =>{
        if(userStruct["profileNFT"]=== nullAddress){
            return(
               <p>No Profile NFT Selected</p>
            )
        }else{
            return(
                <>
                    <p>{userStruct["profileNFT"] }</p>
                </>
            )
        }
    }

    const checkForUserProfile = () =>{
        if(userStruct["user"] === nullAddress){
            return(
                <div className='create-show-div border-radius-outline'>
                    <p>Please Create Account</p>
                    <input type="text" onChange={e=>setUsername(e.target.value)} placeholder='enter user name' required />
                    <input type="text" onChange={e=>setStatus(e.target.value)} placeholder='status message' required />
                    <button onClick={createProfile} className='buy-button' >Create Profile</button>
                </div>
            )
        } else{
            return (
                <div className='home-container'>
                    <p>Username: {userStruct["username"]}</p>
                    <p>Current Status: {userStruct["statusMessage"]}</p>

                    {displayCurrentNFT()}


                    <input type="text" onChange={e=>setUsername(e.target.value)} placeholder='enter user name'  />
                    <button onClick={updateUsername} className='buy-button' >Update Username</button>

                    <input type="text" onChange={e=>setStatus(e.target.value)} placeholder='status message'  />
                    <button onClick={updateStatus} className='buy-button' >Update Status</button>

                    <MintProfileNFT />
                </div>
            )
        }
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


                returnUserProfile(accounts[0])


            }



        }catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
        checkIfWalletIsConnected()
    },[])

  return (
    <div className='home-container'>
        <h2>Current User</h2>
        {/* create if statement for uesr address === null address to prompt a create user profile */}
        {!userStruct ? <p>Please connect wallet</p> : checkForUserProfile() }

        <ProfileNFTs />

    </div>
  )
}

export default CurrentUser