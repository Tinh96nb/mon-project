import { Container, Row, Col, Modal, InputGroup, FormControl } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListNFT } from "redux/nftReducer";
import { getFile, toDisplayNumber } from "utils/hepler";
import {BsLightningFill, BsFillXOctagonFill, BsGearFill} from "react-icons/bs";
import { Link  } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import HeadProfile from "Components/UI/HeadProfile";
import toast from "Components/Toast";
import LazyImage from "Components/LazyImage";

const statusNFt = {
  0 : {color: "text-pendding", text: "Unconfirm"},
  1 : {color: "text-pendding", text: "Pendding"},
  2 : {color: "text-sell", text: "On Sale"},
  3 : {color: "text-report", text: "Locked"},
}
export default function Creator() {

  const dispatch = useDispatch();

  const { list, pagination } = useSelector((state) => state.nft);
  const { priceToken, contractMarket, web3, contractNFT } = useSelector((state) => state.home);
  const { me } = useSelector((state) => state.user);
  const [fee, setFee] = useState(0);

  const [sort, setSort] = useState(null);
  const [filstatus, setFilStatus] = useState(null);

  const [sell, setSell] = useState(null);
  const [priceSell, setPriceSell] = useState(0);
  const [loadingSell, setLoadingSell] = useState(false);
  const [maxRoy, setMaxRoy] = useState(0);
  const [royalId, setRoyalId] = useState(0);
  const [perRoy, setPerRoy] = useState(0);
  const [loadingRoy, setLoadingRoy] = useState(false);

  useEffect(() => {
    if (sort || filstatus) {
      const query = { owner: me?.address };
      if (sort && sort !== "0") {
        const [sort_by, order_by ] = sort.split("/")
        query.sort_by = sort_by;
        query.order_by = order_by;
      }
      if (filstatus && filstatus !== "No") {
        query.status = filstatus;
      }
      dispatch(getListNFT(query));
    }
  }, [sort, filstatus]);

  useEffect(() => {
    if (me) {
      const query = { owner: me.address };
      dispatch(getListNFT(query));
    }
  }, [me])

  useEffect(() => {
    if (contractMarket) {
      contractMarket.methods
      .getFeePercent()
      .call()
      .then((res) => setFee((+res/1000)))
    }
  }, [contractMarket])

  useEffect(() => {
    if (contractNFT) contractNFT.methods
    .getMaxFreeCopyright()
    .call()
    .then((res) => {
      if (res) setMaxRoy(res/1000)
    })
  }, [contractNFT])

  const loadMore = () => {
    const query = { owner: me?.address };
    if (sort) {
      const [sort_by, order_by ] = sort.split("/")
      query.sort_by = sort_by;
      query.order_by = order_by;
    }
    if (filstatus && filstatus !== "No") {
      query.status = filstatus;
    }
    query.page = pagination.current_page + 1
    dispatch(getListNFT(query, true));
  }

  const cancelSell = (tokenId) => {
    contractMarket.methods
      .cancelSellOrder(tokenId)
      .send({from: me.address})
      .then(() => {
        setLoadingSell(false);
        setSell(null)
        toast.success("Cancel NFT successfully!");
        dispatch(getListNFT({owner: me.address}));
      })
      .catch(() => {
        setLoadingSell(false);
        setSell(null);
        toast.error({ message: "Cancel NFT error!" });
      })
  }

  const callSell = (tokenId) => {
    const realPrice = web3.utils.toWei(priceSell.toString(), "ether");
    contractMarket.methods
    .createSellOrder(tokenId, realPrice)
    .send({from: me.address})
    .then(() => {
      toast.success("Create Sell NFT successfully!")
      setSell(null)
      setPriceSell(0)
      setLoadingSell(false)
      setTimeout(() => {
        dispatch(getListNFT({owner: me.address}));
      }, 500)
    })
    .catch(() => {
      setSell(null)
      setPriceSell(0)
      setLoadingSell(false)
      toast.error({message: "You not confirm transaction!"})
    })
  }

  const setRoy = (tokenId) => {
    const realfee = +parseFloat((+perRoy*1000).toString()).toFixed(2);
    contractNFT.methods
      .setFeeCopyright(tokenId, realfee)
      .send({from: me.address})
      .then(() => {
        toast.success("Set Royalty successfully!")
        setPerRoy(0)
        setRoyalId(0)
        setLoadingRoy(false)
        setTimeout(() => {
          dispatch(getListNFT({owner: me.address}));
        }, 500)
      })
      .catch(() => {
        setPerRoy(0)
        setRoyalId(0)
        setLoadingRoy(false)
        toast.error({message: "You not confirm transaction!"})
      })
  }

  const renderNFT = (nft, i) => {
    const typeMedia = nft?.mine_type?.split("/")[0];
    const media = nft.media
      ? getFile(nft.media, typeMedia === "video")
      : "/assets/img/portfolio/default.jpeg";
    return (
      <Col sm="6" lg="4" key={i}>
        <div className="single_portfolio">
          <Link to={`/detail/${nft.token_id}`}>
            <div className="portfolio_img">
              {typeMedia === "image" ? (
                <LazyImage src={media} alt={nft.name} />
              ) : (
                <video
                  autoPlay={true}
                  loop={true}
                  playsInline={true}
                  src={media}
                />
              )}
            </div>
          </Link>

          <div className="portfolio_content">
            <h5>{nft.name}</h5>
            <h1 className="portfolio_title">
              <img src="/assets/img/icons/main-icon.svg" />{" "}
              {nft.price
                ? toDisplayNumber(+parseFloat(nft.price).toFixed(2))
                : 0}{" "}
              MON{" "}
              <span>
                ${toDisplayNumber(nft ? +nft?.price * priceToken : 0)}
              </span>
              <span className={`${statusNFt[nft?.status]?.color} float-right`}>
                {statusNFt[nft?.status]?.text}
              </span>
            </h1>
            <div className="row">
              <div className="col">
                <span className="float-right roy">Royalty fee: {nft?.feeCopyright || 0}%</span>
              </div>
            </div>
          {me && me.status ?
            <div className="row">
              <div className="col">
                <button
                  disabled={me?.address !== nft?.author?.address}
                  onClick={() => setRoyalId(nft.token_id)}
                  className="btn btn-option"
                >
                  <BsLightningFill /> Royalty
                </button>
              </div>
              <div className="col">
                {(nft.status === 2) && 
                  <button
                    disabled={loadingSell && sell?.token_id === nft.token_id}
                    className="btn btn-option"
                    onClick={() => {
                      setSell({token_id: nft.token_id, status: nft.status});
                      setLoadingSell(true)
                      cancelSell(nft.token_id);
                    }}
                  >
                    {(loadingSell && sell?.token_id === nft?.token_id)&& <div className="loader"></div>}
                    <BsFillXOctagonFill /> Cancel Sell
                  </button>
                }
                {(nft.status === 1) && 
                  <button
                    disabled={loadingSell && sell?.token_id === nft.token_id}
                    className="btn btn-option"
                    onClick={() => {
                      setSell({
                        token_id: nft.token_id,
                        status: nft.status,
                        price: nft.price,
                        name: nft.name
                      });
                    }}
                  >
                    <BsGearFill /> Set Sell
                  </button>
                }
              </div>
            </div>
            : <div className="mt-3 text-danger">Account has been locked</div>}
          </div>
        </div>
      </Col>
    );
  };

  const userReceived = +parseFloat((priceSell-(priceSell/100*fee)).toString()).toFixed(2);

  return (
    <>
      <HeadProfile user={me}/>
      <div className="portfolio-area">
        <Container>
          <Row>
            <Col>
              <div className="title">
                <h1 style={{fontWeight: 'bold'}}>NFT Created ({pagination?.total || 0})</h1>
              </div>
            </Col>
            <Col md={2}>
              <select
                className="form-control mt-2"
                onChange={(e) => setFilStatus(e.target.value)}
              >
                <option value="No">Filter Status</option>
                <option value="1">Pendding</option>
                <option value="2">On Sale</option>
              </select>
            </Col>
            <Col md={2}>
              <select
                className="form-control mt-2"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="0">Sort by</option>
                <option value="sell_at/desc">Recently Listed</option>
                <option value="price/desc">Price: High to Low</option>
                <option value="price/asc">Price: Low to Hight </option>
              </select>
            </Col>
          </Row>
          <InfiniteScroll
            dataLength={list.length}
            next={loadMore}
            hasMore={list.length && pagination?.current_page !== pagination?.last_page ? true : false}
            loader={<h4>Loading...</h4>}
          >
            <Row className={list.length ? "" : "justify-content-md-center"}>
              {list.length ? (
                list.map((nft, i) => renderNFT(nft, i))
              ) : (
                <p className="m-center mt-5 mb-5">No data</p>
              )}
            </Row>
          </InfiniteScroll>
        </Container>
      </div>
      <Modal show={!!royalId} onHide={() => setRoyalId(0)}>
        <Modal.Header closeButton>
          <Modal.Title>Set Royalty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className="mb-2">Precentage fee author (Max: {maxRoy}%)</label>
          <FormControl
            type="number"
            required={true}
            placeholder="Precentage"
            onChange={(e) => setPerRoy(+e.target.value)}
          />
          <Row className="mt-3">
            <Col>
            <button
              className="btn btn-cancel"
              disabled={loadingRoy}
              onClick={() => {
                setPerRoy(0)
                setRoyalId(0)
                setLoadingRoy(false)
              }}
            >
              {loadingRoy && <div className="loader"></div>}
              Cancel
            </button>
            </Col>
            <Col>
              <button
                className="btn btn-option"
                type="submit"
                disabled={loadingRoy}
                onClick={() => {
                  if (+perRoy > +maxRoy) {
                    toast.error({message: "Invalid percentage fee!"})
                    return;
                  }
                  setLoadingRoy(true)
                  setRoy(royalId)
                }}
              >
                {loadingRoy && <div className="loader"></div>}
                Set Royalty
            </button>
            </Col>
            </Row>
        </Modal.Body>
      </Modal>
      <Modal show={sell && sell.status === 1} onHide={() => setSell(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Set price sell NFT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className="mb-2">
            Price for <b>{sell?.name}</b> NFT:<br />
          </label>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>
                <img
                  src="/assets/img/icons/main-icon.svg" alt="icon"
                  style={{width: '23px', height: '23px'}}
                />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="number"
              required={true}
              placeholder="Amount"
              onChange={(e) => setPriceSell(+e.target.value)}
            />
          </InputGroup>
          <div className="creator-btn-area">
            <Row>
              <Col>
                <h1>Fees when sale</h1>
                <ul>
                  <li>Service Fee: <span>{fee}%</span></li>
                  <li>
                    You will receive:
                    <span>
                      {userReceived} MON - ${parseFloat((userReceived*+priceToken).toString()).toFixed(2)}
                    </span>
                  </li>
                </ul>
              </Col>
            </Row>
            <Row>
            <Col>
            <button
              className="btn btn-cancel"
              disabled={loadingSell}
              onClick={() => {
                setSell(null)
                setPriceSell(0)
                setLoadingSell(false)
              }}
            >
              {loadingSell && <div className="loader"></div>}
              Cancel
            </button>
            </Col>
            <Col>
              <button
              className="btn btn-option"
              type="submit"
              disabled={loadingSell}
              onClick={() => {
                setLoadingSell(true)
                callSell(sell.token_id)
              }}
            >
              {loadingSell && <div className="loader"></div>}
              Sell NFT
            </button>
            </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
