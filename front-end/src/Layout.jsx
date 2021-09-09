import {Fragment} from 'react';
import Header from 'Components/Header';
import Footer from 'Components/Footer';
import { useSelector } from 'react-redux';
import Loading from "Components/Loading";

export default function Layout({ children }) {

  const {loading} = useSelector((state) => state.home)
  return (
    <Fragment>
      <Header />
        {/* {loading && <Loading />} */}
        {children}
      <Footer />
    </Fragment>
  )
}
