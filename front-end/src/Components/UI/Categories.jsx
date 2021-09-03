import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'
const Categories = () => {
  return (
    <>
      <div className="categories-area">
      <Container>
        <Row>
          <Col>
            <div className="categories">
              <ul>
                <li><Link to="#">All</Link></li>
                <li><Link to="#">Photography</Link></li>
                <li><Link to="#">Celebrities</Link></li>
                <li><Link to="#">Games</Link></li>
                <li><Link to="#">Sport</Link></li>
                <li><Link to="#">Music</Link></li>
                <li><Link to="#">Crypto</Link></li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
      </div>
    </>
  )
}

export default Categories
