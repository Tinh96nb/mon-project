const SET_REDUX = 'home/SET_REDUX'

const initialState = {
  userAddress: null,
  web3: null,
  priceToken: 0.5,
  contractToken: null,
  contractNFT: null,
  contractMarket: null,
  loading: false,
}

export function setAddress(address) {
  return (dispatch) => {
    dispatch({
      type: SET_REDUX,
      payload: { userAddress: address }
    })
  }
}

export function setLoading(type) {
  return (dispatch) => {
    dispatch({
      type: SET_REDUX,
      payload: { loading: type }
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

export function resetStore() {
  return (dispatch) => {
    dispatch({
      type: SET_REDUX,
      payload: { userAddress: null }
    })
  }
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