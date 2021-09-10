import { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import Loading from "Components/Loading";
const Home = lazy(() => import("Pages/Home"));
const Profile = lazy(() => import("Pages/Profile"));
const MintNFT = lazy(() => import("Pages/MintNFT"));
const Details = lazy(() => import("Pages/Details"));
const EditProfile = lazy(() => import("Pages/EditProfile"));
const Marketplace = lazy(() => import("Pages/Marketplace"));

const routers = () => {
  return (
    <Suspense fallback={() => <Loading />}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/mint" component={MintNFT} />
        <Route exact path="/creator/:address" component={Profile} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/detail/:tokenId" component={Details} />
        <Route exact path="/edit-profile" component={EditProfile} />
        <Route exact path="/marketplace" component={Marketplace} />
      </Switch>
    </Suspense>
  );
};

export default routers;
