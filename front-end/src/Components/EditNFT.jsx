import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, getCollections, getDetail, putNft } from "redux/nftReducer";
import toast from "Components/Toast";
import { useHistory, useRouteMatch } from "react-router-dom";
import Select from "react-select";
import ModalCreateCollection from "Components/ModalCreateCollection";
import LazyImage from "Components/LazyImage";
import { canNftUdate, getFile } from "utils/hepler";

const customStyles = {
  container: (styles) => ({
    ...styles,
    padding: 0,
    border: 0,
    marginBottom: "60px",
  }),
  control: (styles) => ({
    ...styles,
    borderRadius: "0",
  }),
  valueContainer: (styles) => ({
    ...styles,
    paddingTop: "30px",
    paddingBottom: "30px",
  }),
  menu: (styles) => ({
    ...styles,
    marginTop: "60px",
  }),
};

const EditNFT = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const router = useRouteMatch();
  const id = router.params.tokenId;

  const [show, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showCollectionModal, setShowCollectionModal] = useState(false);

  const detail = useSelector((state) => state.nft.detail);
  const { userAddress } =
    useSelector((store) => store.home);
  const { categories, collections } = useSelector((store) => store.nft);
  const { me } = useSelector((store) => store.user);

  const submit = async () => {
    if (!userAddress)
      return toast.error({ message: "Please connect wallet to create NFT!" });
    if (!name) return toast.error({ message: "Please enter name!" });
    if (!des) return toast.error({ message: "Please enter name!" });
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", des);
    formData.append("category_id", category);
    formData.append("collection_id", collection);

    const cb = (resp) => {
      const { success, message } = resp
      console.log(resp);
      setLoading(false);
      if (!success) toast.error(message);
      if (success) toast.success(message);
      if (success) {
        setTimeout(() => {
          history.push(`/detail/${id}`);
        }, 2000);
      }
    };
    dispatch(putNft(id, formData, cb));
  };

  function handleClose() {
    setShowCollectionModal(false);
  }

  const collectionOptions = collections.map((collection) => (
    {
      value: collection.id,
      label: collection.name,
    }
  ));

  const typeMedia = detail?.mine_type?.split("/")[0];
  const media = detail?.media
    ? getFile(detail.media, typeMedia === "video")
    : "/assets/img/portfolio/default.jpeg";

  useEffect(() => {
    if (id) {
      const cb = (data) => {
        if (!canNftUdate(data)) {
          toast.error({ message: "Can not update this NFT!" });
          setTimeout(() => {
            history.push("/profile");
          }, 300);
        }
      };
      dispatch(getDetail(id, cb))
      dispatch(getCategories());
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (me) {
      dispatch(getCollections({ user_id: me.id }));
    }
  }, [dispatch, me]);

  useEffect(() => {
    if (detail) {
      setName(detail.name);
      setDes(detail.description);
      setCategory(detail.category_id);
      setCollection(detail.collection_id);
    }
  }, [detail]);

  const selectedCollection = collectionOptions.find(
    (option) => option.value === collection
  );

  return (
    <>
      <div className="creator-form-area">
        <Container>
          <Row>
            <Col>
              <div className="creator-form-details">
                <h1>Update item NFT</h1>
                <p> * You can only update once time before sale.</p>
              </div>

              <Col xs="12" lg="6" className="align-self-center pl-0 mb-4">
                <div className="detailsHeroImg">
                  { typeMedia === "image" ? (
                    <LazyImage src={ media } alt={ detail?.name } />
                  ) : (
                    <video
                      autoPlay={ true }
                      loop={ true }
                      playsInline={ true }
                      src={ media }
                    />
                  ) }
                </div>
              </Col>
              <form
                className="creator-form"
                onSubmit={ (e) => {
                  e.preventDefault();
                  submit();
                } }
              >
                <Form.Group>
                  <Form.Label>NFT name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Item name"
                    onChange={ (e) => setName(e.target.value) }
                    required={ true }
                    value={ name }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    required={ true }
                    rows={ 10 }
                    onChange={ (e) => setDes(e.target.value) }
                    placeholder="Provide a detailed description of your item. (max 300 characters)"
                    value={ des }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={ (e) => setCategory(e.target.value) }
                    value={ category }
                  >
                    <option>Select category</option>
                    { categories?.map((cate, index) => {
                      return (
                        <option
                          key={ index } value={ cate.id }>
                          { cate.name }
                        </option>
                      );
                    }) }
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Collection</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      as={ Select }
                      options={ collectionOptions }
                      onChange={ (value) => setCollection(value?.value) }
                      styles={ customStyles }
                      placeholder="Select collection"
                      components={ {
                        IndicatorSeparator: () => null
                      } }
                      value={ selectedCollection }
                      isClearable={ true }
                    // defaultMenuIsOpen={ true }
                    >
                      <option>Select collection</option>
                      { collections?.map((_collection, index) => {
                        return (
                          <option
                            key={ index }
                            value={ _collection.id }
                          >
                            { _collection.name }
                          </option>
                        );
                      }) }
                    </Form.Control>
                    <Button className="btn-plus" onClick={ () => setShowCollectionModal(true) }>
                      <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" fillRule="evenodd"><path fillRule="evenodd" d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z" /></svg>
                    </Button>
                  </div>

                </Form.Group>
                <label htmlFor="basic-url">
                  Price *
                </label>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <img src="/assets/img/icons/main-icon.svg" alt="icon" />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    readOnly={ true }
                    type="number"
                    required={ true }
                    placeholder="Amount"
                    value={ detail?.price }
                  />
                </InputGroup>

                <div className="creator-btn-area">
                  { me && me.status ? (
                    <Button
                      className="Creator-submit-btn"
                      disabled={ loading }
                      onClick={ () => setShowConfirm(true) }
                    >
                      { loading ? <div className="loader" /> : "Update" }
                    </Button>
                  ) : (
                    <Button
                      className="Creator-submit-btn"
                      onClick={ () => {
                        toast.error({ message: "Account has been locked!" });
                      } }
                    >
                      Update
                    </Button>
                  ) }

                </div>
              </form>
            </Col>
          </Row>
        </Container>
      </div>
      <Modal show={show} onHide={() =>  setShowConfirm(false)}>
        <Modal.Header closeButton className="border-bottom-0">
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body-content" style={{ fontSize: "1.25rem" }}>
            Are you sure you want to update nft?
          </div>
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button className="btn-confirm-no" variant="secondary" onClick={ () => setShowCollectionModal(false) }>
            No
          </Button>
          <Button variant="primary" onClick={ () => {
            setShowConfirm(false);
            submit();
          } }>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalCreateCollection show={ showCollectionModal } onHide={ handleClose } />
    </>
  );
};

export default EditNFT;
