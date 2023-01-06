import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import {Link } from "react-router-dom"
import { networks } from '../networkutils/networks';

const Navbar = () => {
    const [activeAccount, setActiveAccount] = useState()
    const [ network, setNetwork] = useState()

    const connectWallet = async () =>{
        try{
            const {ethereum} = window;
            if(!ethereum){
                alert("please install metamask")
                return;
            }
            const accounts = await ethereum.request({method:"eth_requestAccounts"})
            const account = accounts[0]
            setActiveAccount(account)


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

            }
            const chainId = await ethereum.request({method: "eth_chainId"})

            setNetwork(networks[chainId])

            ethereum.on('chainChanged', handleChainChanged);

            function handleChainChanged(_chainId) {
                window.location.reload();
            }


        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        checkIfWalletIsConnected();
    },[])


  return (
    <div className=''>
        

        <div className='navbar-div top-div-container'>
            <h2 className='logo-div'>Cryptix</h2>
            <div className='' >
                <ul className='router-links'>
                    <Link to="/" className='router-link'>Home</Link>
                    <Link to="/browse" className='router-link'>Browse Shows</Link>
                    <Link to="/managetix" className='router-link'>Manage Tickets</Link>
                    <Link to="/manage" className='router-link'>Manage Events</Link>
                    <Link to='/createshow' className='router-link'>Create Show</Link>
                    <Link to='/profile' className='router-link'>Profile</Link>
                </ul>
            </div>
            <div className='connect-div'>
            {network !== "Polygon Mumbai Testnet" ? <p>Please connect to mumbai testnet</p> : !activeAccount ? <button className='buy-button' onClick={connectWallet}>Connect Wallet</button> : <p>{activeAccount.slice(0, 6)}...{activeAccount.slice(-4)} </p>}

            </div>
        </div>
        <Outlet />
        <div className='footer-container'>
            <ul className='router-links-bottom'>
                <Link to="/" className='router-link-bottom'>Home</Link>
                <Link to="/browse" className='router-link-bottom'>Browse Shows</Link>
                <Link to="/manageshows" className='router-link-bottom'>Manage Tickets/Shows</Link>
                <Link to='/createshow' className='router-link-bottom'>Create Show</Link>
                <Link to='/profile' className='router-link-bottom'>Profile</Link>
            </ul>
            <p className='footer-tm'>Created by Cocacolasante</p>
        </div>
    </div>
  )
}

export default Navbar