import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

const Home = lazy(() => import("Pages/Home"));
const Colletion = lazy(() => import("Pages/Colletion"));
const CreatorForm = lazy(() => import("Pages/CreatorForm"));
const details = lazy(() => import("Pages/Details"));
const EditProfile = lazy(() => import("Pages/EditProfile"));
const Marketplace = lazy(() => import("Pages/Marketplace"));

const routers = () => {
  return (
      <Suspense fallback={<div>Loading...</div>}>
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/colletion" component={Colletion} />
        <Route exact path="/creator-form" component={CreatorForm} />
        <Route exact path="/details" component={details} />
        <Route exact path="/edit-profile" component={EditProfile} />
        <Route exact path="/marketplace" component={Marketplace} />
    </Switch>
      </Suspense>
  );
};

export default routers;
