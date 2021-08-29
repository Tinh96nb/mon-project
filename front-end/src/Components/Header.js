import React, { useState } from 'react'
import {Container, Col, Row, Form} from 'react-bootstrap'
import { FaTimes, FaSearch } from "react-icons/fa";
import Logo from './UI/Logo';
import MainMenu from './UI/MainMenu';


const Header = () => {

  const [headerNav, setHeader] = useState(false);
  const [mobileNav, mobileNavSet] = useState(false);
  const [search, searchSet] = useState(false);

  const changeMenuStyle =() => {
    if(window.scrollY >= 80){
      setHeader(true)
    }
    else{
      setHeader(false)
    }
  }
  window.addEventListener('scroll', changeMenuStyle);


  return (
    <>
      <div className={headerNav ? 'header black-bg header_sticky' : 'header black-bg'}>
          <Container>
            <Row className="header-content">
            
                <Col xs="6" md="3" lg="3" className="align-items-center">
                  <Logo />
                </Col>
                <Col lg="5" md="3" className="align-items-center d-none d-md-block">
                  <div className="search-bar">
                    <Form>
                      <Form.Group controlId="formBasicEmail">
                        
                        <Form.Control type="Search" placeholder="Search" />
                        
                      </Form.Group>
                    </Form>
                  </div>
                </Col>

                <Col xs="4" className="text-right align-self-center d-md-none">
                  <div onClick={()=>searchSet(true)} className="mobile-search-icon">
                    <FaSearch />
                  </div>
                </Col>

                <Col lg="4" md="6" className="text-right align-self-center d-none d-md-block">
                  <div className="menu-area">
                    <div className="main-menu">
                      <MainMenu/>
                    </div>
                  </div>
                </Col>
                <Col xs="2" className="text-right justify-content-center">
                  <div onClick={()=>mobileNavSet(true)} className="mobile-menu-area">
                    <div className="mobileMenuLine">
                      <span className="menuLine"></span>
                      <span className="menuLine"></span>
                      <span className="menuLine"></span>
                    </div>
                    
                  </div>
                </Col>
            </Row>
          </Container>
          
        </div>
        <div className={mobileNav ? 'mobile-menu-assets active d-md-none' : 'mobile-menu-assets d-md-none'}>
          <div className="close-btn" onClick={()=>mobileNavSet(false)}>
            <FaTimes />
          </div>
            <MainMenu/>
        </div>

        <div className={search ? 'mobile-search active d-md-none' : 'mobile-search d-md-none' }>
          <div className="search-close" onClick={()=>searchSet(false)}>
            <FaTimes />
          </div>
          <Form>
              <Form.Group controlId="formBasicEmail">
                
                <Form.Control type="Search" placeholder="Search" />
                
              </Form.Group>
            </Form>
          </div>
    </>
  )
}

export default Header

