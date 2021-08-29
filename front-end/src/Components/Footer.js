import React, { Component } from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'
export default class Footer extends Component {
  render() {
    return (
      <>
        <div className="footer-area black-bg">
          <Container>
            <Row>
              <Col lg="6 align-self-center">
                <div className="footer-menu">
                  <ul>
                    <li>
                      <Link to="#">Facebook</Link>
                      <Link to="#">Twitter</Link>
                      <Link to="#">Instagram</Link>
                      <Link to="#">Telegram</Link>
                      <Link to="#">Medium</Link>
                    </li>
                  </ul>
                </div>
                
              </Col>
              <Col lg="6" className="text-md-right align-self-center">
                <div className="footer-menu">
                  <ul>
                    <li>
                      <Link to="#">About</Link>
                      <Link to="#">Terms of Service</Link>
                      <Link to="#">Privacy</Link>
                      <Link to="#">Careers</Link>
                      <Link to="#">Help</Link>
                    </li>
                  </ul>
                </div>
              </Col> 
            </Row>
          </Container>
        </div>
      </>
    )
  }
}
