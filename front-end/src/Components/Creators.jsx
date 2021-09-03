import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import Title from './UI/Title'
import Creators from '../DemoData/CreatorsData.json'
import {Link} from 'react-router-dom'

const Portfolio = () => {
  return (
    <>
      <div className="creators-area">
       <Container>
         <Row>
           <Col>
           <Title title={Creators.Title} titleSpan={Creators.TitleSpan} />
           
           </Col>
         </Row>

         <Row>

            <Col>
              <div className="creator_list">
                  {
                Creators.Creators.map((item, i) =>
                  <div className="single-creator" key={i}>
                    <div className="creatorImgs">
                      <img className="bigImg" src={process.env.PUBLIC_URL + `/assets/img/${item.CreatorImg}`} alt="" />
                      <img className="smallImg" src={process.env.PUBLIC_URL + `/assets/img/${item.CreatorInnerImg}`} alt="" />
                      
                    </div>
                    <div className="creator_link text-center">
                       <Link to={item.link}>{item.CeatorName}</Link>
                    </div>

                  </div>
                )
              }
              </div>
            </Col>
     
         </Row>

       </Container>
      </div>
    </>
  )
}

export default Portfolio
