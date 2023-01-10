
const { ethers } = require("hardhat");
const hre = require("hardhat");

// create the check in ticket deployer contract


async function main() {
  const manageTixContractFactory = await hre.ethers.getContractFactory("ManageCheckTix")
  const ManageTix = await manageTixContractFactory.deploy()
  await ManageTix.deployed()

  console.log(`Manage Tix Deployed to ${ManageTix.address}`)




}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
