import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Form,
  Button,
} from "react-bootstrap";
import { FaRegImages } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, getCollections, mintNFT } from "redux/nftReducer";
import toast from "Components/Toast";
import { useHistory } from "react-router-dom";
import { NFTStorage, File } from "nft.storage";
import Select from "react-select";
import ModalCreateCollection from "Components/ModalCreateCollection";

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

const CreatorForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState(0);
  const [price, setPrice] = useState("");
  const [approveNFT, setApprove] = useState(false);
  const [fee, setFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [textStep, setTextStep] = useState("Create");

  const [showCollectionModal, setShowCollectionModal] = useState(false);

  const { userAddress, contractNFT, contractMarket, priceToken, web3 } =
    useSelector((store) => store.home);
  const { categories, collections } = useSelector((store) => store.nft);
  const { me } = useSelector((store) => store.user);

  const setImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      const [type] = event.target.files[0].type.split("/");
      if (type !== "image" && type !== "video") {
        toast.error({ message: "Only support file type image or video!" });
        return;
      }
      if (event.target.files[0].size >= 1024 * 1024 * 30) {
        toast.error({ message: "File NFT too big!" });
        return;
      }
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    dispatch(getCategories());
    me && dispatch(getCollections({ user_id: me.id, limit: 999999999 }));
  }, [me]);

  useEffect(() => {
    if (contractNFT && userAddress) {
      contractNFT.methods
        .isApprovedForAll(userAddress, process.env.REACT_APP_CONTRACT_MARKET)
        .call()
        .then((res) => setApprove(res));
    }
  }, [contractNFT, userAddress]);

  useEffect(() => {
    if (contractMarket) {
      contractMarket.methods
        .getFeePercent()
        .call()
        .then((res) => setFee(+res / 1000));
    }
  }, [contractMarket]);

  const confirmSell = (tokenId) => {
    const callContract = () => {
      const realPrice = web3.utils.toWei(price, "ether");
      contractMarket.methods
        .createSellOrder(tokenId, realPrice)
        .send({ from: userAddress })
        .then((res) => {
          toast.success("Creat NFT successfully!");
          history.push(`/detail/${tokenId}`);
        })
        .catch(() => {
          setLoading(false);
          setTextStep("Create");
          toast.error({ message: "You not confirm transaction!" });
        });
    };
    if (!approveNFT) {
      setTextStep("Approve...");
      contractNFT.methods
        .setApprovalForAll(process.env.REACT_APP_CONTRACT_MARKET, true)
        .send({ from: userAddress })
        .then((res) => {
          setTextStep("Selling...");
          callContract();
        })
        .catch(() => {
          setLoading(false);
          setTextStep("Create");
          toast.error({ message: "You not confirm transaction!" });
        });
    } else callContract();
  };

  const submit = async () => {
    if (!userAddress)
      return toast.error({ message: "Please connect wallet to create NFT!" });
    if (!file) return toast.error({ message: "File NFT is missing!" });
    if (!price) return toast.error({ message: "Price for NFT is missing!" });
    setLoading(true);
    setTextStep("Creating...");
    const idToken = Math.round(new Date().getTime() / 1000);
    const formData = new FormData();
    formData.append("token_id", idToken.toString());
    formData.append("name", name);
    formData.append("description", des);
    formData.append("category_id", category);
    formData.append("collection_id", collection);
    formData.append("owner", userAddress);
    formData.append("media", file);
    // push ipfs
    const client = new NFTStorage({ token: process.env.REACT_APP_IPFS });
    const metadata = await client.store({
      name: name,
      description: des,
      image: new File([file], file.name, { type: file.type }),
    });
    formData.append("metadata", metadata?.url || "");

    const cb = (tokenId) => {
      if (tokenId) {
        setTextStep("Selling...");
        confirmSell(tokenId);
      } else {
        setLoading(false);
        setTextStep("Create");
      }
    };
    dispatch(mintNFT(formData, cb));
  };

  function handleClose() {
    setShowCollectionModal(false);
  }

  const userReceived = +parseFloat(
    (+price - (+price / 100) * fee).toString()
  ).toFixed(2);

  const collectionOptions = collections.map((collection) => (
    {
      value: collection.id,
      label: collection.name,
    }
  ));

  return (
    <>
      <div className="creator-form-area">
        <Container>
          <Row>
            <Col>
              <div className="creator-form-details">
                <h1>Create a New item NFT</h1>
                <h3>Image, Video, Audio, or 3D Model</h3>
                <p>
                  File type supported: JPG, JPEG, PNG, GIF, MP4, MP3, WAV... Max
                  size: 30MB
                </p>
              </div>

              <div className="creator-media-upload">
                <div className="file">
                  <label>
                    Choose file <FaRegImages />
                  </label>
                  <input name="media" type="file" onChange={ setImage } />
                  <div className="file-info">
                    { file
                      ? `${file.name} (${(file.size / (1024 * 1024)).toFixed(
                        2
                      )} MB)`
                      : "" }
                  </div>
                </div>
              </div>

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
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={ (e) => setCategory(e.target.value) }
                  >
                    <option>Select category</option>
                    { categories.map((cate, index) => {
                      return (
                        <option key={ index } value={ cate.id }>
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
                      isClearable={ true }
                    // defaultMenuIsOpen={ true }
                    >
                      <option>Select collection</option>
                      { collections.map((collection, index) => {
                        return (
                          <option key={ index } value={ collection.id }>
                            { collection.name }
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
                  Price * <br /> Will be on sale until you transfer this item or
                  cancel it.{ " " }
                </label>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <img src="/assets/img/icons/main-icon.svg" alt="icon" />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    type="number"
                    required={ true }
                    placeholder="Amount"
                    onChange={ (e) => setPrice(e.target.value) }
                  />
                </InputGroup>

                <div className="creator-btn-area">
                  <Row>
                    <Col lg="6">
                      <h1>Fees when sale</h1>
                      <ul>
                        <li>
                          Service Fee: <span>{ fee }%</span>
                        </li>
                        <li>
                          You will receive:
                          <span>
                            { userReceived } MON - $
                            {
                              +parseFloat(
                                (+userReceived * +priceToken).toString()
                              ).toFixed(2)
                            }
                          </span>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                  { me && me.status ? (
                    <Button
                      className="Creator-submit-btn"
                      type="submit"
                      disabled={ loading }
                    >
                      { loading && <div className="loader"></div> }
                      { textStep }
                    </Button>
                  ) : (
                    <Button
                      className="Creator-submit-btn"
                      onClick={ () => {
                        toast.error({ message: "Account has been locked!" });
                      } }
                    >
                      Create
                    </Button>
                  ) }
                </div>
              </form>
            </Col>
          </Row>
        </Container>
      </div>
      <ModalCreateCollection show={ showCollectionModal } onHide={ handleClose } />
    </>
  );
};

export default CreatorForm;
