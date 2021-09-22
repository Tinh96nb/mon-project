import Creators from "../Components/Creators";
import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListNFT, getNFTTop } from "redux/nftReducer";
import { displayAddress, getFile, toDisplayNumber } from "utils/hepler";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import HomeWelcome from "Components/HomeWelcome";
import LazyImage from "Components/LazyImage";

export default function Marketplace() {
  const dispatch = useDispatch();

  const { list, pagination, top } = useSelector((state) => state.nft);
  const { priceToken } = useSelector((state) => state.home);
  const [sort, setSort] = useState(null);

  useEffect(() => {
    const query = { status: 2 };
    if (sort && sort !== "0") {
      const [sort_by, order_by ] = sort.split("/")
      query.sort_by = sort_by;
      query.order_by = order_by;
    }
    dispatch(getListNFT(query));
  }, [sort]);

  useEffect(() => {
    dispatch(getNFTTop());
  }, [])

  const loadMore = () => {
    const query = { status: 2 };
    if (sort) {
      const [sort_by, order_by ] = sort.split("/")
      query.sort_by = sort_by;
      query.order_by = order_by;
    }
    query.page = pagination.current_page + 1
    dispatch(getListNFT(query, true));
  }

  const renderNFT = (nft, i) => {
    const avt = nft.owner?.avatar
      ? getFile(nft.owner.avatar)
      : "/assets/img/user/avatar.jpg";
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
              <img src="/assets/img/icons/main-icon.png" />{" "}
              {nft.price
                ? toDisplayNumber(+parseFloat(nft.price).toFixed(2))
                : 0}{" "}
              MON{" "}
              <span>
                ${toDisplayNumber(nft ? +nft?.price * priceToken : 0)}
              </span>
            </h1>
            <div className="author">
              <LazyImage src={avt} alt={nft.owner?.address} />
              <Link to={`/creator/${nft?.owner?.address}`}>
                {nft?.owner?.username || displayAddress(nft?.owner?.address)}
              </Link>
            </div>
          </div>
        </div>
      </Col>
    );
  };

  return (
    <>
      <HomeWelcome nft={top} priceToken={priceToken}/>
      <Creators />
      <div className="portfolio-area">
        <Container>
          <Row>
            <Col>
              <div className="title">
                <h1>Featured artworks</h1>
              </div>
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
            dataLength={list?.length}
            next={loadMore}
            hasMore={pagination?.current_page !== pagination?.last_page}
            loader={<h4>Loading...</h4>}
          >
            <Row className={list.length ? "" : "justify-content-md-center"}>
              {list.length ? (
                list.map((nft, i) => renderNFT(nft, i))
              ) : (
                <p className="mt-5 mb-5">No data</p>
              )}
            </Row>
          </InfiniteScroll>
        </Container>
      </div>
    </>
  );
}
