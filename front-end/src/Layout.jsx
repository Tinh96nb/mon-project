import {Fragment} from 'react';
import Header from 'Components/Header';
import Footer from 'Components/Footer';

export default function Layout({ children }) {
  return (
    <Fragment>
      <Header />
        {children}
      <Footer />
    </Fragment>
  )
}
