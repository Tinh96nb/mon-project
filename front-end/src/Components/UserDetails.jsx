import {Container, Row, Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Socials from './UI/Socials'
import { displayAddress, getFile } from 'utils/hepler'
import { useDispatch, useSelector } from 'react-redux'
import { postLogin, toggleFollow } from 'redux/userReducer'
import { getDetail } from 'redux/nftReducer'
import toast from './Toast'

const UserDetails = ({tokenId, owner}) => {

  const dispatch = useDispatch();
  const { userAddress } = useSelector((state) => state.home)
  const { authChecked } = useSelector((state) => state.user )
  const avt = owner && owner.avatar ? getFile(owner.avatar) : '/assets/img/user/avatar.jpg';

  const isFollowed = owner?.followers.length && 
    owner?.followers.indexOf(userAddress) !== -1

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
                  <li>{owner?.amountNFT || 0} NFTs</li>
                  <li>{owner?.followers.length || 0} Followers</li>
                  <li>{owner?.followings.length || 0} Following</li>
                </ul>

                <div className="follow-btn-wrap">
                  <div>
                    <button
                      className={`follow_btn ${isFollowed ? 'active': ''}`}
                      disabled={userAddress === owner?.address}
                      onClick={async () => {
                        if (!userAddress) return toast.error({message: "You must be connect metamask!"})
                        if (!authChecked) {
                          dispatch(postLogin((res) => {
                            if (res) {
                              dispatch(toggleFollow(owner.address, (ok) => {
                                if (ok) dispatch(getDetail(tokenId));
                              }))
                            }
                          }))
                          return;
                        }
                        dispatch(toggleFollow(owner.address, (res) => {
                          if (res) dispatch(getDetail(tokenId));
                        }))
                      }}
                    >
                        {isFollowed ? 'Unfollow' : 'Follow'}
                    </button>
                  </div>
                  <div>
                    <Socials user={owner} />
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="6" className="text-md-right align-self-center">
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default UserDetails
