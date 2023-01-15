
const { ethers } = require("hardhat");
const hre = require("hardhat");

const PROFILECONTRACTADDRESS = "0x541BAF25bB1BCa078b369b4A0E3756Ab738D67b0"



async function main() {

  
  const createProfileNftFactory = await hre.ethers.getContractFactory("CreateProfileNFT")
  const CreateProfileNft = await createProfileNftFactory.deploy(PROFILECONTRACTADDRESS)
  await CreateProfileNft.deployed()
  
  console.log(`Create Profile Contract Deployed to ${CreateProfileNft.address}`)
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
