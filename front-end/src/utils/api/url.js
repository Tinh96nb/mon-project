const API_URL = {
  USER: {
    GET: (address) => `/users/${address}`,
    POST_LOGIN: "/login",
    PUT: "/users",
    FOLLOW: "/users/toggle-favorite"
  },
  CATEGORY: {
    GET_ALL: "/categories"
  },
  NFT: {
    GET: "/nfts",
    CREATE: () => "/nfts/mint",
    DETAIL: (tokenId) => `/nfts/${tokenId}`,
    HISTORY_TRADE: (tokenId) => `/nfts/history/${tokenId}`,
  },
};

export default API_URL;
