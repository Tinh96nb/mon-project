import {Container, Row, Col} from 'react-bootstrap'

const CollectionHero = () => {
  return (
    <>
    {/* <div className="userdetails_area">
        <Container>
          <Row>
            <Col lg="6" className="align-self-center">
              <div className="userDetails">
                <div className="user_img">
                  <Link to={`/creator/${owner?.address}`}>
                    <img src={avt} alt="avatar user" />
                  </Link>
                </div>
                <h2>{owner?.username}</h2>
                <ul>
                  <li>{owner?.amountNFT} NFTs</li>
                  <li>{owner?.followers} Followers</li>
                  <li>{owner?.followings} Following</li>
                </ul>

                <div className="follow-btn-wrap">
                  <div>
                    <button className="follow_btn">Follow</button>
                  </div>
                  <div>
                    <Socials />
                  </div>
                </div>

              </div>
            </Col>
            <Col lg="6" className="text-md-right align-self-center">
              <UserNave />
            </Col>
          </Row>
        </Container>
      </div> */}
      <div className="collection_hero">
        <Container>
          <Row>
            <Col>
              <div className="collectionInner">
                {/* <p>{CollectionData.pera}</p>

                <img src={process.env.PUBLIC_URL + `/assets/img/${CollectionData.collectionImg}`} alt="" /> */}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default CollectionHero
