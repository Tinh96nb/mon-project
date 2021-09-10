import { request, requestToken } from "utils/api/axios";
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
          token && localStorage.removeItem("token");
          userAddress && localStorage.removeItem("address");
          dispatch(postLogin(() => true));
        }
      }
    })
  }
}

export function postLogin(cb) {
  return async (dispatch, getStore) => {
    const { web3 } = getStore().home;
    const { me } = getStore().user;
    if (!web3 || !me) return cb(true);
    try {
      const signature = await web3.eth.personal.sign(String(me.nonce), me.address, "");
      request({
        method: "POST",
        url: API_URL.USER.POST_LOGIN,
        data: { signature, publicAddress: me.address },
      }).then((res) => {
        dispatch({type: SET_REDUX, payload: { authChecked: true }})
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("address", me.address);
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

export function updateProfile(dataForm, cb) {
  return (dispatch) => {
    requestToken({ method: "PUT", url: API_URL.USER.PUT, data: dataForm})
    .then(({ data }) => {
      if (data) {
        dispatch({type: SET_REDUX, payload: { me: data }});
        cb(true);
      }
    })
    .catch(() => cb(false))
  }
}

export function toggleFollow(address, cb) {
  return (dispatch) => {
    requestToken({
      method: "POST",
      url: API_URL.USER.FOLLOW,
      data: {to: address}
    })
    .then(({ data }) => {
      if (data) return cb(true);
      return cb(false)
    })
    .catch(() => cb(false))
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
        .allowance(userAddress, process.env.REACT_APP_CONTRACT_MARKET)
        .call()
        .then((result) => {
          dispatch({type: SET_REDUX, payload: {allowance: parseFromBNString(result)}});
        })
        .catch(() => console.log);
  };
};

export const setMAxAllowance = (cb) => {
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
        .then(() => {
          dispatch({type: SET_REDUX, payload: {allowance: maxUnit}});
          cb(true)
        })
        .catch(() => cb(false));
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