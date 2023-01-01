const { expect } = require("chai");
const {ethers} = require("hardhat")

describe("PRofile Contract", () =>{
    const SAMPLE_URI = "SAMPLEURI"
    let ProfileContract, deployer, user1, user2, user3, CreateProfileContract, EscrowContract, CryptixNFTContract, band, venue
    beforeEach(async () =>{
        const accounts = await ethers.getSigners()

        deployer = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]
        user3 = accounts[3]
        band = accounts[4]
        venue = accounts[5]
        

        const profileContractFactory = await ethers.getContractFactory("Profile")
        ProfileContract = await profileContractFactory.deploy()
        ProfileContract.deployed()

        const createProfileContractFactory = await ethers.getContractFactory("CreateProfileNFT")
        CreateProfileContract = await createProfileContractFactory.deploy()
        await CreateProfileContract.deployed()

        const escrowContractFactory = await ethers.getContractFactory("Escrow")
        EscrowContract = await escrowContractFactory.deploy()
        await EscrowContract.deployed()

        const cryptixContractFactory = await ethers.getContractFactory("Cryptickets")
        CryptixNFTContract = await cryptixContractFactory.deploy("Test1", "tst1", EscrowContract.address, band.address, venue.address, 1000, 100)
        await CryptixNFTContract.deployed()

        await EscrowContract.connect(deployer).setTicketContract(CryptixNFTContract.address);



    })
    it("checks the create profile function", async () =>{
        await ProfileContract.connect(user1).createProfile("cocacolasante")
        const user1Profile = (await ProfileContract.users(user1.address))
        expect(user1Profile.user).to.equal(user1.address)
        expect(user1Profile.username).to.equal("cocacolasante")
    })
    it("checks the nft minting function", async () =>{
        await CreateProfileContract.connect(user1).makeNFT(SAMPLE_URI)
        expect(await CreateProfileContract.balanceOf(user1.address)).to.equal(1)
        expect(await CreateProfileContract.tokenURI(1)).to.equal(SAMPLE_URI)
    })
    it("checks the set profile nft function", async () =>{
        await CreateProfileContract.connect(user1).makeNFT(SAMPLE_URI)
        await ProfileContract.connect(user1).createProfile("cocacolasante")

        await ProfileContract.connect(user1).setProfileNFt(CreateProfileContract.address, 1)
        const user1Profile = (await ProfileContract.users(user1.address))
        expect(user1Profile.profileNFT).to.equal(CreateProfileContract.address)
        expect(user1Profile.tokenId).to.equal(1)

    })
    describe("Profile Setting Functions", () =>{
        beforeEach(async () =>{
            await CreateProfileContract.connect(user1).makeNFT(SAMPLE_URI)
            await ProfileContract.connect(user1).createProfile("cocacolasante")
    
            await ProfileContract.connect(user1).setProfileNFt(CreateProfileContract.address, 1)
    

        })
        it("checks the set message function", async () =>{
            await ProfileContract.connect(user1).setMessage("Hello There")
            const user1Profile = (await ProfileContract.users(user1.address))
            expect(user1Profile.statusMessage).to.equal("Hello There")

            
        })
        it("checks the set shows function", async () =>{
            await ProfileContract.connect(user1).setPurchasedShow("0xDb157145A5A8Cd553F86c30516AF373a78a47Bbf")

            expect(await ProfileContract.purchasedShows(user1.address, 0)).to.equal("0xDb157145A5A8Cd553F86c30516AF373a78a47Bbf")

        })
        it("checks the return all shows function", async () =>{
            await ProfileContract.connect(user1).setPurchasedShow("0xDb157145A5A8Cd553F86c30516AF373a78a47Bbf")
            await ProfileContract.connect(user1).setPurchasedShow("0x9E2e3A8295bDe588030B734eB471600154B8678e")
            const user1Shows = await ProfileContract.returnAllUsersShows(user1.address)
            console.log(user1Shows)

        })
        // it("checks the show was added to hte profile on purchase", async () =>{
        //     await CryptixNFTContract.connect(user1).purchaseTickets(1, SAMPLE_URI, {value: 100})
        //     expect(await ProfileContract.purchasedShows(user1.address, 0)).to.equal(CryptixNFTContract.address)
            
        // })
    })
    
})