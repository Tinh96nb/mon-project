import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <div className="logo-area">
      <Link to="/"><img src="/assets/img//logo/logo.png" alt="logo" /></Link>
    </div>
  )
}

export default Logo
