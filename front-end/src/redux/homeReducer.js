import { request } from "utils/api/axios"
import API_URL from "utils/api/url"

const SET_REDUX = 'home/SET_REDUX'

const initialState = {
  userAddress: null,
  web3: null,
  priceToken: 0,
  contractToken: null,
  contractNFT: null,
  contractMarket: null,
  loading: 0,
  config: null
}

export function setAddress(address) {
  return (dispatch) => {
    dispatch({
      type: SET_REDUX,
      payload: { userAddress: address }
    })
  }
}

export function setLoading(per) {
  return (dispatch) => {
    dispatch({
      type: SET_REDUX,
      payload: { loading: per }
    })
  }
}

export function setEnvContract(obj) {
  return (dispatch) => {
    dispatch({
      type: SET_REDUX,
      payload: obj
    })
  }
}

export function getPriceToken() {
  return (dispatch) => {
    request({ method: "GET", url: API_URL.PRICE, data: {} }).then(
      ({ data }) => {
        if (data)
          dispatch({ type: SET_REDUX, payload: { priceToken: data } });
      }
    );
  };
}

export function resetStore() {
  return (dispatch) => {
    dispatch({
      type: SET_REDUX,
      payload: { userAddress: null }
    })
  }
}

export function getConfig() {
  return (dispatch) => {
    request({ method: "GET", url: API_URL.CONFIG, data: {} }).then(
      ({ data }) => {
        if (data)
          dispatch({ type: SET_REDUX, payload: { config: data } });
      }
    );
  };
}

export const homeReducer = (state = initialState, action) => {
  const { type, payload = {} } = action
  switch (type) {
    case SET_REDUX:
      return { ...state, ...payload }
    default:
      return state
  }
}