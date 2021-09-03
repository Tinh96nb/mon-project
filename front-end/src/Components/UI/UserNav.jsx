import React from 'react'
import {Link} from 'react-router-dom'
const UserNav = () => {
  return (
    <>
      <div className="usernave">
        <ul>
          <li><Link to="/creator-form">Creation</Link></li>
          <li><Link to="/edit-profile">Collection</Link></li>
          <li><Link to="#">About</Link></li>
        </ul>
      </div>
    </>
  )
}


export default UserNav
