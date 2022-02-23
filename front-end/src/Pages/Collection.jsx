import NFTItem from "Components/NFTItem";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { getCollection, getListNFT } from "redux/nftReducer";
import { getFile, nFormatter } from "utils/hepler";

const defaultCoverImg = "/assets/img/collections/default-top-black-cover.jpg";
const defaultAvatarImg = "/assets/img/collections/default-avatar.jpg";

function Collection() {
  const router = useRouteMatch();
  const slug = router.params.slug;
  const dispatch = useDispatch();

  const collection = useSelector((state) => state.nft.collection);
  const { list, pagination } = useSelector((state) => state.nft);
  const { priceToken } = useSelector((state) => state.home);
  const [sort, setSort] = useState(null);

  useEffect(() => {
    if (!collection) {
      return;
    }
    const query = { status: '1,2' };
    if (sort && sort !== "0") {
      const [sort_by, order_by] = sort.split("/")
      query.sort_by = sort_by;
      query.order_by = order_by;
    }
    query.collection_id = collection.id;
    dispatch(getListNFT(query));
  }, [collection, dispatch, sort]);

  useEffect(() => {
    dispatch(getCollection(slug));
  }, [slug, dispatch]);

  const loadMore = () => {
    const query = { status: 2 };
    if (sort) {
      const [sort_by, order_by] = sort.split("/")
      query.sort_by = sort_by;
      query.order_by = order_by;
    }
    query.page = pagination.current_page + 1
    dispatch(getListNFT(query, true));
  }

  const coverImg = collection?.img_cover_url || defaultCoverImg;
  const avatarImg = collection?.img_avatar_url || defaultAvatarImg;

  return (
    <>
      <div>
        <div className="container-cover">
          <img
            src={ getFile(coverImg) }
            alt={ collection?.name }
            style={ { objectFit: "cover" } }
            className="w-100 h-100 img-cover"
          />
        </div>
      </div>
      <div>
        <div className="d-flex">
          <div className="collection-avatar d-flex flex-column justify-content-center align-items-center w-100">
            <img src={ getFile(avatarImg) } alt={ collection?.name } />
            <h1>{ collection?.name }</h1>
            <p>Created by <Link to={ `/creator/${collection?.userAddress}` }>{ collection?.username }</Link></p>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center mb-4">
        <div className="d-flex flex-column justify-content-center align-items-center border border-radius-left-10 collection-info" >
          <p>{ nFormatter(collection?.totalItems || 0) }</p>
          <p>items</p>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center border-top border-bottom border-right collection-info" >
          <p>{ nFormatter(collection?.totalOwners || 0) }</p>
          <p>owners</p>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center border-top border-bottom collection-info" >
          <p>{ nFormatter(collection?.floorPrice || 0) }</p>
          <p>floor price</p>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center border border-radius-right-10 collection-info" >
          <p>{ nFormatter(collection?.volumeTraded || 0) }</p>
          <p>volume traded</p>
        </div>
      </div>
      <div className="d-flex justify-content-center mb-4 collection-description container">
        {collection?.description}
      </div>
      <div className="collections-area">
        <Container>
          <Row>
            <Col md={ 2 }>
              <select
                className="form-control mt-2"
                onChange={ (e) => setSort(e.target.value) }
              >
                <option value="0">Sort by</option>
                <option value="sell_at/desc">Recently Listed</option>
                <option value="price/desc">Price: High to Low</option>
                <option value="price/asc">Price: Low to Hight </option>
              </select>
            </Col>
          </Row>
          { list.length > 0 ? (
            <InfiniteScroll
              dataLength={ list?.length }
              next={ loadMore }
              hasMore={ pagination?.current_page !== pagination?.last_page }
              loader={ <h4>Loading...</h4> }
            >
              <Row className={ list.length ? "" : "justify-content-md-center" }>
                { list.map((nft, i) => (
                  <NFTItem nft={ nft } i={ i } priceToken={ priceToken } />
                )) }
              </Row>
            </InfiniteScroll>
          ) : (
            <div className="w-100">
              <p className="text-center mt-5 mb-5">No data</p>
            </div>
          ) }

        </Container>
      </div>
    </>
  );
}

export default Collection;
