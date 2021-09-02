const Web3 = require('web3')
const BNUABI = require('../abi/BNU_ABI.json')
const KYCABI = require('../abi/KYC_ABI.json')
const NFTABI = require('../abi/NFT_ABI.json')
const MARKETABI = require('../abi/MARTKET_ABI.json')
const AUCTIONABI = require('../abi/AUCTION_ABI.json')
const DEPLOYABI = require('../abi/DEPLOYER.json')

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.NETWORK_CONTRACT))

function contract () {
  if (!web3) return null;
  web3.eth.accounts.wallet.add(process.env.PRIVATE)
  return {
    token: new web3.eth.Contract(BNUABI, process.env.CONTRACT_BNU),
    kyc: new web3.eth.Contract(KYCABI, process.env.CONTRACT_KYC),
    nft: new web3.eth.Contract(NFTABI, process.env.CONTRACT_NFT),
    market: new web3.eth.Contract(MARKETABI, process.env.CONTRACT_MARKET),
    auction: new web3.eth.Contract(AUCTIONABI, process.env.CONTRACT_AUCTION),
    deployer: new web3.eth.Contract(DEPLOYABI, process.env.CONTRACT_DEPLOYER),
  }
}

module.exports = {
  web3,
  contract
}