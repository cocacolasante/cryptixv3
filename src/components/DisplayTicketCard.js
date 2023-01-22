import { useState, useEffect } from "react"
import checkInAbi from "../abiAssets/checkinAbi.json"
import managecheckInAddress from '../addresses/managecheckin';
import managecheckinAbi from "../abiAssets/ManagecheckInAbi.json"
import {ethers} from "ethers"


const DisplayTicketCard = (props) => {


    const [checkedIn, setCheckedIn] = useState()

    const viewCheckedIn = async () =>{
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const CheckInContract = new ethers.Contract(props.checkInAddress, checkInAbi.abi, provider )

            const checkRedeemed = await CheckInContract.viewCheckedIn(props.ticketId)

            setCheckedIn(checkRedeemed)

            console.log(checkRedeemed)

            
            

            
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        viewCheckedIn()
    },[])

  return (
        <div key={props.tokenId} className='view-ticket-card border-radius-outline'>
            <h4>Ticket Number: {props.tokenId} </h4>
            <img src={props.imgurl} alt="nft ticket art" className='thumbnail' />
            <p>Redeemed: {!checkedIn ? <>False</> : <>True</>}</p>
    </div>
  )
}

export default DisplayTicketCard