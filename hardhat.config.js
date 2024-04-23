require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */

const Alchemy_API_Key = process.env.Alchemy_API_Key;

const Sepolia_Private_Key = process.env.Sepolia_Private_Key;
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.API_URL,
      accounts: [Sepolia_Private_Key]
    }
  }
};
