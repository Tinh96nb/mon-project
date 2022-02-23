import { Card, Col } from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import { getFile } from "utils/hepler";


function CollectionItem({
  collection,
  history,
  handleEditCollection = null,
}) {
  return (
    <Col key={ collection.id } lg={ 4 } sm={ 6 }>
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
        } }
          onClick={ () => {
            history.push(`/collections/${collection.slug}`);
          } }
        >
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
        { handleEditCollection && (
          <button
            className="btn btn-light btn-edit-collection"
            onClick={ () => handleEditCollection && handleEditCollection(collection) }
          >
            <AiFillEdit size={ 24 } />
          </button>
        ) }


        <Card.Body className="text-center"
          onClick={ () => {
            history.push(`/collections/${collection.slug}`);
          } }
        >
          <div className="text-center font-weight-bold">
            { collection.name }
          </div>
          {/* <span className="text-muted"> by </span> */ }
          {/* <Link to={ `/${me.address}` }>{me.address === collection.userAddress ? "you" : collection.username || displayAddress(collection.userAddress)}</Link> */ }
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
  )
}

export default CollectionItem;
