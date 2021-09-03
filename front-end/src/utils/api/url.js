const API_URL = {
  USER: {
    GET: (address) => `/users/${address}`,
    POST_LOGIN: "/login",
    PUT: "/users",
  },
  CATEGORY: {
    GET_ALL: "/categories",
    DETAILS_CATEGORY: "/categories",
  },
  NFT: {
    GET: () => `/nfts`,
    CREATE: () => "/nfts/mint",
    DETAIL: (tokenId) => `/nfts/${tokenId}`,
    HISTORY_TRADE: "/nfts/history",
  },
};

export default API_URL;
