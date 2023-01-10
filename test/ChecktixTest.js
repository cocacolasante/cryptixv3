const { expect } = require("chai");
const {ethers} = require("hardhat")
const checkInAbi = require("./testAbi/CheckinAbi.json")

const nullAddress = "0x0000000000000000000000000000000000000000"

describe("Manage and Check Tix", () =>{
    let Cryptix, CheckTix, deployer, user1, user2, user3, escrow, band, venue

    beforeEach(async () =>{
        const accounts = await ethers.getSigners()

        deployer = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]
        user3 = accounts[3]
        escrow = accounts[4]
        band = accounts[5]
        venue = accounts[6]

        const cryptixContractFactory = await ethers.getContractFactory("Cryptickets")
        Cryptix = await cryptixContractFactory.deploy("testing name", "tsm", escrow.address, band.address, deployer.address, 100, 1)
        await Cryptix.deployed()

        const checkTixContractFactory = await ethers.getContractFactory("CheckTix")
        CheckTix = await checkTixContractFactory.deploy(Cryptix.address)
        await CheckTix.deployed()

        // console.log(`Cryptix deployed ${Cryptix.address}`)
        // console.log(`Check Tix deployed ${CheckTix.address}`)

    })
    it("checks the validator and tix contract", async () =>{
        expect(await CheckTix.validator()).to.equal(deployer.address)
        expect(await CheckTix.ticketContract()).to.equal(Cryptix.address)
    })
    it("checks the checkin function reverted w does not exist", async () =>{
        await expect( CheckTix.connect(deployer).checkInNft(1)).to.be.revertedWith("ticket does not exist")
    })
    it("checks the check in function", async () =>{
        await Cryptix.connect(user1).purchaseTickets(1, "SAMPLEURI", {value: 1})
        await CheckTix.connect(deployer).checkInNft(1)
        expect(await CheckTix.checkedIn(1)).to.equal(true)
        
    })
    describe("manage/create check in contract", () =>{
        let ManageTix, checkInStruct, CheckInContract
        beforeEach(async () =>{
            const manageTixContractFactory = await ethers.getContractFactory("ManageCheckTix")
            ManageTix = await manageTixContractFactory.deploy()
            await ManageTix.deployed()

            await ManageTix.connect(deployer).createCheckIn(Cryptix.address)

            checkInStruct = await ManageTix.tixToCheckIn(Cryptix.address)
            CheckInContract = new ethers.Contract(checkInStruct.checkInContract, checkInAbi.abi, ethers.provider)

            
        })
        it("checks the admin was changed", async () =>{
            expect(await CheckInContract.validator()).to.equal(deployer.address)
        })
        
    })
})