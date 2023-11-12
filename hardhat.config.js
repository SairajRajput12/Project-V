require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */ 

const{ALCHEMY_API_KEY, SEPOLIA_PRIVATE_KEY} = process.env;

// const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY;
// const SEPOLIA_PRIVATE_KEY = process.env.REACT_APP_SEPOLIA_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.19",
  networks : {
    sepolia : {
      url:`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, 
      accounts : [`${SEPOLIA_PRIVATE_KEY}`],
    }
  }
};
