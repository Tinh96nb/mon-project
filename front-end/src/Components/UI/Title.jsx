import React from 'react'

const Title = (props) => {
  return (
    <>
      <div className="title">
        <h1>{props.title} <span>{props.titleSpan}</span></h1>
      </div>
    </>
  )
}

export default Title
