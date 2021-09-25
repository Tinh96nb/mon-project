import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
import { displayAddress, getFile, toDisplayNumber } from 'utils/hepler'

const MainMenu = ({balance, me, setConnect, logout, mobileNavSet, mobileNav = false}) => {

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
          <Link
            className="clear-css" to="/profile"
            onClick={() => {
              if (mobileNav) mobileNavSet(false)
            }}
          >
              <img src={avt} />
          </Link>
          <div className="dropdown-content">
            <ul className="dropdown-list" >
              <li>
                <Link
                onClick={() => {
                  if (mobileNav) mobileNavSet(false)
                }}
                to="/profile"
                >
                  Profile
                </Link>
              </li>
              <li>
                <a
                  href=""
                  onClick={(e) => {
                    if (mobileNav) mobileNavSet(false)
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
      <li>
        <Link
          to="/marketplace"
          onClick={() => {
            if (mobileNav) mobileNavSet(false)
          }}
        >
          Marketplace
        </Link>
        </li>
      <li>
        <Link
          to="/mint"
          onClick={() => {
            if (mobileNav) mobileNavSet(false)
          }}
        >
          Create
        </Link>
        </li>
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
