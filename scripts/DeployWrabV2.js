const hre = require("hardhat");

async function main() {
  const WrabDistributorV2Deployer = await hre.ethers.getContractFactory("MilestoneTracker");
  const WrabDistributorV2 = await WrabDistributorV2Deployer.deploy();
  await WrabDistributorV2.deployed();

  console.log(`WrabDistributorV2 contract deployed to ${WrabDistributorV2.address}`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
