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
import { getCategories, mintNFT } from "redux/nftReducer";
import toast from 'Components/Toast';
import { useHistory } from "react-router-dom";

const CreatorForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [file, setFile] = useState('');
  const [name, setName] = useState('');
  const [des, setDes] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [approveNFT, setApprove] = useState(false);
  const [fee, setFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [textStep, setTextStep] = useState('Create');

  const { userAddress, contractNFT, contractMarket, priceToken } = useSelector((store) => store.home)
  const { categories } = useSelector((store) => store.nft)

  const setImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size >=(1024 * 1024 * 30)) {
        toast.error({message: "File NFT too big!"})
        return;
      }
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    dispatch(getCategories());
  }, [])

  useEffect(() => {
    if (contractNFT) {
      contractNFT.methods
      .isApprovedForAll(userAddress, process.env.REACT_APP_CONTRACT_MARKET)
      .call()
      .then((res) => setApprove(res))
    }
  }, [contractNFT])

  useEffect(() => {
    if (contractMarket) {
      contractMarket.methods
      .getFeePercent()
      .call()
      .then((res) => setFee((res/1000)))
    }
  }, [contractMarket])

  const confirmSell = (tokenId) => {
    const callContract = () => {
      contractMarket.methods
      .createSellOrder(tokenId, price)
      .send({from: userAddress})
      .then((res) => {
        toast.success("Creat NFT successfully!")
        history.push(`/creator/${userAddress}`)
      })
      .catch(() => {
        setLoading(false);
        setTextStep('Create');
        toast.error({message: "You not confirm transaction!"})
      })
    }
    if (!approveNFT) {
      setTextStep('Approve...');
      contractNFT.methods
      .setApprovalForAll(process.env.REACT_APP_CONTRACT_MARKET, true)
      .send({from: userAddress})
      .then((res) => {
        setTextStep('Selling...');
        callContract();
      })
      .catch(() => {
        setLoading(false);
        setTextStep('Create');
        toast.error({message: "You not confirm transaction!"})
      })
    } else callContract();
  }

  const submit = async () => {
    if (!file) return toast.error({message: "File NFT is missing!"})
    setLoading(true);
    setTextStep('Creating...')
    const idToken = Math.round(new Date().getTime() / 1000);
    const formData = new FormData();
    formData.append("token_id", idToken.toString());
    formData.append("name", name);
    formData.append("description", des);
    formData.append("category_id", category);
    formData.append("owner", userAddress);
    formData.append("media", file);
    const cb = (tokenId) => {
      if (tokenId) {
        setTextStep('Selling...')
        confirmSell(tokenId);
      } else {
        setLoading(false);
        setTextStep('Create');
      }
    }
    dispatch(mintNFT(formData, cb));
  }

  const userReceived = +parseFloat(+price-(+price/100*fee)).toFixed(2);
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
                  <input name="media" type="file" onChange={setImage}/>
                  <div className="file-info">
                    {file? `${file.name} (${(file.size/(1024*1024)).toFixed(2)} MB)` : ''}
                  </div>
                </div>
              </div>

              <form
                className="creator-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit()
                }}
              >
                <Form.Group>
                  <Form.Label>NFT name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Item name"
                    onChange={(e) => setName(e.target.value)}
                    required={true}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    required={true}
                    rows={10}
                    onChange={(e) => setDes(e.target.value)}
                    placeholder="Provide a detailed description of your item. (max 300 characters)"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>Select category</option>
                    {categories.map((cate, index) => {
                      return <option key={index} value={cate.id}>{cate.name}</option>
                    })}
                  </Form.Control>
                </Form.Group>
                <label htmlFor="basic-url">
                  Price * <br /> Will be on sale until you transfer this item or
                  cancel it.{" "}
                </label>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          `/assets/img/icons/main-icon.png`
                        }
                        alt=""
                      />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    type="number"
                    required={true}
                    placeholder="Amount"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </InputGroup>

                <div className="creator-btn-area">
                  <Row>
                    <Col lg="6">
                      <h1>Fees when sale</h1>
                      <ul>
                        <li>
                          Service Fee: <span>{fee}%</span>
                        </li>
                        <li>
                          You will receive:
                          <span>
                            {userReceived} MON - ${+parseFloat(userReceived*priceToken).toFixed(2)}
                          </span>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                  <Button
                    className="Creator-submit-btn"
                    type="submit"
                    disabled={loading}
                  >
                    {loading && <div className="loader"></div>}
                    {textStep}
                  </Button>
                </div>
              </form>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default CreatorForm;
