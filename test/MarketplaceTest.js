const { expect } = require("chai");
const {ethers} = require("hardhat")

describe("Marketplace Contract", () =>{
    let Marketplace, Cryptix, deployer, user1, user2, user3, artist, escrow

    const SAMPLEURI = "SAMPLEURI"

    beforeEach(async () =>{
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]
        user3 = accounts[3]
        artist = accounts[4]
        escrow = accounts[5]

        const cryptixContractFactory = await ethers.getContractFactory("Cryptickets")
        Cryptix = await cryptixContractFactory.deploy("testing name", "tsm", escrow.address, artist.address, deployer.address, 100, 1)
        await Cryptix.deployed()

        // console.log(`Cryptix deployed to ${Cryptix1.address}`)

        const marketplaceContractFactory = await ethers.getContractFactory("CryptixMarketplace")
        Marketplace = await marketplaceContractFactory.deploy()
        await Marketplace.deployed()

        // console.log(`Marketplace deployed ${Marketplace.address}`)

    })
    it("checks the marketplace admin", async () =>{
        expect(await Marketplace.admin()).to.equal(deployer.address)
        expect(await Cryptix.admin()).to.equal(deployer.address)
    })
    describe("Listing function", () =>{
        beforeEach(async () =>{
            await Cryptix.connect(user1).purchaseTickets(1, "SAMPLEURI", {value: "10"})
        })
        it("checks the purchase ticket function", async () =>{
            await Cryptix.connect(user2).purchaseTickets(1, SAMPLEURI, {value: "1"})
            expect(await Cryptix.balanceOf(user2.address)).to.equal(1)
        })
        it("checks the listing function", async () =>{
            await Cryptix.connect(user1).approve(Marketplace.address, 1)
            await Marketplace.connect(user1).listTicket(Cryptix.address, 1, 2)
            expect(await Cryptix.ownerOf(1)).to.equal(Marketplace.address)
        })
        it("checks the cancel listing function was transferred back to owner", async () =>{
            await Cryptix.connect(user1).approve(Marketplace.address, 1)
            await Marketplace.connect(user1).listTicket(Cryptix.address, 1, 2)
            expect(await Cryptix.ownerOf(1)).to.equal(Marketplace.address)
            
            await Marketplace.connect(user1).cancelListing(1)
            expect(await Cryptix.ownerOf(1)).to.equal(user1.address)


        })
    })
})