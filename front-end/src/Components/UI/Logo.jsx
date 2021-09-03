import React from 'react'
import { Link } from 'react-router-dom'
import HeaderDemoData from '../../DemoData/HeaderDemoData.json'
const Logo = () => {
  return (
    <>
      <div className="logo-area">
          <Link to="/"><img src={process.env.PUBLIC_URL + `/assets/img/${HeaderDemoData.logo}`} alt="logo" /></Link>
        </div>
    </>
  )
}

export default Logo
