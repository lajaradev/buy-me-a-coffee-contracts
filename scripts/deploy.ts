import { ethers } from "hardhat";

async function main() {

  const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
  const buyCoffee = await BuyMeACoffee.deploy();

  await buyCoffee.deployed();

  console.log(`deployed to ${buyCoffee.address}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
