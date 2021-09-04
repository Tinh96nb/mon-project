import { request } from "utils/api/axios";
import API_URL from "utils/api/url";
import { parseFromBNString } from "utils/hepler";

const SET_REDUX = 'user/SET_REDUX'

const initialState = {
  authChecked: false,
  me: null,
  balance: 0,
  allowance: 0,
  isApprove: false,
}

export function fetchUser(address) {
  return (dispatch) => {
    request({ method: "GET", url: API_URL.USER.GET(address), data: {}})
    .then(({ data }) => {
      if (data) {
        dispatch({type: SET_REDUX, payload: { me: data }})
        const token = localStorage.getItem("token");
        const userAddress = localStorage.getItem("address");
        if (token && userAddress === address) {
          dispatch({type: SET_REDUX, payload: { authChecked: true }})
        } else {
          dispatch({type: SET_REDUX, payload: { authChecked: false }})
        }
      }
    })
  }
}

export function postLogin(address, cb) {
  return async (dispatch, getStore) => {
    const { web3 } = getStore().home;
    const { me } = getStore().user;
    if (!web3 || !me) return cb(true);
    try {
      const signature = await web3.eth.personal.sign(String(me.nonce), address, "");
      request({
        method: "POST",
        url: API_URL.USER.POST_LOGIN,
        data: { signature, publicAddress: address },
      }).then((res) => {
        dispatch({type: SET_REDUX, payload: { authChecked: true }})
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("address", address);
        cb(true)
      })
      .catch((e) => {
        cb(false)
      });
    } catch (error) {
      cb(false)
    }
  }
}

export const getBalance = () => {
  return (dispatch, getStore) => {
    const { userAddress, contractToken } = getStore().home;
    if (contractToken) {
      contractToken.methods
        .balanceOf(userAddress)
        .call()
        .then((result) => {
          dispatch({type: SET_REDUX, payload: {balance: parseFromBNString(result)}});
        })
        .catch(() => console.log);
    }
  };
}

export const getAllowance = () => {
  return (dispatch, getStore) => {
    const { userAddress, contractToken } = getStore().home;
    contractToken &&
      contractToken.methods
        .allowance(userAddress, process.env.REACT_APP_ADDRESS_CONTRACT_STAKING)
        .call()
        .then((result) => {
          dispatch({type: SET_REDUX, payload: {allowance: parseFromBNString(result)}});
        })
        .catch(() => console.log);
  };
};

export const setMAxAllowance = () => {
  return (dispatch, getStore) => {
    const { userAddress, contractToken, web3} = getStore().home;
    const maxUnit = Math.pow(10, 20);

    contractToken &&
      contractToken.methods
      .approve(
        process.env.REACT_APP_CONTRACT_MARKET,
        web3.utils.toWei(maxUnit.toString(), 'ether'),
      )
      .send({ from: userAddress })
        .then((result) => {
          dispatch({type: SET_REDUX, payload: {allowance: maxUnit}});
        })
        .catch(() => console.log);
  };
};

export const userReducer = (state = initialState, action) => {
  const { type, payload = {} } = action
  switch (type) {
    case SET_REDUX:
      return { ...state, ...payload }
    default:
      return state
  }
}