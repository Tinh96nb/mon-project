const repoNFT = require('../repository');

async function listNft(req, res) {
  const nfts = await repoNFT.getList();
  return res.json({ data: nfts });
}

async function toggleStatus (req, res) {
  const rest = await repoNFT.toggleSell(req.body);
  res.status(200).json(rest);
}

module.exports = {
  listNft,
  toggleStatus
}