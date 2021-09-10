import {Container, Row, Col} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { getFile } from 'utils/hepler';
import Socials from './Socials'

const CollectionHero = ({user}) => {

  const avt = user && user.avatar ? getFile(user.avatar) : '/assets/img/user/avatar.jpg';

  return (
    <>
    <div className="userdetails_area">
        <Container>
          <Row>
            <Col lg="6" className="align-self-center">
              <div className="userDetails">
                <div className="user_img">
                  <img src={avt} alt="avatar user" />
                </div>
                <h2>{user?.username}</h2>
                <ul>
                  <li>{user?.amountNFT} NFTs</li>
                  <li>{user?.followers} Followers</li>
                  <li>{user?.followings} Following</li>
                </ul>

                <div className="follow-btn-wrap">
                  <div>
                    <button className="follow_btn">Follow</button>
                  </div>
                  <div>
                    <Socials user={user}/>
                  </div>
                </div>

              </div>
            </Col>
            <Col lg="6" className="text-md-right align-self-center">
            <div className="usernave">
              <ul>
                <li><Link to="/edit-profile">Edit profile</Link></li>
              </ul>
            </div>
            </Col>
          </Row>
          <Row>
            <Col>
            <p className="text-bio">{user?.bio}</p>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="collection_hero">
        <Container>
          <Row>
            <Col>
              <form>
                <input type="text" />
              </form>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default CollectionHero
