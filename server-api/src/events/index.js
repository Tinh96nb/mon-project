require('dotenv').config()
const fs = require('fs').promises;
const path = require('path');
const nftModel = require("../models/nft");
const historyModel = require("../models/nft_history");
const TOKENABI = require('../abi/BNU_ABI.json')

const EventEmitter = require("events");
const event = new EventEmitter();
const { contract, web3 } = require("../helper/web3");

const EVENT = {
  minNFT: "MIN_NFT",
  buy: "BUY",
  bid: "BID",
  exchange: "EXCHANGE"
}

const fileName = path.resolve(__dirname, 'data.txt');

async function init() {
  const data = await fs.readFile(fileName, 'utf8');
  const objBlock = JSON.parse(data);
  const latest = await web3.eth.getBlockNumber();
  const {
    [EVENT.minNFT]: blockMint,
    [EVENT.buy]: blockBuy,
    [EVENT.bid]: blockBid,
    [EVENT.exchange]: blockExchange,
  } = objBlock

  // event trasfer
  if (+blockMint === 0) {
    objBlock[EVENT.minNFT] = latest;
    await fs.writeFile(fileName, JSON.stringify(objBlock));
  } else if (+blockMint !== +latest) {
    contract().nft
      .getPastEvents("Transfer", {
        fromBlock: +blockMint+1,
        toBlock: 'latest'
      })
      .then(async (events) => {
        if (events.length) event.emit(EVENT.minNFT, events)
        objBlock[EVENT.minNFT] = latest;
        await fs.writeFile(fileName, JSON.stringify(objBlock));
      })
  }

  // event buy
  if (+blockBuy === 0) {
    objBlock[EVENT.buy] = latest;
    await fs.writeFile(fileName, JSON.stringify(objBlock));
  } else if (+blockBuy !== +latest) {
    contract().market 
      .getPastEvents("Purchased", {
        fromBlock: +blockBuy+1,
        toBlock: 'latest'
      })
      .then(async (events) => {
        if (events.length) event.emit(EVENT.buy, events)
        objBlock[EVENT.buy] = latest;
        await fs.writeFile(fileName, JSON.stringify(objBlock));
      })
  }

  // event bid
  if (+blockBid === 0) {
    objBlock[EVENT.bid] = latest;
    await fs.writeFile(fileName, JSON.stringify(objBlock));
  } else if (+blockBid !== +latest) {
    contract().auction 
      .getPastEvents("NewPlaceSetted", {
        fromBlock: +blockBid+1,
        toBlock: 'latest'
      })
      .then(async (events) => {
        if (events.length) event.emit(EVENT.bid, events)
        objBlock[EVENT.bid] = latest;
        await fs.writeFile(fileName, JSON.stringify(objBlock));
      })
  }

  // event exchange
  if (+blockExchange === 0) {
    objBlock[EVENT.exchange] = latest;
    await fs.writeFile(fileName, JSON.stringify(objBlock));
  } else if (+blockExchange !== +latest) {
    contract().deployer 
      .getPastEvents("NftTokenDeployed", {
        fromBlock: +blockExchange+1,
        toBlock: 'latest'
      })
      .then(async (events) => {
        if (events.length) event.emit(EVENT.exchange, events)
        objBlock[EVENT.exchange] = latest;
        await fs.writeFile(fileName, JSON.stringify(objBlock));
      })
    }
  await sleep(2000);
  init();
};
init();

event.on(EVENT.minNFT, async (events) => {
  for (let index = 0; index < events.length; index++) {
    const { returnValues, transactionHash } = events[index];
    const { from, to, tokenId } = returnValues
    if (/^0x0+$/.test(from)) {
      const res = await nftModel.verifyNft(tokenId, to, transactionHash)
      console.log(res);
    }
  }
});

event.on(EVENT.buy, async (events) => {
  for (let index = 0; index < events.length; index++) {
    const { returnValues, transactionHash } = events[index];
    const { buyer, tokenId, price } = returnValues;
    const res = await historyModel.createHistory(buyer, tokenId, price, transactionHash)
    console.log(res);
  }
});

event.on(EVENT.bid, async (events) => {
  for (let index = 0; index < events.length; index++) {
    const { returnValues, transactionHash } = events[index];
    const { tokenId, account, price } = returnValues;
    const res = await historyModel.createBid(tokenId, account, price, transactionHash)
    console.log(res);
  }
});

event.on(EVENT.exchange, async (events) => {
  for (let index = 0; index < events.length; index++) {
    const { returnValues } = events[index];
    const { tokenId, tokenAddress, symbol, pairToAddress } = returnValues;
    const contract = new web3.eth.Contract(TOKENABI, pairToAddress);
    try {
      const pairSymbol = await contract.methods.symbol().call();
      if (!pairSymbol) return;
      const res = await nftModel.verifyExchange(tokenId, symbol, tokenAddress, pairSymbol)
      console.log(res);
    } catch (error) {
      console.log("Error orderbook.");
    }
  }
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}