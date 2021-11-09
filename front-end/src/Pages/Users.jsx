import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUser } from "redux/userReducer";
import { displayAddress, getFile, toDisplayNumber } from "utils/hepler";
import { Link, useLocation } from "react-router-dom";
import LazyImage from "Components/LazyImage";
import { detailUser, postLogin, toggleFollow } from "redux/userReducer";
import toast from "Components/Toast";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Marketplace() {
  const dispatch = useDispatch();

  const { all, authChecked } = useSelector((state) => state.user);
  const { userAddress } = useSelector((state) => state.home);

  useEffect(() => {
    dispatch(fetchAllUser());
  }, []);

  const renderUser = (user, i) => {
    const avt = user?.avatar
      ? getFile(user.avatar)
      : "/assets/img/user/avatar.jpg";
    const cover = user?.cover
      ? getFile(user.cover)
      : "/assets/img/user/cover.jpeg";

    const isFollowed =
      user?.followers.length && user?.followers.indexOf(userAddress) !== -1;

    return (
      <Col sm="6" lg="4" key={i}>
        <div className="single_portfolio">
          <Link to={`/detail/${user.address}`}>
            <div className="cover">
              <LazyImage src={cover} alt={user.username} />
            </div>
          </Link>
          <div className="content-createtor">
            <div className="avt">
              <Link to={`/detail/${user.address}`}>
                <LazyImage src={avt} alt={user.username} />
              </Link>
              <ul className="social">
                <li>
                  <a href={user?.facebook} target="_blank">
                    <FaFacebookF />
                  </a>{" "}
                </li>
                <li>
                  <a href={user?.twitter} target="_blank">
                    <FaTwitter />
                  </a>
                </li>
                <li>
                  <a href={user?.instagram} target="_blank">
                    <FaInstagram />
                  </a>
                </li>
              </ul>
            </div>
            <h1>
              {user?.username || displayAddress(user?.address)}
              {user?.verify ? <svg viewBox="0 0 24 24" aria-label="Verified account" className="r-1fmj7o5 r-4qtqp9 r-yyyyoo r-1xvli5t r-9cviqr r-f9ja8p r-og9te1 r-bnwqim r-1plcrui r-lrvibr"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg> : null}
            </h1>
            <p>{user?.bio?.length > 250 ? `${user?.bio.substr(0,250)}...` : user?.bio}</p>
          </div>
        <div className="creator-bt">
          <span>{user.favorite || 0} Followers</span>
          <button
            className={`cbtn ${!isFollowed ? "cbtn-white" : "cbtn-black"}`}
            disabled={userAddress === user?.address}
            onClick={() => {
              if (!userAddress)
                return toast.error({
                  message: "You must be connect metamask!",
                });
              if (!authChecked) {
                dispatch(
                  postLogin((res) => {
                    if (res) {
                      dispatch(
                        toggleFollow(user.address, (ok) => {
                          if (ok) dispatch(fetchAllUser());
                        })
                      );
                    }
                  })
                );
                return;
              }
              dispatch(
                toggleFollow(user.address, (res) => {
                  if (res) dispatch(fetchAllUser());
                })
              );
            }}
          >
            {isFollowed ? "Unfollow" : "Follow"}
          </button>
        </div>
        </div>
      </Col>
    );
  };

  return (
    <>
      {/* <Creators /> */}
      <div className="portfolio-area">
        <Container>
          <Row>
            <Col>
              <div className="title">
                <h1>All Creators</h1>
              </div>
            </Col>
          </Row>
          <Row className={all.length ? "" : "justify-content-md-center"}>
            {all.length ? (
              all.map((user, i) => renderUser(user, i))
            ) : (
              <p className="m-center mt-5 mb-5">No data</p>
            )}
          </Row>
        </Container>
      </div>
    </>
  );
}
