import { Container, Row, Col, Table } from "react-bootstrap";
import { displayAddress, getFile, UTCTimeToTime } from "utils/hepler";

const historyTable = ({ histories }) => {
  return (
    <div className="usertable-area">
      <Container>
        <Row className="justify-content-center">
          <Col>
            <div className="table_tab">
              <Row>
                <Col>
                  <div className="usertables">
                    <Table borderless>
                      <thead>
                        <tr>
                          <th>From</th>
                          <th>To</th>
                          <th>Price</th>
                          <th>Event</th>
                          <th>Time</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {histories.map((history, i) => {
                          const avtFrom = history?.from?.avatar ? getFile(history.from.avatar) : '/assets/img/user/avatar.jpg';
                          const avtTo = history?.to?.avatar ? getFile(history.to.avatar) : '/assets/img/user/avatar.jpg';
                          return (
                            <tr key={i}>
                              <td>
                                {history?.from ? <img src={avtFrom} alt={history?.from?.username} /> : "NullAddress"}
                                {history?.from?.username || displayAddress(history?.from?.address)}
                              </td>
                              <td>
                                {history?.to && <img src={avtTo} alt={history?.to?.username} />}
                                {history?.to?.username || displayAddress(history?.to?.address)}
                              </td>
                              <td>{history.price || 0} MON</td>
                              <td>{history.type === 1 ? "Minted" : "Transfer"}</td>
                              <td>
                                {UTCTimeToTime(history?.created_at)}
                              </td>
                              <td>
                                <a href={`${process.env.REACT_APP_URL_SCAN}/tx/${history.txid}`} target="_blank">View</a>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default historyTable;
