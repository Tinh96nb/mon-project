import { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

const Home = lazy(() => import("Pages/Home"));
const Colletion = lazy(() => import("Pages/Colletion"));
const MintNFT = lazy(() => import("Pages/MintNFT"));
const Details = lazy(() => import("Pages/Details"));
const EditProfile = lazy(() => import("Pages/EditProfile"));
const Marketplace = lazy(() => import("Pages/Marketplace"));

const routers = () => {

  const loader = () => {
    return <div className="overlay">
      <div className="loader-5 center"><span></span></div>
      </div>
  }

  return (
    <Suspense fallback={loader()}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/mint" component={MintNFT} />
        <Route exact path="/creator/:address" component={Colletion} />
        <Route exact path="/detail/:tokenId" component={Details} />
        <Route exact path="/edit-profile" component={EditProfile} />
        <Route exact path="/marketplace" component={Marketplace} />
      </Switch>
    </Suspense>
  );
};

export default routers;
