import React, { Component } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import HomeWelcome from '../Components/HomeWelcome'
import Portfolio from '../Components/Portfolio'
import Creators from '../Components/Creators'

export default class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <HomeWelcome />
        <Creators />
        <Portfolio />
        <Footer />
        
      </>
    )
  }
}
