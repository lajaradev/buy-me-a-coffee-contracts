import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import "@nomiclabs/hardhat-etherscan";
import 'solidity-coverage';
import "hardhat-gas-reporter";
dotenv.config(); 

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200 
      }
    }
  },
  networks: {
    hardhat:{},
    polygonMumbai: {
      accounts: [process.env.ACCOUNT_API_KEY!], 
      url: process.env.PROVIDER_URL_MUMBAI!
    },
    goerli: {
      accounts: [process.env.ACCOUNT_API_KEY!],
      url: process.env.PROVIDER_URL_GOERLI!
    }
  },
  etherscan: {
    apiKey:{
      polygonMumbai: process.env.POLYGONSCAN_API_KEY!,
      goerli: process.env.ETH_SCAN_API_KEY!
    } 
  },
  gasReporter: {
    currency: 'EUR',
    gasPrice: 21,
    enabled: true
  }
};

export default config;
