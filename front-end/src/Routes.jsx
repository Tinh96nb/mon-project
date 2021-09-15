import { lazy, Suspense, useLayoutEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";

import Loading from "Components/Loading";
const Home = lazy(() => import("Pages/Home"));
const Profile = lazy(() => import("Pages/Profile"));
const Creator = lazy(() => import("Pages/Creator"));
const MintNFT = lazy(() => import("Pages/MintNFT"));
const Details = lazy(() => import("Pages/Details"));
const EditProfile = lazy(() => import("Pages/EditProfile"));
const Marketplace = lazy(() => import("Pages/Marketplace"));

export default function Router() {

  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense fallback={Loading()}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/mint" component={MintNFT} />
        <Route exact path="/creator/:address" component={Creator} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/detail/:tokenId" component={Details} />
        <Route exact path="/edit-profile" component={EditProfile} />
        <Route exact path="/marketplace" component={Marketplace} />
      </Switch>
    </Suspense>
  );
};
