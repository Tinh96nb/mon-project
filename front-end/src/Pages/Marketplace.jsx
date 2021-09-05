
import React, { Component } from 'react'

import Portfolio from '../Components/Portfolio'
import Creators from '../Components/Creators'
import Categories from '../Components/UI/Categories'

export default class Home extends Component {
  render() {
    return (
      <>
        <Categories />
        <Creators />
        <Portfolio />
      </>
    )
  }
}
