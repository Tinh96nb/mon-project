import React from 'react'
import {
  Container, 
  Row, 
  Col, 
  InputGroup, 
  FormControl,  
  Form, 
  Button, 
  
} from 'react-bootstrap'
import { FaRegImages } from "react-icons/fa";
const CreatorForm = () => {
  return (
    <>
      <div className="creator-form-area">
        <Container>
          <Row>
            <Col>
              <div className="creator-form-details">
                <h1>Creatte a New item</h1>
                <h3>Image, Video, Audio, or 3D Model</h3>
                <p>File type supported: jpg, jpeg, png, gif</p>
              </div>

              <div className="creator-media-upload">

                  <div class='file'>
                    <label for='input-file'>Choose file <FaRegImages /></label>
                    <input id='input-file' type='file' />
                  </div>
              </div>
            
              <div className="creator-form">


              <Form.Group controlId="formBasicName">
                <Form.Label>NFT name*</Form.Label>
                <Form.Control type="text" placeholder="Item name" />
              </Form.Group>


              <Form.Group controlId="formBasicName">
                <Form.Label>Description *</Form.Label>
                <Form.Control as="textarea" rows={10} placeholder="Provide a detailed description of your item. (max 300 characters)" />
              </Form.Group>
              <label htmlFor="basic-url">Price * <br /> Will be on sale until you transfer this item or cancel it. </label>
              <InputGroup className="mb-3">
              
                <InputGroup.Prepend>
                  <InputGroup.Text><img src={process.env.PUBLIC_URL+ `/assets/img/icons/main-icon.png`} alt="" /></InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    placeholder="Ammount"
                  />
  
              </InputGroup>

               <div className="creator-btn-area">
                 <Row>
                   <Col lg="6">
                      <h1>Fees</h1>
                      <ul>
                        <li>Service Fee: <span>2.5%</span></li>
                        <li>SYou will receive:<span>$1.0000</span></li>
                      </ul>
                   </Col>
                 </Row>
               <Button className="Creator-submit-btn" type="submit">Approve</Button>
               </div>
                
              </div>
             
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default CreatorForm
