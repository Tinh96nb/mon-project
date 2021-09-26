import { useEffect, useState } from 'react';
import {Container, Row, Col} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import {Link, useHistory} from 'react-router-dom'
import { getAllowance, getBalance, setMAxAllowance } from 'redux/userReducer';
import { displayAddress, getFile, toDisplayNumber } from 'utils/hepler';
import LazyImage from './LazyImage';
import toast from './Toast';

const HomeWelcome = ({nft, priceToken}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { userAddress, contractMarket, contractToken } = useSelector((state) => state.home);
  const { allowance } = useSelector((state) => state.user);
  
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (userAddress && contractToken) {
      dispatch(getAllowance());
    }
  }, [userAddress, contractToken]);

  const setBuy = () => {
    contractMarket.methods
      .purchase(nft.token_id)
      .send({ from: userAddress })
      .then((res) => {
        setLoading(false);
        toast.success("Buy NFT successfully!");
        dispatch(getBalance());
        history.push("/profile");
      })
      .catch((e) => {
        setLoading(false);
        toast.error({ message: "Buy NFT error!" });
      });
  };

  const media = nft?.media
    ? getFile(nft.media)
    : "/assets/img/portfolio/default.jpeg";
  const typeMedia = nft?.mine_type?.split("/")[0];
  const avt = nft?.owner && nft?.owner?.avatar ? getFile(nft?.owner?.avatar) : '/assets/img/user/avatar.jpg';

  return (
    <>
      <div className="welcome-area section-padding2">
      <Container>
        <Row>
          <Col lg="6 align-self-center">
            <div className="welcome-img">
              <div className="bor-top"></div>
              <div className="tg-left"></div>
              <div className="tg-right"></div>
              {typeMedia === "image" ? (
                  <LazyImage src={media} alt={nft?.name} />
                ) : (
                  <video
                    autoPlay={true}
                    loop={true}
                    playsInline={true}
                    src={media}
                  />
              )}
            </div>
          </Col>
          <Col lg="6 align-self-center">
            <div className="wel-title ml-lg-5">
              <small className="title-top">
                <img src={avt} alt="avatar" /> @{nft?.owner?.username || displayAddress(nft?.owner?.address)}
              </small>
              <h1>{nft?.name}</h1>
              <h4>Current price</h4>
              <h2>
                <img src={process.env.PUBLIC_URL + `/assets/img/icons/main-icon.svg`} alt="" />
                {toDisplayNumber(nft?.price || 0)} MON
              </h2>
              <h5>${toDisplayNumber(nft ? +parseFloat((+nft?.price * priceToken).toString()).toFixed(2) : 0)}</h5>
              <div className="button-group">
                <button
                  disabled={loading}
                  className="cbtn cbtn-black"
                  onClick={() => {
                    setLoading(true)
                    if (+allowance <= +nft.price) {
                      const cb = (res) => {
                        setLoading(false);
                        if (res) setBuy();
                        else
                          toast.error({message: "You must be approve to buy NFT!"});
                      };
                      return dispatch(setMAxAllowance(cb));
                    };
                    setBuy();
                  }}
                >
                  {loading && <div className="loader"></div>}
                  Buy now
                </button>
                <Link className="cbtn cbtn-white" to={`/detail/${nft?.token_id}`}>View artwork</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      </div>
    </>
  )
}

export default HomeWelcome
