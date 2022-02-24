const API_URL = {
  USER: {
    GET: (address) => `/users/${address}`,
    LIST: "/users",
    ALL: "/users/all",
    POST_LOGIN: "/login",
    PUT: "/users",
    FOLLOW: "/users/toggle-favorite",
  },
  CONFIG: "/config",
  PRICE: "/getprice",
  CATEGORY: {
    GET_ALL: "/categories"
  },
  COLLECTIONS: {
    CREATE: "/collections/create",
    UPDATE: (id) => `/collections/${id}`,
    GET_ALL: "/collections",
    GET_DETAIL: "/collections/:slug",
  },
  NFT: {
    TOP: "/nfts/top",
    GET: "/nfts",
    CREATE: () => "/nfts/mint",
    DETAIL: (tokenId) => `/nfts/${tokenId}`,
    HISTORY_TRADE: (tokenId) => `/nfts/history/${tokenId}`,
  },
};

export default API_URL;
