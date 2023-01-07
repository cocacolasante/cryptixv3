import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import profileAbi from "../abiAssets/profileContractAbi.json"
import PROFILECONTRACTADDRESS from '../addresses/ProfileContract';

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

    const checkForUserProfile = () =>{
        if(userStruct["user"] === nullAddress){
            return(
                <div>
                    <p>Please Create Account</p>
                    <input type="text" onChange={e=>setUsername(e.target.value)} placeholder='enter user name' require />
                    <input type="text" onChange={e=>setStatus(e.target.value)} placeholder='status message' require />
                    <button onClick={createProfile} className='buy-button' >Create Profile</button>
                </div>
            )
        } else{
            return (
                <div>
                    <p>Username: {userStruct["username"]}</p>
                    <p>Current Status: {userStruct["statusMessage"]}</p>
                    
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
    <div>
        <h2>Current User</h2>
        {/* create if statement for uesr address === null address to prompt a create user profile */}
        {!userStruct ? <p>Please connect wallet</p> : checkForUserProfile() }

    </div>
  )
}

export default CurrentUser