const API_URL = {
  USER: {
    GET: (id: string) => `/users/${id}`,
    POST_LOGIN: "/login",
    GET_SUMMARY: "/users/summary",
    PUT: "/users",
  },
  COLLECTION: {
    GET_ALL: (address: string) => `/collections/owner/${address}`,
    POST: "/collections",
    GET_ALL_COLLECTIONS: "/collections",
    GET_ONE: (id: string) => `/collections/${id}`,
    PUT: "/collections",
  },
  KYC: {
    POST: `/kyc`,
    GET: `/kyc`,
  },
  CATEGORY: {
    GET_ALL: "/categories",
    DETAILS_CATEGORY: "/categories",
  },

  COLLECTION_DETAIL: {
    GET: (id: string) => `/collections/${id}`,
    PUT: (id: string) => `/collections/${id}`,
  },
  NFT: {
    GET: () => `/nfts`,
    CREATE: () => "/nfts/mint",
    VERIFY: () => "/nfts/verify",
    DETAIL: (tokenId: any) => `/nfts/${tokenId}`,
    SET_PRICE: () => `/nfts/set-price`,
    ADD_VIEW: () => "/summary/add-view",
    ADD_FAVORITE: () => "/summary/add-favorite",
    UN_FAVORITE: () => "/summary/unfavorite",
    HISTORY_TRADE: "/nfts/history",
    LIST_BID: "/nfts/list-bid",
    PURCHASE: "/nfts/purchase",
    BID: "/nfts/bid",
  },
  EXCHANGE: {
    CHECK_SYMBOL: (symbol: string) => `/token/get-by-symbol?symbol=${symbol}`,
    LOGIN: '/account/sign-in',
    GET_PAIR_BY_NAME: (name: string) => `/exchange/pairs/get-by-pair-name?pairName=${name}`,
    GET_ALL_PAIR: '/exchange/pairs',
    GET_USER_TRADING: '/exchange/user/trading-histories',
    GET_USER_OPEN_ORDER: (acc: string, page: number) => `/exchange/user/open-orders?Account=${acc}&PageNumber=${page}&PageSize=10`,
    GET_USER_ORDER_HISTORY: (acc: string, page: number) => `/exchange/user/order-histories?Account=${acc}&PageNumber=${page}&PageSize=10`,
    GET_USER_TRADING_HISTORY: (acc: string, page: number) => `/exchange/user/trading-histories?Account=${acc}&PageNumber=${page}&PageSize=10`,
    GET_MARKET_TRADING: (token0: string, token1: string) => `/exchange/trading-histories?token0Address=${token0}&token1Address=${token1}`,
    ADD_FAVORITE: '/exchange/user/add-to-favorite',
    REMOVE_FAVORITE: '/exchange/user/remove-from-favorite',
    GET_FAVORITE: (address: string) => `/exchange/user/favorite-pairs?account=${address}`,
    GET_DATA_CHART: (type: number, range: number, token0: string, token1: string) => `/exchange/prices/histories?RangeType=${type}&Range=${range}&Token0Address=${token0}&Token1Address=${token1}`,
  }
};

export default API_URL;
