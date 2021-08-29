import React from 'react'
import { Link } from 'react-router-dom'
const MainMenu = () => {
  return (
    <>
      <ul className="mainNav">
        <li><Link to="/marketplace">Marketplace</Link></li>
        <li><Link to="/colletion">Creators</Link> </li>
        <li><Link to="/details">Connect Wallet</Link></li>
      </ul>
    </>
  )
}

export default MainMenu
