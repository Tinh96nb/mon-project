import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, setCateFilter } from "redux/nftReducer";

const Categories = () => {
  const dispatch = useDispatch();

  const { categories, selectCate } = useSelector((state) => state.nft);

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  return (
    <div className="categories-area">
      <Container>
        <Row>
          <Col>
            <div className="categories">
              <ul>
                <li>
                  <button
                    className={!selectCate ? "active" : ""}
                    type="button"
                    onClick={() => dispatch(setCateFilter("all"))}
                  >
                    All
                  </button>
                </li>
                {categories.map((cate, i) => {
                  return (
                    <li key={i}>
                      <button
                        className={cate.id === selectCate ? "active" : ""}
                        type="button"
                        onClick={() => dispatch(setCateFilter(cate.id))}
                      >
                        {cate.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Categories;
