import { lazy, Suspense, useLayoutEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";

import Loading from "Components/Loading";
import EditNFT from "Components/EditNFT";
const Collection = lazy(() => import("Pages/Collection"));
const Collections = lazy(() => import("Pages/Collections"));
const MyCollections = lazy(() => import("Pages/MyCollections"));
const Home = lazy(() => import("Pages/Home"));
const Profile = lazy(() => import("Pages/Profile"));
const Creator = lazy(() => import("Pages/Creator"));
const MintNFT = lazy(() => import("Pages/MintNFT"));
const Details = lazy(() => import("Pages/Details"));
const EditProfile = lazy(() => import("Pages/EditProfile"));
const Marketplace = lazy(() => import("Pages/Marketplace"));
const Users = lazy(() => import("Pages/Users"));
const NotFound = lazy(() => import("Pages/404"));

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
        <Route exact path="/detail/:tokenId/edit" component={EditNFT} />
        <Route exact path="/edit-profile" component={EditProfile} />
        <Route exact path="/marketplace" component={Marketplace} />
        <Route exact path="/creators" component={Users} />
        <Route exact path="/my-collections" component={MyCollections} />
        <Route exact path="/collections" component={Collections} />
        <Route exact path="/collections/:slug" component={Collection} />
        <Route path="*"><NotFound /></Route>
      </Switch>
    </Suspense>
  );
};
