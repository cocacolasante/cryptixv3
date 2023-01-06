import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import profileAbi from "../abiAssets/profileContractAbi.json"
import PROFILECONTRACTADDRESS from '../addresses/ProfileContract';


const CurrentUser = () => {
    const [activeAccount, setActiveAccount] = useState()
    const [userName, setUsername] =useState()
    const [status, setStatus] =useState()
    const [profileNft, setProfileNft] =useState()
    const [userStruct, setUserStruct] = useState()



    const returnUserProfile = async (userAddress) =>{
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const ProfileContract = new ethers.Contract(PROFILECONTRACTADDRESS, profileAbi.abi, provider)

            const currentUserStruct = await ProfileContract.users(activeAccount)
            console.log(currentUserStruct)
            setUserStruct(currentUserStruct)



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

    </div>
  )
}

export default CurrentUser