import { useState, useEffect } from 'react'
import { create as ipfsClient} from "ipfs-http-client"
import {ethers} from "ethers"
import env from "react-dotenv";
import { Buffer } from "buffer";
import CREATE_SHOW_ADDRESS from '../addresses/createShow'
import createContractAbi from "../abiAssets/createContractAbi.json"
import ticketAbi from "../abiAssets/ticketAbi.json"

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


const UpcomingEvents = () => {
  const [upcomingShows, setUpcomingShows] = useState()

  const returnUpcomingShows = async () =>{
    try {
      const {ethereum} = window;
      if(ethereum){
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
        output.sort((a,b) =>{
          return a.showTime - b.showTime
        })

        console.log(output)
        setUpcomingShows(output)

        return output
      }

    }catch(error){
      console.log(error)
    }
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

const displayEventCard = () =>{
  return(
    upcomingShows.map((i)=>{
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

          </div>
      )
  })
  )
}

useEffect(()=>{
  returnUpcomingShows()
},[])

  return (
    <div className=''>
        {!upcomingShows ? <h3>loading blockchain data</h3> : displayEventCard()}
    </div>
  )
}

export default UpcomingEvents