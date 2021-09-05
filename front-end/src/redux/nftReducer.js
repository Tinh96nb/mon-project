import toast from "Components/Toast";
import { requestToken, request } from "utils/api/axios";
import API_URL from "utils/api/url";
import { parseFromBNString } from "utils/hepler";
import { postLogin } from "./userReducer";

const SET_REDUX = "user/SET_REDUX";

const initialState = {
  detail: null,
  list: [],
  categories: [],
  histories: []
};

export function mintNFT(formData, callback = null) {
  return (dispatch, getStore) => {
    const { authChecked } = getStore().user;
    const { userAddress, contractNFT } = getStore().home;
    const postCreate = () => {
      requestToken({
        method: "POST",
        url: API_URL.NFT.CREATE(),
        data: formData,
      })
        .then(({ data }) => {
          data &&
            contractNFT.methods
              .mintToken(data.token_id, data.metadata)
              .send({ from: userAddress })
              .then((res) => callback(data.token_id))
              .catch(() => {
                callback(false);
                toast.error({ message: "You not confirm transaction!" });
              });
        })
        .catch((e) => {
          callback(false);
          if (e.response && e.response.data) {
            const mess = Object.keys(e.response.data).map((key) => {
              return `${e.response.data[key].param}: ${e.response.data[key].msg}`;
            });
            toast.error({ message: mess.length ? mess[0] : "Error!" });
            return;
          }
          toast.error({ message: "Error!" });
        });
    };
    if (!authChecked) {
      const cb = (res) => {
        if (res) postCreate();
        if (!res) callback(false);
      };
      dispatch(postLogin(userAddress, cb));
    } else postCreate();
  };
}

export function getCategories() {
  return (dispatch) => {
    request({ method: "GET", url: API_URL.CATEGORY.GET_ALL, data: {} }).then(
      ({ data }) => {
        if (data)
          dispatch({ type: SET_REDUX, payload: { categories: data } });
      }
    );
  };
}

export function getDetail(tokenId) {
  return (dispatch) => {
    request({ method: "GET", url: API_URL.NFT.DETAIL(tokenId), data: {} }).then(
      ({ data }) => {
        if (data) {
          data.price = data.price ? parseFromBNString(data.price) : 0
          dispatch({ type: SET_REDUX, payload: { detail: data } });
        }
      }
    );
  };
}

export function getHistoryTrade(tokenId) {
  return (dispatch) => {
    request({ method: "GET", url: API_URL.NFT.HISTORY_TRADE(tokenId), data: {} }).then(
      ({ data }) => {
        if (data) {
          dispatch({ type: SET_REDUX, payload: { histories: data } });
        }
      }
    );
  };
}

export const nftReducer = (state = initialState, action) => {
  const { type, payload = {} } = action;
  switch (type) {
    case SET_REDUX:
      return { ...state, ...payload };
    default:
      return state;
  }
};
