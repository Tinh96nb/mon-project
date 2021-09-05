import {Container, Row, Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Socials from './UI/Socials'
import { displayAddress, getFile } from 'utils/hepler'

const UserDetails = ({owner}) => {
  const avt = owner && owner.avatar ? getFile(owner.avatar) : '/assets/img/user/avatar.jpg';
  return (
    <>
      <div className="userdetails_area">
        <Container>
          <Row>
            <Col lg="6" className="align-self-center">
              <div className="userDetails">
                <div className="user_img">
                  <Link to={`/creator/${owner?.address}`}>
                    <img src={avt} alt="avatar user" />
                  </Link>
                </div>
                <h2>{owner?.username || displayAddress(owner?.address)}</h2>
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
                    <Socials user={owner} />
                  </div>
                </div>
              </div>
            </Col>
            {/* <Col lg="6" className="text-md-right align-self-center">
              <UserNave />
            </Col> */}
          </Row>
        </Container>
      </div>
    </>
  )
}

export default UserDetails
