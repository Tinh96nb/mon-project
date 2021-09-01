import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const MainMenu = (props) => {

  // @ts-ignore
  const { userAddress } = useSelector((store) => store.home)

  return (
    <>
      <ul className="mainNav">
        <li><Link to="/marketplace">Marketplace</Link></li>
        <li><Link to="/details">Creators</Link></li>
        <li>
          {userAddress
          ? <a style={{cursor: "pointer"}}>
              {userAddress.substring(0, 4)+'...'+userAddress.substring(userAddress.length -4, userAddress.length)}
            </a>
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
