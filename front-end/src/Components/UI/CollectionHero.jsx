import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import CollectionData from '../../DemoData/CollectionHeroData.json'

const CollectionHero = () => {
  return (
    <>
      <div className="collection_hero">
        <Container>
          <Row>
            <Col>
              <div className="collectionInner">
                <p>{CollectionData.pera}</p>

                <img src={process.env.PUBLIC_URL + `/assets/img/${CollectionData.collectionImg}`} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default CollectionHero
