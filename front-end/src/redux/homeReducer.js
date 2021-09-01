import { request } from "utils/api/axios";
import API_URL from "utils/api/url";

const SET_REDUX = 'user/SET_REDUX'

const initialState = {
  userAddress: null,
  authChecked: false,
  me: null,
  web3: null,
  contractToken: null,
  contractNFT: null,
  contractMarket: null,
}

// export function postLogin(parameters, cb) {
//   return (dispatch) => dispatch(requestAxios(request.postUserMe()))
//     .then((response) => {
//       dispatch({
//         type: SET_REDUX,
//         payload: { me: response.profile, authChecked: true }
//       })
//     })
// }

export function setAddress(address) {
  return (dispatch) => {
    dispatch({
      type: SET_REDUX,
      payload: { userAddress: address }
    })
  }
}

export function setEnvContract(obj) {
  return (dispatch) => {
    dispatch({
      type: SET_REDUX,
      payload: { obj }
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