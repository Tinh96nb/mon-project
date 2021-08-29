import React, { Component } from 'react'
import CreatorForm from '../Components/CreatorForm'
import Header from '../Components/Header'
import Footer from '../Components/Footer'

export default class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <CreatorForm />
        <Footer />
      </>
    )
  }
}
