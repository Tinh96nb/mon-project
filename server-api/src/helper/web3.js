const Web3 = require('web3')
const TOKENABI = require('../abi/TOKEN_ABI.json')
const NFTABI = require('../abi/NFT_ABI.json')
const MARKETABI = require('../abi/MARKET_ABI.json')

console.log(process.env.NETWORK_CONTRACT);
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.NETWORK_CONTRACT))

function contract () {
  if (!web3) return null;
  return {
    token: new web3.eth.Contract(TOKENABI, process.env.CONTRACT_TOKEN),
    nft: new web3.eth.Contract(NFTABI, process.env.CONTRACT_NFT),
    market: new web3.eth.Contract(MARKETABI, process.env.CONTRACT_MARKET)
  }
}

module.exports = {
  web3,
  contract
}