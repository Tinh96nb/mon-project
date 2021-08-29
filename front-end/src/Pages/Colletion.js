import React, { Component } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import Portfolio from '../Components/Portfolio'
import UserDetails from '../Components/UserDetails'
import CollectionHero from '../Components/UI/CollectionHero'
export default class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <UserDetails />
        <CollectionHero />
        <Portfolio />
        <Footer />
        
      </>
    )
  }
}
