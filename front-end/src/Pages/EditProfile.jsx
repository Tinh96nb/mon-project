import React, { Component } from 'react'
import EditForm from '../Components/EditForm'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
export default class Home extends Component {
  render() {
    return (
      <>
        
        <Header />
        <EditForm/>
        <Footer />
        
      </>
    )
  }
}
