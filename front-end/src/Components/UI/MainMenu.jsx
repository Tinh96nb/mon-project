import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchUser, getBalance } from 'redux/userReducer'
import { getFile } from 'utils/hepler'

const MainMenu = (props) => {
  const { userAddress, contractToken } = useSelector((store) => store.home)
  const { balance, me } = useSelector((store) => store.user)

  const dispatch = useDispatch();

  useEffect(() => {
    if (userAddress) {
      dispatch(fetchUser(userAddress));
    }
  }, [userAddress])

  useEffect(() => {
    if (userAddress && contractToken) {
      dispatch(getBalance())
    }
  }, [userAddress, contractToken])

  const renderUser = () => {
    const avt = me && me.avatar ? getFile(me.avatar) : '/assets/img/icons/upload-top-logo.png';
    return <div className="user-pro">
      <div className="info-tab">
        <div className="balance">{balance} MON</div>
        <div className="info">
          {userAddress.substring(0, 5)+'...'+userAddress.substring(userAddress.length -4, userAddress.length)}
        </div>
      </div>
      <div className="avt">
          <img src={avt} />
      </div>
    </div>
  }
  return (
    <>
      <ul className="mainNav">
        <li><Link to="/marketplace">Marketplace</Link></li>
        <li><Link to="/details">Creators</Link></li>
        <li>
          {userAddress
          ? renderUser()
          : <a style={{cursor: "pointer"}} onClick={() => props.setConnect()}>
              Connect
            </a>
          }
        </li>
      </ul>
    </>
  )
}

export default MainMenu
