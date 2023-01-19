import React from 'react'

const ProfileNFTCard = (props) => {
  return (
    <div>
        <h2>Token Id{props.id}</h2>
        <p>Contract Address{props.address}</p>
        <img src={props.uri}  alt='profile nfts'/>
    </div>
  )
}

export default ProfileNFTCard