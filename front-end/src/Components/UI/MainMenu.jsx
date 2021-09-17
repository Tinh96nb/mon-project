import { Link } from 'react-router-dom'
import { displayAddress, getFile, toDisplayNumber } from 'utils/hepler'

const MainMenu = ({balance, me, setConnect, logout}) => {

  const renderUser = () => {
    const avt = me && me.avatar ? getFile(me.avatar) : '/assets/img/user/avatar.jpg';
    return <div className="user-pro">
      <div className="info-tab">
        <div className="balance">
          {toDisplayNumber(+parseFloat(balance).toFixed(2))} MON
        </div>
        <div className="info">
          {displayAddress(me.address)}
        </div>
      </div>
      <div className="avt">
          <Link className="clear-css" to="/profile"><img src={avt} /></Link>
          <div className="dropdown-content">
            <ul className="dropdown-list" >
              <li><Link to="/profile">Profile</Link></li>
              <li>
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    logout()
                  }}
                >
                  Logout
                  </a>
              </li>
            </ul>
          </div>
      </div>
    </div>
  }
  return (
    <ul className="mainNav">
      <li><Link to="/marketplace">Marketplace</Link></li>
      <li><Link to="/mint">Create</Link></li>
      <li>
        {me?.address
        ? renderUser()
        : <a className="connect" style={{cursor: "pointer"}} onClick={() => setConnect()}>
            Connect
          </a>
        }
      </li>
    </ul>
  )
}

export default MainMenu
