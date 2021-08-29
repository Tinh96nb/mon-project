import React, { Component } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import UserDetails from '../Components/UserDetails'
import DetailsHero from '../Components/DetailsHero'
import UserTable from '../Components/detailsTable'
export default class Home extends Component {
  render() {
    return (
      <>
      <Header />
      <UserDetails />
      <DetailsHero />
      <UserTable />
      <Footer />
      
      </>
    )
  }
}
