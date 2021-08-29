import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './Pages/Home'
import Colletion from './Pages/Colletion'
import CreatorForm from './Pages/CreatorForm'
import details from './Pages/Details'
import EditProfile from './Pages/EditProfile'
import Marketplace from './Pages/Marketplace'
class Routes extends Component {
  render() {
    return (
      <>
      <Switch>

        <Route exact path="/" component={Home} />
        <Route exact path="/colletion" component={Colletion} />
        <Route exact path="/creator-form" component={CreatorForm} />
        <Route exact path="/details" component={details} />
        <Route exact path="/edit-profile" component={EditProfile} />
        <Route exact path="/marketplace" component={Marketplace} />
        
      </Switch>
      </>
    )
  }
}


export default Routes