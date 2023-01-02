import React from 'react'
import { useState, useEffect } from 'react'
import { create as ipfsClient} from "ipfs-http-client"
import {ethers} from "ethers"
import env from "react-dotenv";
import { Buffer } from "buffer";
import CREATE_SHOW_ADDRESS from '../addresses/createShow'
import createContractAbi from "../abiAssets/createContractAbi.json"
import ticketAbi from "../abiAssets/ticketAbi.json"
import PROFILECONTRACTADDRESS from '../addresses/ProfileContract';
import profileContractAbi from "../abiAssets/profileContractAbi.json"


const toWeiStr = (num) => ethers.utils.parseEther(num.toString())
const toWeiInt = (num) => ethers.utils.parseEther(num) 
const fromWei = (num) => ethers.utils.formatEther(num)

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

const ViewShows = () => {
    const [allShows, setAllShows] = useState()

    
    const returnAllShows = async () =>{
        const {ethereum} = window;
        const provider = new ethers.providers.Web3Provider(ethereum)

        const CreateShowContract = new ethers.Contract(CREATE_SHOW_ADDRESS, createContractAbi.abi, provider)

        let currentShowNum = await CreateShowContract.showNumber()
        currentShowNum++;
        
        let output = []
        for(let i = 1; i < currentShowNum; i++){
            const show = await CreateShowContract.allShows(i)

            const returnedShow = {
                showNumber: i,
                ShowName: show.showName,
                bandAddress: show.band,
                venueAddress: show.venue,
                ticketAddress: show.ticketAddress,
                escrowAddress: show.escrowAddress,
                showTime: show.showTime.toString(),
                showPrice: fromWei(show.price.toString()),
                image: await _getTicketNFTImage(show.ticketAddress)
            }

            output.push(returnedShow)

            
        }
        setAllShows(output)
        return output
    }

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


    const buyTickets = async (e, ticketAddress, show_name, bandaddy, venueAddy) =>{
        console.log(ticketAddress)
        try{
            const {ethereum} = window;
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()

            const TicketContract = new ethers.Contract(ticketAddress, ticketAbi.abi, signer)

            let baseURI = await TicketContract.baseUri()
            let ticketNumber = await TicketContract._tokenIds()
            let ticketPrice = await TicketContract.ticketPrice()
            ticketPrice= ticketPrice.toString()
            console.log(baseURI)
            console.log(ticketPrice)


            let result = await client.add(JSON.stringify({ShowName: show_name,Band: bandaddy, Venue: venueAddy, TicketNumber: ticketNumber.toString(), image: baseURI  }))

            console.log(`https://cryptix.infura-ipfs.io/ipfs/${result.path}`)

            let txn = await TicketContract.purchaseTickets(1, `https://cryptix.infura-ipfs.io/ipfs/${result.path}`, {value: ticketPrice})
            let res = await txn.wait()

            const currentTix = await TicketContract._tokenIds()
            console.log(currentTix.toString())

            if(res.status === 1){
                console.log("Success")
                
            }else{
                console.log("Failed")
            }

        }catch(error){
            console.log(error)
        }
    }

    const mapShowsToCards = () =>{
        allShows.map((i)=>{
            return(
                <div>
                    <h3>{i["showNumber"]}</h3>
                    <h3>{i["bandAddress"]}</h3>
                    <h3>{i["venueAddress"]}</h3>
                    <h3>{i["ticketAddress"]}</h3>

                </div>
            )
        })
    }


    const _getTicketNFTImage = async (ticketAddress) =>{

        const {ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum)
        const TicketContract = new ethers.Contract(ticketAddress, ticketAbi.abi, provider)

        let ticketUri = await TicketContract.baseUri()
        

        let response = await fetch(ticketUri)
        
        let url = response.url;

        return url

    }

    const addToMyTickets = async (e, ticketAddress) =>{
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const ProfileContract = new ethers.Contract(PROFILECONTRACTADDRESS, profileContractAbi.abi, signer)
    
        let tx, res
    
        tx = await ProfileContract.setPurchasedShow(ticketAddress)
        res = await tx.wait()
    
        if(res.status ===1 ){
          alert("Successfully Added")
        } else{
          alert("failed")
        }
    
      }


    useEffect(()=>{
        returnAllShows()
    },[])


  return (
    <div>
        <div>
            <h2>View Shows</h2>
        </div>
        <div className='view-shows-div'>
        {!allShows ? <p>Loading Blockchain Data</p> :( allShows.map((i)=>{
            return(
                <div className='border-radius-outline show-card' key ={i["showNumber"]}>
                    <h4>Show Name: {i["ShowName"]}</h4>
                    <img className='thumbnail' src={i["image"] } alt="tickets" />

                    <p>Band: {i["bandAddress"].slice(0, 6)}...{i["bandAddress"].slice(-6)}</p>
                    <p>Venue: {i["venueAddress"].slice(0, 6)}...{i["venueAddress"].slice(-6)}</p>
                    <p>Tickets: {i["ticketAddress"].slice(0, 6)}...{i["ticketAddress"].slice(-6)}</p>
                    <p>Price: {i["showPrice"]}</p>

                    {/* <h4>Date: {displayShowDate(i["showTime"])}</h4> */}
                    {displayShowDate(i['showTime'])}

                    <button value={i} onClick={e=>buyTickets(e.target.value, i["ticketAddress"], i["ShowName"], i["bandAddress"], i["venueAddress"])} >Buy Ticket</button>
                    <button value={i} onClick={e=>addToMyTickets(e, i["ticketAddress"])}>Add to MyTix</button>
                </div>
            )
        })) }
           
        </div>
    </div>
  )
}

export default ViewShows