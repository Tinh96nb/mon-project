import toast from "Components/Toast";
import { requestToken, request } from "utils/api/axios";
import API_URL from "utils/api/url";
import { postLogin } from "./userReducer";
import { setLoading } from "./homeReducer";

const SET_REDUX = "nft/SET_REDUX";

const initialState = {
  detail: null,
  list: [],
  top: null,
  categories: [],
  collections: [],
  collection: null,
  histories: [],
  selectCate: null,
  pagination: null
};

export function mintNFT(formData, callback = null) {
  return (dispatch, getStore) => {
    const { authChecked } = getStore().user;
    const { userAddress, contractNFT } = getStore().home;
    const postCreate = () => {
      dispatch(setLoading(10));
      requestToken({
        method: "POST",
        url: API_URL.NFT.CREATE(),
        data: formData,
        onDownloadProgress: function (data) {
          const percent = (Math.round((100 * data.loaded) / data.total))
          dispatch(setLoading(percent));
        },
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
      dispatch(postLogin(cb));
    } else postCreate();
  };
}

export function putNft(id, formData, cb = null) {
  return (dispatch) => {
    requestToken({ method: "PUT", url: API_URL.NFT.UPDATE(id), data: formData }).then(
      ({ data }) => {
        cb && cb(data);
      }
    );
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

export function getCollection(slug) {
  return (dispatch) => {
    requestToken({ method: "GET", url: API_URL.COLLECTIONS.GET_DETAIL.replace(":slug", slug), data: {} }).then(
      ({ data }) => {
        if (data)
          dispatch({ type: SET_REDUX, payload: { collection: data } });
      }
    );
  };
}

export function getCollections(params = {}) {
  return (dispatch) => {
    requestToken({ method: "GET", url: API_URL.COLLECTIONS.GET_ALL, data: {}, params }).then(
      ({ data }) => {
        if (data)
          dispatch({
            type: SET_REDUX,
            payload: {
              collections: data.collections,
              collectionPagination: data.pagination
            }
          });
      }
    );
  };
}

export function getMoreCollections(params) {
  return (dispatch, getState) => {
    request({
      method: "GET",
      url: API_URL.COLLECTIONS.GET_ALL,
      data: {},
      params
    }).then(
      ({ data }) => {
        if (data) {
          const state = getState();
          const { collections } = state.nft;
          dispatch({
            type: SET_REDUX,
            payload: {
              collections: [...collections, ...data.collections],
              collectionPagination: data.pagination,
            }
          });
        }
      }
    );
  };
}

export function resetCollections() {
  return (dispatch) => {
    dispatch({
      type: SET_REDUX,
      payload: { collections: [], collectionPagination: null } });
  };
}

export function postCollection(params, cb) {
  return (dispatch) => {
    requestToken({
      method: "POST",
      url: API_URL.COLLECTIONS.CREATE,
      data: params
    }).then(
      ({ data }) => {
        if (data) {
          dispatch({
            type: SET_REDUX,
          });
        }
        toast.success("Create collection success!");
        cb && cb(true);
      }
    ).catch(() => {
      toast.error("Create collection failed!");
      cb && cb(false);
    });
  };
}

export function putCollection(params, cb) {
  return (dispatch) => {
    requestToken({
      method: "PUT",
      url: API_URL.COLLECTIONS.UPDATE(params.id),
      data: params.data
    }).then(
      ({ data }) => {
        if (data) {
          dispatch({
            type: SET_REDUX,
          });
        }
        toast.success("Update collection success!" );
        cb && cb(true);
      }
    ).catch(() => {
      toast.error("Update collection failed!");
      cb && cb(false);
    });
  };
}

export function getDetail(tokenId, cb = null) {
  return (dispatch) => {
    dispatch(setLoading(10));
    request({
      method: "GET",
      url: API_URL.NFT.DETAIL(tokenId),
      data: {},
      onDownloadProgress: function (data) {
        const percent = (Math.round((100 * data.loaded) / data.total))
        dispatch(setLoading(percent));
      },
    }).then(
      ({ data }) => {
        if (data) {
          data.price = data.price ? +parseFloat(data.price).toFixed(2) : 0
          dispatch({ type: SET_REDUX, payload: { detail: data } });
        }
        cb && cb(data);
      }
    );
  };
}

export function getNFTTop() {
  return (dispatch) => {
    request({ method: "GET", url: API_URL.NFT.TOP, data: {} }).then(
      ({ data }) => {
        if (data) {
          data.price = data.price ? +parseFloat(data.price).toFixed(2) : 0
          dispatch({ type: SET_REDUX, payload: { top: data } });
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

export function getListNFT(params, isMore = false) {
  return (dispatch, getStore) => {
    dispatch(setLoading(10));
    request({
      method: "GET",
      url: API_URL.NFT.GET,
      data: {},
      onDownloadProgress: function (data) {
        const percent = (Math.round((100 * data.loaded) / data.total))
        dispatch(setLoading(percent));
      },
      params
    }).then(
      ({ data }) => {
        const currentList = getStore().nft.list.length && isMore
          ? [...getStore().nft.list, ...data.data]
          : data.data;
        dispatch({ type: SET_REDUX, payload: { list: currentList, pagination: data.pagination}});
      }
    );
  };
}

export function setCateFilter(cateId) {
  return (dispatch) => {
    dispatch({ type: SET_REDUX, payload: { selectCate: cateId } });
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
