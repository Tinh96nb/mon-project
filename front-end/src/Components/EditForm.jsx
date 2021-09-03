import React from 'react'
import {Container, Row, Col, Form, Button} from 'react-bootstrap'
import { FaRegImages } from "react-icons/fa";
import EditFormData from '../DemoData/EditFormData.json'

const EditForm = () => {
  return (
    <>
      <div className="edit-form-area">
        <Container>
          <Row>
            <Col lg="6" className="m-auto">
              <div className="form-uploads">
                <div className="upload_logo text-center">
                  <img src={process.env.PUBLIC_URL + `/assets/img/${EditFormData.uploadLogo}`} alt="" />
                  <p>{EditFormData.peraText}</p>
                </div>

                <div className="upload_btn">
                  <div class='file'>
                    <label for='input-file'>Choose file <FaRegImages /></label>
                    <input id='input-file' type='file' />
                  </div>

                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="edit_form">
              <Form>
                  
                  <Form.Control type="text" placeholder="Username" />
                  <Form.Control as="textarea" rows={10}  placeholder="Provide a detailed description of your item. (max 300 characters)" />
                  <Form.Control type="text" placeholder="Social Links" />

                <Button variant="primary" type="submit">Update profile</Button>
              </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default EditForm
