import { requestToken, request } from "utils/api/axios";
import API_URL from "utils/api/url";
import { postLogin } from "./userReducer";

const SET_REDUX = 'user/SET_REDUX'

const initialState = {
  detail: null,
  list: [],
}

export function mintNFT(formData, callback = null) {
  return (dispatch, getStore) => {
    const { authChecked } = getStore().user;
    const { userAddress } = getStore().home;

    const postCreate = () => {
      requestToken({
        method: "POST",
        url: API_URL.NFT.CREATE(),
        data: formData,
      }).then((res) => {
        console.log(res);
      });
    }
    if (!authChecked) {
      const cb = (res) => {
        if (res) postCreate();
      }
      dispatch(postLogin(userAddress, cb))
    } else postCreate();
  }
}

export const nftReducer = (state = initialState, action) => {
  const { type, payload = {} } = action
  switch (type) {
    case SET_REDUX:
      return { ...state, ...payload }
    default:
      return state
  }
}