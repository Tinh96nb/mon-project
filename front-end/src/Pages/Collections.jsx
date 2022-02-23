import { useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getCollections, getMoreCollections, resetCollections } from "redux/nftReducer";
import CollectionItem from "Components/CollectionItem";
import InfiniteScroll from "react-infinite-scroll-component";


function Collections() {
  const dispatch = useDispatch();
  const history = useHistory();
  const collections = useSelector((state) => state.nft.collections);
  const pagination = useSelector((state) => state.nft.collectionPagination);

  const loadMore = () => {
    const query = {};
    query.page = pagination.current_page + 1
    dispatch(getMoreCollections(query));
  }

  useEffect(() => {
    dispatch(getCollections());
    return () => {
      dispatch(resetCollections());
    }
  }, [dispatch]);

  return (
    <>
      <Container className="collections-screen">
        <h1>Collections</h1>

        {collections?.length ? (
          <InfiniteScroll
            dataLength={ collections.length || 0 }
            next={ loadMore }
            hasMore={ pagination?.current_page !== pagination?.last_page }
            loader={ <h4>Loading...</h4> }
          >
            <Row>
              { collections.map((collection) => (
                <CollectionItem key={ collection.id } collection={ collection } history={ history } />
              )) }
            </Row>
          </InfiniteScroll>
        ) : (
          <p>No data found!</p>
        )}
      </Container>
    </>
  )
}

export default Collections;
