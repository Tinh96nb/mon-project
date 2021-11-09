import { Link } from "react-router-dom"

const Title = (props) => {
  return (
    <>
      <div className="title">
        <h1>{props.title} <Link to={props.linkSpan}><span>{props.titleSpan}</span></Link></h1>
      </div>
    </>
  )
}

export default Title
