import { ethers } from 'ethers'
import { create as ipfsClient} from "ipfs-http-client"
import { useState, useEffect } from 'react'
import env from "react-dotenv";
import { Buffer } from "buffer";
import createNftProfAbi from "../abiAssets/createProfNFT.json"
import CREATEPROFNFTADDRESS from '../addresses/CreateProfileNFT';
import PROFILECONTRACTADDRESS from '../addresses/ProfileContract';
import profileAbi from "../abiAssets/profileContractAbi.json"




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


const MintProfileNFT = () => {
    const [imageToMint, setImageToMint] = useState()

    const uploadToIPFS = async (e) =>{
        e.preventDefault()
        const files = e.target.files;

        if (!files) {
            return alert("No files selected");
          }

        const file = e.target.files[0]

        try{
            const result = await client.add(file)

            // create json nft meta data with ticketnftart as image meta data with ticket number aand other meta data

            setImageToMint(`https://cryptix.infura-ipfs.io/ipfs/${result.path}`)

            console.log(`https://cryptix.infura-ipfs.io/ipfs/${result.path}`)

            
            await mintProfileImage(`https://cryptix.infura-ipfs.io/ipfs/${result.path}`)
            



        }catch(error){
            console.log(error)
        }
    }

    const mintProfileImage = async (tokenUri) =>{
        try{
            let txn, res
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const NFTProfileMint = new ethers.Contract(CREATEPROFNFTADDRESS, createNftProfAbi.abi, signer )


            txn = await NFTProfileMint.makeNFT(tokenUri)
            res = await txn.wait()
            


            if(res.status === 1){
                console.log("success")
                alert("Success")
            }else{
                console.log("failed")
            }


        }catch(err){
            console.log(err)
        }
    }



  return (
    <div>
        <h2>Mint Your Profile NFT Here!</h2>

        <input type="file" placeholder='upload profile nft' onChange={uploadToIPFS} />

    </div>
  )
}

export default MintProfileNFT