import {Container, Row, Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import { displayAddress, getFile, toDisplayNumber } from 'utils/hepler';

const HomeWelcome = ({nft, priceToken}) => {
  const media = nft?.media
    ? getFile(nft.media)
    : "/assets/img/portfolio/avatar.jpg";
  const typeMedia = nft?.mine_type?.split("/")[0];
  const avt = nft?.owner && nft?.owner?.avatar ? getFile(nft?.owner?.avatar) : '/assets/img/user/avatar.jpg';

  return (
    <>
      <div className="welcome-area section-padding2">
      <Container>
        <Row>
          <Col lg="6 align-self-center">
            <div className="welcome-img">
              {typeMedia === "image" ? (
                  <img src={media} alt={nft?.name} />
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
                <img src={process.env.PUBLIC_URL + `/assets/img/icons/main-icon.png`} alt="" />
                {toDisplayNumber(nft?.price || 0)} MON
              </h2>
              <h5>${toDisplayNumber(nft ? +parseFloat((+nft?.price * priceToken).toString()).toFixed(2) : 0)}</h5>
              <div className="button-group">
                <Link className="cbtn cbtn-black" to={`/detail/${nft?.token_id}`}>Buy now</Link>
                <Link className="cbtn cbtn-white" to={`/creator/${nft?.owner?.address}`}>View artwork</Link>
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
