import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { getCollections } from "redux/nftReducer";
import { AiFillEdit } from "react-icons/ai";
import ModalCreateCollection from "Components/ModalCreateCollection";
import { displayAddress, getFile } from "utils/hepler";


function Collections() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [show, setShow] = useState(false);
  const [collection, setCollection] = useState(null);

  const collections = useSelector((state) => state.nft.collections);
  const me = useSelector((state) => state.user.me);

  function handleEditCollection(collection) {
    setCollection(collection);
    setShow(true);
  }

  useEffect(() => {
    if (me) {
      dispatch(getCollections());
    }
  }, [dispatch, me]);

  return (
    <>
      <Container>
        <h1>My Collections</h1>
        <Row>

          { collections.map((collection) => (
            <Col key={ collection.id } md={ 6 } lg={ 4 }>
              <Card
                className="d-flex justify-content-center align-items-center mb-4 card-collection"
                style={ { width: '18rem' } }
              >
                <Card.Img
                  height={ 200 }
                  style={ {
                    objectFit: 'cover',
                  } }
                  variant="top"
                  src={ getFile(collection.img_cover_url) }
                  onClick={ () => {
                    history.push(`/collections/${collection.slug}`);
                  } }
                />
                <div style={ {
                  width: '44px',
                  height: '44px',
                  backgroundColor: "rgb(251, 253, 255)",
                  border: "3px solid rgb(251, 253, 255)",
                  boxShadow: "rgb(14 14 14 / 60%) 0px 0px 2px 0px",
                  marginTop: "-22px",
                  borderRadius: "50%",
                  overflow: "hidden",
                } }>
                  <img
                    style={ {
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                    } }
                    src={ getFile(collection.img_avatar_url) }
                    alt="collection"
                  />
                </div>
                <button
                  className="btn btn-light btn-edit-collection"
                  onClick={ () => handleEditCollection(collection) }
                >
                  <AiFillEdit size={ 24 } />
                </button>

                <Card.Body className="text-center"
                  onClick={ () => {
                    history.push(`/collections/${collection.slug}`);
                  } }
                >
                  <div className="text-center font-weight-bold">
                    { collection.name }
                  </div>
                  {/* <span className="text-muted"> by </span> */}
                  {/* <Link to={ `/${me.address}` }>{me.address === collection.userAddress ? "you" : collection.username || displayAddress(collection.userAddress)}</Link> */}
                  <Card.Text
                    style={ { minHeight: "75px" } }
                    className="text-muted mt-2 text-dot"
                    title={ collection.description }
                  >
                    { collection.description }
                  </Card.Text>
                  <small className="text-muted text-center w-100">
                    <span>{ collection.totalItems || 0 }</span>
                    <span> items</span>
                  </small>
                </Card.Body>
              </Card>
            </Col>
          )) }
        </Row>
      </Container>
      <ModalCreateCollection
        show={ show }
        onHide={ () => setShow(false) }
        collection={ collection }
      />
    </>
  )
}

export default Collections;
