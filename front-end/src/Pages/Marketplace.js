
import React, { Component } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import Portfolio from '../Components/Portfolio'
import Creators from '../Components/Creators'
import Categories from '../Components/UI/Categories'

export default class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <Categories />
        <Creators />
        <Portfolio />
        <Footer />
        
      </>
    )
  }
}
