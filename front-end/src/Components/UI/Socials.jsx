import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Socials = ({user}) => {
  return (
    <>
      <div className="socials">
        <ul>
          <li><a href={user?.facebook} target="_blank"><FaFacebookF /></a> </li>
          <li><a href={user?.twitter} target="_blank"><FaTwitter /></a></li>
          <li><a href={user?.instagram} target="_blank"><FaInstagram /></a></li>
        </ul>
      </div>
    </>
  )
}

export default Socials
