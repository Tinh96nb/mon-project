require('dotenv').config()
const fs = require('fs').promises;
const path = require('path');
const nftModel = require("../models/nft");
const historyModel = require("../models/nft_history");

const EventEmitter = require("events");
const event = new EventEmitter();
const { contract, web3 } = require("../helper/web3");

const EVENT = {
  minNFT: "MIN_NFT",
  buy: "BUY",
  createSell: "CREATE_SELL",
  cancelOrder: "CANCEL_SELL",
  setRoy: "SET_ROY",
}

const fileName = path.resolve(__dirname, 'data.txt');

async function init() {
  const data = await fs.readFile(fileName, 'utf8');
  const objBlock = JSON.parse(data);
  const latest = await web3.eth.getBlockNumber();
  const {
    [EVENT.minNFT]: blockMint,
    [EVENT.buy]: blockBuy,
    [EVENT.createSell]: blockSell,
    [EVENT.cancelOrder]: blockCancel,
    [EVENT.setRoy]: blockRoy,
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

  // event create sell
  if (+blockSell === 0) {
    objBlock[EVENT.createSell] = latest;
    await fs.writeFile(fileName, JSON.stringify(objBlock));
  } else if (+blockSell !== +latest) {
    contract().market 
      .getPastEvents("NewSellOrderCreated", {
        fromBlock: +blockSell+1,
        toBlock: 'latest'
      })
      .then(async (events) => {
        if (events.length) event.emit(EVENT.createSell, events)
        objBlock[EVENT.createSell] = latest;
        await fs.writeFile(fileName, JSON.stringify(objBlock));
      })
  }

  // event cancel sell
  if (+blockCancel === 0) {
    objBlock[EVENT.cancelOrder] = latest;
    await fs.writeFile(fileName, JSON.stringify(objBlock));
  } else if (+blockCancel !== +latest) {
    contract().market 
      .getPastEvents("CancelOrder", {
        fromBlock: +blockCancel+1,
        toBlock: 'latest'
      })
      .then(async (events) => {
        if (events.length) event.emit(EVENT.cancelOrder, events)
        objBlock[EVENT.cancelOrder] = latest;
        await fs.writeFile(fileName, JSON.stringify(objBlock));
      })
  }

  // event cancel sell
  if (+blockRoy === 0) {
    objBlock[EVENT.setRoy] = latest;
    await fs.writeFile(fileName, JSON.stringify(objBlock));
  } else if (+blockRoy !== +latest) {
    contract().nft 
      .getPastEvents("SetFeeCoppyRight", {
        fromBlock: +blockRoy+1,
        toBlock: 'latest'
      })
      .then(async (events) => {
        if (events.length) event.emit(EVENT.setRoy, events)
        objBlock[EVENT.setRoy] = latest;
        await fs.writeFile(fileName, JSON.stringify(objBlock));
      })
  }
  
  await sleep(3000);
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

event.on(EVENT.createSell, async (events) => {
  for (let index = 0; index < events.length; index++) {
    const { returnValues } = events[index];
    const { tokenId, seller, price } = returnValues;
    const res = await nftModel.confirmPriceSell(tokenId, seller, price)
    console.log(res);
  }
});

event.on(EVENT.cancelOrder, async (events) => {
  for (let index = 0; index < events.length; index++) {
    const { returnValues } = events[index];
    const { tokenId } = returnValues;
    const res = await nftModel.cancelOrder(tokenId)
    console.log(res);
  }
});

event.on(EVENT.cancelOrder, async (events) => {
  for (let index = 0; index < events.length; index++) {
    const { returnValues } = events[index];
    const { tokenId } = returnValues;
    const res = await nftModel.cancelOrder(tokenId)
    console.log(res);
  }
});

event.on(EVENT.setRoy, async (events) => {
  for (let index = 0; index < events.length; index++) {
    const { returnValues } = events[index];
    const { tokenId, feePercent } = returnValues;
    const res = await nftModel.setFeeCopyright(tokenId, feePercent)
    console.log(res);
  }
});


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}