const {ethers} = require("hardhat");
const {expect} = require("chai");


const DeployFixture = async () => {
    const [signer] = await ethers.getSigners();
    const TestNFTContract = await ethers.getContractFactory("TestERC721");
    const testNFTContract = await TestNFTContract.deploy();

    const NFTBatchTransfer = await ethers.getContractFactory("NFTBatchTransfer");
    const batchTransfer = await NFTBatchTransfer.deploy();
    return {signer, testNFTContract, batchTransfer};
};


describe("BatchTransfer", function() {
    it("Should deploy the BatchTransfer contract", async function() {
        const [signer] = await ethers.getSigners();
        const testNFTContract = await ethers.getContractFactory("TestERC721");
        const TestNFTContract = await testNFTContract.deploy();
        const batchTransfer = await ethers.getContractFactory("NFTBatchTransfer");
        const BatchTransfer = await batchTransfer.deploy();
        console.log(`NFT Batch Transfer contract deployed to ${BatchTransfer.target}`);
        console.log(`Test NFT contract deployed to ${TestNFTContract.target}`);
    });

    it("Should TestBatchTransfer to single address (Approvals)", async function() {
        const {signer, testNFTContract, batchTransfer} = await DeployFixture();
        const [address1] = await ethers.getSigners();
        const tokenIds = [1, 2, 3, 4, 5];
        for (let i = 0; i < tokenIds.length; i++) {
            await testNFTContract.mint(signer.address, tokenIds[i]);
            await testNFTContract.connect(signer).approve(batchTransfer.target, tokenIds[i]);
        }
        await batchTransfer.BasebatchTransfer(testNFTContract.target, address1.address, tokenIds);
        for (let i = 0; i < tokenIds.length; i++) {
            const owner = await testNFTContract.ownerOf(tokenIds[i]);
            expect(owner).to.equal(address1.address);
        }
    });

    it("Should TestBatchTransfer to multiple addresses (Approvals)", async function() {
        const {signer, testNFTContract, batchTransfer} = await DeployFixture();
        const [address1, address2, address3] = await ethers.getSigners();
        const addressList = [address1.address, address2.address, address3.address];
        const tokenIds = [1, 2, 3];
        for (let i = 0; i < tokenIds.length; i++) {
            await testNFTContract.mint(signer.address, tokenIds[i]);
            await testNFTContract.connect(signer).approve(batchTransfer.target, tokenIds[i]);
        }
        await batchTransfer.BasebatchTransferToMultipleWallets(testNFTContract.target, [address1.address, address2.address, address3.address], tokenIds);
        for (let i = 0; i < tokenIds.length; i++) {
            const owner = await testNFTContract.ownerOf(tokenIds[i]);
            expect(owner).to.equal(addressList[i]);
        }
    });

    it("Should test batchTransferToSingleWallet", async function() {
        const {signer, testNFTContract, batchTransfer} = await DeployFixture();
        const [address1] = await ethers.getSigners();
        const tokenIds = [1, 2, 3, 4, 5];
        for (let i = 0; i < tokenIds.length; i++) {
            await testNFTContract.mint(signer.address, tokenIds[i]);
            await testNFTContract.connect(signer).approve(batchTransfer.target, tokenIds[i]);
        }
        await batchTransfer.batchTransferToSingleWallet(testNFTContract.target, address1.address, tokenIds);
        for (let i = 0; i < tokenIds.length; i++) {
            const owner = await testNFTContract.ownerOf(tokenIds[i]);
            expect(owner).to.equal(address1.address);
        }
    });

    it("Should test batchTransferToMultipleWallets", async function() {
        const {signer, testNFTContract, batchTransfer} = await DeployFixture();
        const [address1, address2, address3] = await ethers.getSigners();
        const addressList = [address1.address, address2.address, address3.address];
        const tokenIds = [1, 2, 3];
        for (let i = 0; i < tokenIds.length; i++) {
            await testNFTContract.mint(signer.address, tokenIds[i]);
            await testNFTContract.connect(signer).approve(batchTransfer.target, tokenIds[i]);
        }
        await batchTransfer.batchTransferToMultipleWallets(testNFTContract.target, [address1.address, address2.address, address3.address], tokenIds);
        for (let i = 0; i < tokenIds.length; i++) {
            const owner = await testNFTContract.ownerOf(tokenIds[i]);
            expect(owner).to.equal(addressList[i]);
        }
    });

    it("Should test safeBatchTransferToSingleWallet", async function() {
        const {signer, testNFTContract, batchTransfer} = await DeployFixture();
        const [address1] = await ethers.getSigners();
        const tokenIds = [1, 2, 3, 4, 5];
        for (let i = 0; i < tokenIds.length; i++) {
            await testNFTContract.mint(signer.address, tokenIds[i]);
            await testNFTContract.connect(signer).approve(batchTransfer.target, tokenIds[i]);
        }
        await batchTransfer.safeBatchTransferToSingleWallet(testNFTContract.target, address1.address, tokenIds);
        for (let i = 0; i < tokenIds.length; i++) {
            const owner = await testNFTContract.ownerOf(tokenIds[i]);
            expect(owner).to.equal(address1.address);
        }
    });

    it("Should test safeBatchTransferToMultipleWallets", async function() {
        const {signer, testNFTContract, batchTransfer} = await DeployFixture();
        const [address1, address2, address3] = await ethers.getSigners();
        const addressList = [address1.address, address2.address, address3.address];
        const tokenIds = [1, 2, 3];
        for (let i = 0; i < tokenIds.length; i++) {
            await testNFTContract.mint(signer.address, tokenIds[i]);
            await testNFTContract.connect(signer).approve(batchTransfer.target, tokenIds[i]);
        }
        await batchTransfer.safeBatchTransferToMultipleWallets(testNFTContract.target, [address1.address, address2.address, address3.address], tokenIds);
        for (let i = 0; i < tokenIds.length; i++) {
            const owner = await testNFTContract.ownerOf(tokenIds[i]);
            expect(owner).to.equal(addressList[i]);
        }
    });
});

