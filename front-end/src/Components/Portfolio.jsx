import { Container, Row, Col } from "react-bootstrap";
import Title from "./UI/Title";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListNFT } from "redux/nftReducer";
import { displayAddress, getFile, toDisplayNumber } from "utils/hepler";

const Portfolio = () => {
  const dispatch = useDispatch();

  const { list } = useSelector((state) => state.nft);
  const { priceToken } = useSelector((state) => state.home);

  useEffect(() => {
    dispatch(getListNFT({}));
  }, []);

  return (
    <>
      <div className="portfolio-area">
        <Container>
          <Row>
            <Col>
              <Title title="Featured artworks" />
            </Col>
          </Row>
          <Row>
            {list.map((nft, i) => {
              const avt = nft.owner?.avatar
                ? getFile(nft.owner.avatar)
                : "/assets/img/user/avatar.jpg";
              const media = nft.media
                ? getFile(nft.media)
                : "/assets/img/portfolio/default.jpeg";
              return (
                <Col sm="6" lg="4" key={i}>
                  <div className="single_portfolio">
                    <Link to={`/detail/${nft.token_id}`}>
                      <div className="portfolio_img">
                        <img src={media} alt={nft.name} />
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
                          ${toDisplayNumber(nft ? parseFloat((+nft?.price * priceToken).toString()).toFixed(2) : 0)}
                        </span>
                      </h1>
                      <div className="author">
                        <img src={avt} alt={nft.owner?.address} />
                        <Link to={`/creator/${nft?.owner?.address}`}>
                          {nft?.owner?.username ||
                            displayAddress(nft?.owner?.address)}
                        </Link>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Portfolio;
