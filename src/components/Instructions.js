import React from 'react'

const Instructions = () => {
  return (
    <div className='border-radius-outline instruct-div'>
        
        <div className='instruction-header-div'>
            <h2 className='instructions-header'>Instructions</h2>

        </div>
    <div className='instruction-div'>
        <p>If you need any help, please follow these step by step instructions</p>
        <ol>
            <li>Enter in all the information for your event</li>
                <ul>
                    <li>Show Name</li>
                    <li>NFT Ticket Symbol</li>
                    <li>Band/Guest Speaker (if none, please enter your own wallet address)</li>
                    <li>Venue/host Address</li>
                    <li>Show Date</li>
                    <li>Show Price</li>
                    <li>Max Tickets</li>
                </ul>
            <li>Click Create Show</li>
            <li>Accept the following 3 transactions</li>
                <ol>
                    <li>First transaction creates the show contracts</li>
                    <li>Second transaction sets the max supply</li>
                    <li>Third transaction adds the event to your profile to manage later</li>
                </ol>
            <li>Upload an image for your NFT ticket artwork</li>
            <li>Accept the last transaction to set the ticket nft artwork</li>
        </ol>
    </div>
    </div>

  )
}

export default Instructions