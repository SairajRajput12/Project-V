require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */ 
const ALCHEMY_API_KEY = "8Q4wyWyMFuRNad4ZYlMcIsCBZLEYAWFK"; 
const SEPOLIA_PRIVATE_KEY = "b00dd63a5ebcdae6e12d46c84d9f3c00cea03a85d979ea3d9164f71e4185c557";
module.exports = {
  solidity: "0.8.19",
  networks : {
    sepolia : {
      url:`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, 
      accounts : [`${SEPOLIA_PRIVATE_KEY}`],
    }
  }
};
