import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import Title from '../Components/UI/Title'
import PortfolioData from '../DemoData/PortfolioData.json'
import {Link} from 'react-router-dom'
const Portfolio = () => {
  return (
    <>
      <div className="portfolio-area">
       <Container>
         <Row>
           <Col>
           <Title title={PortfolioData.title} titleSpan={PortfolioData.titleSpan} />
           
           </Col>
         </Row>

         <Row>
           {
             PortfolioData.portfolioItems.map((item, i) => 
               <Col sm="6" lg="4" key={i}>
                 <div className="single_portfolio">
                 <div className="portfolio_img">
                    <img  src={process.env.PUBLIC_URL +`/assets/img/${item.portfolioImg}`} alt="" />
                  </div>

                  <div className="portfolio_content">
                    <h5>{item.portfolioTag}</h5>
                    <h1 className="portfolio_title"><img src={process.env.PUBLIC_URL + `/assets/img/${item.portfolioTitleImg}`} alt="" /> {item.portfolioTitle} <span>{item.portfolioTitleSpan}</span></h1>
                    <div className="author">
                      <img src={process.env.PUBLIC_URL + `/assets/img/${item.authorImg}`} alt="" />
                      <Link to={item.authorLink}>{item.author}</Link>
                    </div>
                  </div>
                 </div>
               </Col>
              
             )
           }
         </Row>

       </Container>
      </div>
    </>
  )
}

export default Portfolio
