const hre = require("hardhat");

async function main() {
  const NFTBatchTransfer = await hre.ethers.getContractFactory("NFTBatchTransfer");
  const BatchTransfer = await NFTBatchTransfer.deploy();
  await BatchTransfer.deployed();

  console.log(`NFT Batch Transfer contract deployed to ${BatchTransfer.target}`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
