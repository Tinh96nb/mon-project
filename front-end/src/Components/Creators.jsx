import { useEffect } from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchListUser } from 'redux/userReducer'
import { displayAddress, getFile } from 'utils/hepler'
import Title from './UI/Title'

const Portfolio = () => {

  const dispatch = useDispatch();

  const {list} = useSelector((store) => store.user)

  useEffect(() => {
    dispatch(fetchListUser())
  }, [])

  return (
    <div className="creators-area">
      <Container>
        <Row>
          <Col>
          <Title title="Favorite Creators" titleSpan="(View all)" linkSpan="/creators"/>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="creator_list">
              {list.map((user, i) => {
                const avt = user?.avatar
                ? getFile(user.avatar)
                : "/assets/img/user/avatar.jpg";
                return <div className="single-creator" key={i}>
                  <div className="creatorImgs">
                    <Link to={`/creator/${user.address}`}>
                      <img className="bigImg" src={avt} alt="avatar" />
                    </Link>
                  </div>
                  <div className="creator_link text-center">
                      <Link to={`/creator/${user.address}`}>
                      {user?.username || displayAddress(user?.address, 4)}
                      </Link>
                  </div>
                </div>
              })}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Portfolio
