import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListNFT } from "redux/nftReducer";
import { displayAddress, getFile, toDisplayNumber } from "utils/hepler";
import { Link , useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { detailUser, postLogin, toggleFollow } from "redux/userReducer";
import Socials from "Components/UI/Socials";
import LazyImage from "Components/LazyImage";
import toast from "Components/Toast";

export default function Creator() {

  const dispatch = useDispatch();
  const {address} = useParams();

  const { list, pagination } = useSelector((state) => state.nft);
  const { userAddress, priceToken } = useSelector((state) => state.home);
  const { user, authChecked } = useSelector((state) => state.user);

  const [sort, setSort] = useState(null);

  useEffect(() => {
    if (sort) {
      const query = { owner: user?.address, status: '1,2'};
      if (sort === "0") return dispatch(getListNFT(query));
      const [sort_by, order_by ] = sort.split("/")
      query.sort_by = sort_by;
      query.order_by = order_by;
      dispatch(getListNFT(query));
    }
  }, [sort]);

  useEffect(() => {
    if (address)
    dispatch(detailUser(address))
  }, [address])

  useEffect(() => {
    if (user) {
      const query = { owner: user.address, status: '1,2'};
      dispatch(getListNFT(query));
    }
  }, [user])

  const loadMore = () => {
    const query = { owner: user?.address, status: '1,2'};
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
            {nft.status === 2 && <h1 className="portfolio_title">
              <img src="/assets/img/icons/main-icon.svg" />{" "}
              {nft.price
                ? toDisplayNumber(+parseFloat(nft.price).toFixed(2))
                : 0}{" "}
              MON{" "}
              <span>
                ${toDisplayNumber(nft ? +nft?.price * priceToken : 0)}
              </span>
            </h1>}
            <div className="author">
              <img src={avt} alt={nft.owner?.address} />
              <Link to={`/creator/${nft?.owner?.address}`}>
                {nft?.owner?.username || displayAddress(nft?.owner?.address)}
              </Link>
            </div>
          </div>
        </div>
      </Col>
    );
  };

  const avt = user?.avatar ? getFile(user.avatar) : "/assets/img/user/avatar.jpg";
  const isFollowed = user?.followers.length && 
    user?.followers.indexOf(userAddress) !== -1
  return (
    <>
      <div className="userdetails_area pb-0">
        <Container>
          <Row>
            <Col lg="6" className="align-self-center">
              <div className="userDetails">
                <div className="user_img">
                  <img src={avt} alt="avatar user" />
                </div>
                <h2>{user?.username || displayAddress(user?.address)}</h2>
                <ul>
                  <li>{pagination?.total} NFTs</li>
                  <li>{user?.followers?.length} Followers</li>
                  <li>{user?.followings?.length} Following</li>
                </ul>

                <div className="follow-btn-wrap">
                  <div>
                  <button
                      className={`follow_btn ${isFollowed ? 'active': ''}`}
                      disabled={userAddress === user?.address}
                      onClick={() => {
                        if (!userAddress) return toast.error({message: "You must be connect metamask!"})
                        if (!authChecked) {
                          dispatch(postLogin((res) => {
                            if (res) {
                              dispatch(toggleFollow(user.address, (ok) => {
                                if (ok) dispatch(detailUser(user.address));
                              }))
                            }
                          }))
                          return;
                        }
                        dispatch(toggleFollow(user.address, (res) => {
                          if (res) dispatch(detailUser(user.address));
                        }))
                      }}
                    >
                        {isFollowed ? 'Unfollow' : 'Follow'}
                    </button>
                  </div>
                  <div>
                    <Socials user={user}/>
                  </div>
                </div>

              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="text-bio">{user?.bio}</p>
            </Col>
          </Row>
        </Container>
      </div>
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
    </>
  );
}
