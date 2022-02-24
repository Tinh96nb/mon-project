const userUpload = [
  {
    name: 'avatar',
    maxCount: 1,
  },
  {
    name: 'cover',
    maxCount: 1,
  },
];

const statusNft = {
  pendding: 0,
  verified: 1,
  selling: 2,
  report: 3,
};

const eventHistoryNFT = {
  orther: 0,
  listing: 1,
  sale: 2
};

const statusCollection = {
  draft: 0,
  publish: 1,
  banned: 2,
}

module.exports = { userUpload, statusNft, eventHistoryNFT, statusCollection };
