import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getCollections, getMoreCollections, resetCollections } from "redux/nftReducer";
import ModalCreateCollection from "Components/ModalCreateCollection";
import CollectionItem from "Components/CollectionItem";
import InfiniteScroll from "react-infinite-scroll-component";


function MyCollections() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [show, setShow] = useState(false);
  const [collection, setCollection] = useState(null);

  const collections = useSelector((state) => state.nft.collections);
  const pagination = useSelector((state) => state.nft.collectionPagination);
  const me = useSelector((state) => state.user.me);

  const loadMore = () => {
    const query = { user_id: me.id };
    query.page = pagination.current_page + 1
    dispatch(getMoreCollections(query));
  }

  function handleEditCollection(collection) {
    setCollection(collection);
    setShow(true);
  }

  useEffect(() => {
    if (me) {
      dispatch(getCollections({ user_id: me.id }));
    }
    return () => {
      dispatch(resetCollections());
    }
  }, [dispatch, me]);

  return (
    <>
      <Container id="collections" className="d-flex flex-column">
        <h1>My Collections</h1>
        <InfiniteScroll
          className="d-flex flex-column"
          dataLength={ collections.length || 0 }
          next={ loadMore }
          hasMore={ pagination?.current_page !== pagination?.last_page }
          loader={ <h4>Loading...</h4> }
        >
          { collections?.length ? (
            <Row className={ collections.length ? "" : "justify-content-md-center" }>
              { collections.map((collection) => (
                <CollectionItem key={ collection.id } collection={ collection } history={ history } handleEditCollection={ handleEditCollection } />
              )) }
            </Row>

          ) : (
            <p>No data found!</p>
          ) }
        </InfiniteScroll>
      </Container>
      <ModalCreateCollection
        show={ show }
        onHide={ () => setShow(false) }
        collection={ collection }
      />
    </>
  )
}

export default MyCollections;
