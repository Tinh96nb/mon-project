import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
const Socials = () => {
  return (
    <>
      <div className="socials">
        <ul>
          <li><Link to=""><FaFacebookF /></Link> </li>
          <li><Link to=""><FaTwitter /></Link></li>
          <li><Link to=""><FaInstagram /></Link></li>
        </ul>
      </div>
    </>
  )
}

export default Socials
