
const { ethers } = require("hardhat");
const hre = require("hardhat");



async function main() {


  const profileContractFactory = await hre.ethers.getContractFactory("Profile")
  const ProfileContract = await profileContractFactory.deploy()
  await ProfileContract.deployed()

  console.log(`Profile Contract Deployed to ${ProfileContract.address}`)
  
  const createProfileNftFactory = await hre.ethers.getContractFactory("Profile")
  const CreateProfileNft = await createProfileNftFactory.deploy()
  await CreateProfileNft.deployed()
  
  console.log(`Create Profile Contract Deployed to ${CreateProfileNft.address}`)
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
