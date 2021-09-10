import {Container, Row, Col} from 'react-bootstrap'

import {Link} from 'react-router-dom'

const HomeWelcome = () => {
  return (
    <>
      <div className="welcome-area section-padding2">
      <Container>
        <Row>
          <Col lg="6 align-self-center">
            <div className="welcome-img">
              <img src={process.env.PUBLIC_URL + `/assets/img/bg/welcome-bg.png`} alt="" />
            </div>
          </Col>
          <Col lg="6 align-self-center">
            <div className="wel-title ml-lg-5">
              <small className="title-top"><img src={process.env.PUBLIC_URL + `/assets/img/icons/small-icon.png`} alt="" /> @ModeratsArt</small>
              <h1>After Tomorrow</h1>
              <h4>Current price</h4>
              <h2><img src={process.env.PUBLIC_URL + `/assets/img/icons/main-icon.png`} alt="" />3.0251 MON</h2>
              <h5>$10,653.65</h5>

              <div className="button-group">
                <Link className="cbtn cbtn-black" to="#">Buy now</Link>
                <Link className="cbtn cbtn-white" to="#">View artwork</Link>
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
