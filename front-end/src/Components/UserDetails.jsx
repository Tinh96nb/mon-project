import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import UserNave from './UI/UserNav'
import UserData from '../DemoData/UserDetailsData.json'
import Socials from './UI/Socials'
const UserDetails = () => {
  return (
    <>
      <div className="userdetails_area">
        <Container>

          <Row>
            <Col lg="6" className="align-self-center">
              <div className="userDetails">
                <div className="user_img">
                  <img src={process.env.PUBLIC_URL + `/assets/img/${UserData.userImg}`} alt="" />

                </div>
                <h2>{UserData.useName}</h2>
                <ul>
                  <li>{UserData.userFollowers} Followers</li>
                  <li>{UserData.userFollowing} Following</li>
                  <li>{UserData.userViews} views</li>
                </ul>

                <div className="follow-btn-wrap">
                  <div>
                    <Link className="follow_btn"> Follow</Link>
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
      </div>
    </>
  )
}

export default UserDetails
