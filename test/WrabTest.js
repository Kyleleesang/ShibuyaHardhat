
const { expect } = require("chai");
const { ethers } = require("hardhat");




async function DeployWrabDistributorV2() {
    const [owner, randomUser, randomUser2, randomUser3] = await ethers.getSigners();

    const SteakToken = await ethers.getContractFactory("SteakWhiteRabbitToken");
    const SteakWhiteRabbitToken = await SteakToken.deploy();
    const SteakAddress = SteakWhiteRabbitToken.target;
    const signerAddress = owner.address;
    const WrabDistributorV2contract = await ethers.getContractFactory("WrabDistributorV2");
    const WrabDistributorV2 = await WrabDistributorV2contract.deploy(SteakAddress, signerAddress);
    //await WrabDistributorV2.deployed();
    await SteakWhiteRabbitToken.mint(WrabDistributorV2.target, 1000);
    return { WrabDistributorV2, owner, randomUser, randomUser2, randomUser3, SteakWhiteRabbitToken };
}

async function generateAndSignMessage({ userAddress, amount, signer, createdAtMs }) {
    const messageHash = etherSigner.utils.hashMessage(userAddress, amount, signer, createdAtMs)
    const signature = await signer.signMessage(messageHash);
    return signature;
}



describe("WrabDistributorV2", function() {
 

    describe("Deployment", () => {

        it("Should deploy the WrabDistributorV2 contract", async () => {
            const [signer] = await ethers.getSigners();
            //console.log("This is the signer address:", signer.address);
            //Sepolia test address but we are just using it to see if it deploys
            const testTokenAddress = "0x191fd4783fa65c18640d292276f7631e3a912075"
            const WrabDistributorV2contract = await ethers.getContractFactory("WrabDistributorV2");
            const WrabDistributorV2 = await WrabDistributorV2contract.deploy(testTokenAddress, signer.address);
            console.log(`WrabDistributorV2 contract deployed to ${WrabDistributorV2.target}`);
            expect(WrabDistributorV2.target).to.not.equal(0);
            return { WrabDistributorV2 };
        });
    });

        

    describe('claim', () => {
        it("successfully creates a claim", async () => {
            const { WrabDistributorV2, owner, randomUser, SteakWhiteRabbitToken } = await DeployWrabDistributorV2();
            const userAmount = 100;
            const createdAtMs = Date.now();
            const signature = await generateAndSignMessage({
              userAddress: owner.address,
              amount: userAmount,
              signer: owner,
              createdAtMs,
            });
      
            await WrabDistributorV2
              .connect(owner)
              .claim(userAmount, createdAtMs, signature);
      
            expect(
              await WrabDistributorV2.userClaimedTokens(owner.address)
            ).to.equal(userAmount);
            expect(await SteakWhiteRabbitToken.balanceOf(owner.address)).to.equal(
              numToTokenBigNum(userAmount)
            );
    });

    it("will fail with an invalid signature", async () => {
        const userAmount = testAmounts[randomUser.address];
        const createdAtMs = Date.now();
        const signature = await generateAndSignMessage({
            userAddress: randomUser.address,
            amount: 100,
            signer: randomUser2,
            createdAtMs,
        });

        await expect(
            WrabDistributorV2
            .connect(randomUser)
            .claim(userAmount, createdAtMs, signature)
        ).to.revertedWith("Invalid signature.");
    });


    it('It will fail if the claim isnt open', async () => {
            const userAmount = testAmounts[randomUser2.address];
            const createdAtMs = Date.now();
            const signature = await generateAndSignMessage({
              userAddress: randomUser2.address,
              amount: userAmount,
              signer: owner,
              createdAtMs,
            });
      
            expect(await WrabDistributorV2.hasClaimedSignature(signature)).to.equal(
              false
            );
      
            await WrabDistributorV2
              .connect(randomUser2)
              .claim(userAmount, createdAtMs, signature);
      
            await expect(
              WrabDistributorV2
                .connect(randomUser2)
                .claim(userAmount, createdAtMs, signature)
            ).to.revertedWith('Already claimed.');
      
            expect(await WrabDistributorV2.hasClaimedSignature(signature)).to.equal(
              true
            );
          });

    })

    describe("Permissions Checks", () => {

        it("only the owner can set the claim open", async () => {
            const {WrabDistributorV2, randomUser} = await DeployWrabDistributorV2();
            await expect(
                WrabDistributorV2.connect(randomUser).setClaimOpen(true)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("should allow the owner to set the claim open", async () => {
            const {WrabDistributorV2, owner} = await DeployWrabDistributorV2();
            await WrabDistributorV2.connect(owner).setClaimOpen(true);
            expect(await WrabDistributorV2.claimOpen()).to.equal(true);
        });

        //Can't read private variable from a smart contract
        it("should allow the owner to set the signer", async () => {
            const {WrabDistributorV2, owner, randomUser} = await DeployWrabDistributorV2();
            await WrabDistributorV2.connect(owner).setSigner(randomUser.address);
            expect(await WrabDistributorV2.signerAddress).to.equal(randomUser.address);
        });



        it("should not let anyone set the signer", async () => {
            const {WrabDistributorV2, randomUser} = await DeployWrabDistributorV2();
            await expect(
                WrabDistributorV2.connect(randomUser).setSigner(randomUser.address)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should let the owner withdraw the excess WRAB", async () => {
            const {WrabDistributorV2, owner, SteakWhiteRabbitToken} = await DeployWrabDistributorV2();
            const amount = 1000000000000000000000;
            await WrabDistributorV2.connect(owner).withdraw(amount);
            expect(await SteakWhiteRabbitToken.balanceOf(owner.address)).to.equal(1000);
        });

    });
});
