const { ethers } = require("hardhat");
const { a, b } = require("./sample"); // Note the correct import statement

async function main() {
  // Use the exported values a and b from sample.js
  const parameter1 = a;
  const parameter2 = b;

  // Get the deployer's signer
  const [deployer] = await ethers.getSigners();

  // Get the contract factory
  const Voting = await ethers.getContractFactory("VOTING");

  // Deploy the contract with the specified parameters
  const Voting_ = await Voting.deploy(parameter1, parameter2);

  // Wait for the contract to be mined
  await Voting_.deployed();

  console.log("MyContract address:", Voting_.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
