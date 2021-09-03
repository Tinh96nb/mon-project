import React from 'react'
import { Row, Col, Table, Tabs, Tab} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import UsertableData from '../../DemoData/UserTableData.json'
const DataTable = () => {
  return (
    <>
        <Row>
          <Col>
          <div className="usertables">
            <Table borderless>
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Edition</th>
                  <th>Details</th>
                  <th>Buy / Make An Offer</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>

                {
                  UsertableData.users.map((table, i) => 
                  
                  <tr key={i}>
                    <td><img src={process.env.PUBLIC_URL + `/assets/img/${table.img}`} alt="" />{table.name}</td>
                    <td>{table.Tableid}</td>
                    <td>{table.Details} <span>{table.DetailsSpan}</span></td>
                    <td>{table.Offers}</td>
                    <td><Link to={table.buttonLink}>{table.buttonText}</Link></td>
                  </tr>
                  
                  )
                }
                

              </tbody>
            </Table>
            </div>
          </Col>
        </Row>
    </>
  )
}

export default DataTable
