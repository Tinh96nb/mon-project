import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function Footer() {
  const { config } = useSelector((state) => state.home);
  return (
    <>
      <div className="footer-area black-bg">
        <Container>
          <Row>
            <Col lg="6 align-self-center">
              <div className="footer-menu">
                <ul>
                  <li>
                    {config && config?.facebook?.value && <a href={config.facebook.value} target="_blank">Facebook</a>}
                    {config && config?.twitter?.value && <a href={config.twitter.value} target="_blank">Twitter</a>}
                    {config && config?.instagram?.value && <a href={config.instagram.value} target="_blank">Instagram</a>}
                    {config && config?.telegram?.value && <a href={config.telegram.value} target="_blank">Telegram</a>}
                    {config && config?.medium?.value && <a href={config.medium.value} target="_blank">Medium</a>}
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg="6" className="text-md-right align-self-center">
              <div className="footer-menu">
                <ul>
                  <li>
                    {config && config?.about?.value && <a href={config?.about.value}>About</a>}
                    {config && config?.term?.value && <a href={config?.term.value}>Terms of Service</a>}
                    {config && config?.privacy?.value && <a href={config?.privacy.value}>Privacy</a>}
                    {config && config?.help?.value && <a href={config?.help.value}>Help</a>}
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
