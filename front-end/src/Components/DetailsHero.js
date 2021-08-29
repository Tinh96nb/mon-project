import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import DetailsHeroData from '../DemoData/DetailsHeroData.json'
const DetailsHero = () => {
  return (
    <>
      <div className="detailsHeroArea">
      <Container>
        <Row>
          <Col xs="12" lg="6" className="align-self-center">
            <div className="detailsHeroImg">
              <img src={process.env.PUBLIC_URL + `/assets/img/${DetailsHeroData.DetailsHeroImg}`} alt="" />
            </div>
          </Col>
          <Col xs="12" lg="6" className="align-self-center">
            <div className="detailsHeroDeta">
              <h1>{DetailsHeroData.title}</h1>
              <p>{DetailsHeroData.pera}.</p>

              <h6 className="current_price">{DetailsHeroData.currentPrice}</h6>
              <h2><img src={process.env.PUBLIC_URL + `/assets/img/${DetailsHeroData.priceImg}`} alt="" /> {DetailsHeroData.piceValue}</h2>
              <h5>{DetailsHeroData.priceValueSpan}</h5>

              <Link to={DetailsHeroData.buttonLink} className="buyNow_btn">{DetailsHeroData.buttonText}</Link>

              <div className="creators_details">
                <p>Creator: <span>{DetailsHeroData.Creator}</span></p>
                <p>Edition: <span>{DetailsHeroData.Edition}</span></p>
              </div>
              <div className="creator_addre">
                <p>Contract Address: <span>{DetailsHeroData.address}</span></p>
                <p>Token ID: <span>{DetailsHeroData.token}</span></p>
                <p>Blockchain: <span> {DetailsHeroData.chain}</span></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      </div>
    </>
  )
}

export default DetailsHero
