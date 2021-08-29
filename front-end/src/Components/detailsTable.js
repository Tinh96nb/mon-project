import React from 'react'
import {Container, Row, Col,Tabs, Tab } from 'react-bootstrap'
import UsertableData from '../DemoData/UserTableData.json'

import DataTable from '../Components/UI/DataTable'
const detailsTable = () => {
  return (
    <>
      <div className="usertable-area">
        <Container>
          <Row className="justify-content-center">
            <Col>
              <div className="table_tab">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="home" title="Trading History">
                  <DataTable />
                </Tab>
                <Tab eventKey="profile" title="Edition Activity">
                  <DataTable />
                </Tab>
              </Tabs>
              </div>
            </Col>
          </Row>
          
        </Container>
      </div>
    </>
  )
}



export default detailsTable
