require('dotenv').config()
const knex = require('../models/connect');
const nftModel = require("../models/nft");
const historyModel = require("../models/nft_history");
const { contract, web3 } = require("../helper/web3");

const stepSize = 100;
const stepTimeMs = 2000;

async function findOrCreateLatestBlockCursor(blockHeight, eventName) {
  const blockCursor = await knex('block_cursor').where({ event_name: eventName }).first();
  if (blockCursor) return blockCursor;
  await knex('block_cursor').insert({ event_name: eventName, current_block: blockHeight });
  const created = await knex('block_cursor').where({ event_name: eventName }).first();
  return created;
}

async function updateBlockCursor(eventName, blockHeight) {
  return knex('block_cursor').where({ event_name: eventName }).update({ current_block: blockHeight });
}

async function getBlockRange(fromBlock) {
  let toBlock = await web3.eth.getBlockNumber();
  if (fromBlock + stepSize < toBlock) {
    toBlock = fromBlock + stepSize;
  }
  fromBlock++;
  return Object.assign({}, { fromBlock, toBlock });
}

const events = [
  {
    name: "Transfer",
    contractCall: contract().nft,
    excute: mintNfts
  },
  {
    name: "Purchased",
    contractCall: contract().market,
    excute: buy
  },
  {
    name: "NewSellOrderCreated",
    contractCall: contract().market,
    excute: createSell
  },
  {
    name: "CancelOrder",
    contractCall: contract().market,
    excute: cancelSell
  },
  {
    name: "SetFeeCoppyRight",
    contractCall: contract().nft,
    excute: setRoy
  },
];

async function main() {
  const latest = await web3.eth.getBlockNumber();
  console.log('latestBlockHeight =', latest);
  events.forEach(async ({name: eventName, contractCall, excute}) => {
    const poll = async () => {
      const currentblockEvent = await findOrCreateLatestBlockCursor(latest, eventName);
      const { fromBlock, toBlock } = await getBlockRange(+currentblockEvent.current_block);
      if (fromBlock <= toBlock) {
        try {
          const events = await contractCall.getPastEvents(eventName, { fromBlock, toBlock });
          if (events.length) {
            await excute(events);
          }
        } catch (e) {
          console.log(`Error retrieving events for block range fromBlock=${fromBlock} toBlock=${toBlock}`, e);
          const timer = setTimeout(() => {
            clearTimeout(timer);
            poll()
          }, stepTimeMs);
          return;
        }
        await updateBlockCursor(eventName, toBlock);
      }
      const timer = setTimeout(() => {
        clearTimeout(timer);
        poll()
      }, stepTimeMs);
    };
    poll();
  });
}
main();

async function mintNfts (events) {
  for (let index = 0; index < events.length; index++) {
    const { returnValues, transactionHash } = events[index];
    const { from, to, tokenId } = returnValues
    if (/^0x0+$/.test(from)) {
      const res = await nftModel.verifyNft(tokenId, to, transactionHash)
      console.log(res);
    }
  }
};

async function buy (events) {
  for (let index = 0; index < events.length; index++) {
    const { returnValues, transactionHash } = events[index];
    const { buyer, tokenId, price } = returnValues;
    const res = await historyModel.createHistory(buyer, tokenId, price, transactionHash)
    console.log(res);
  }
};

async function createSell (events) {
  for (let index = 0; index < events.length; index++) {
    const { returnValues } = events[index];
    const { tokenId, seller, price } = returnValues;
    const res = await nftModel.confirmPriceSell(tokenId, seller, price)
    console.log(res);
  }
};

async function cancelSell (events) {
  for (let index = 0; index < events.length; index++) {
    const { returnValues } = events[index];
    const { tokenId } = returnValues;
    const res = await nftModel.cancelOrder(tokenId)
    console.log(res);
  }
}

async function setRoy (events) {
  for (let index = 0; index < events.length; index++) {
    const { returnValues } = events[index];
    const { tokenId, feePercent } = returnValues;
    const res = await nftModel.setFeeCopyright(tokenId, feePercent)
    console.log(res);
  }
}