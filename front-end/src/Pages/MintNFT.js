import { useState } from "react";
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
import { mintNFT } from "redux/nftReducer";

const CreatorForm = () => {
  const dispatch = useDispatch();

  const [file, setFile] = useState('');
  const [name, setName] = useState('');
  const [des, setDes] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  // @ts-ignore
  const { userAddress } = useSelector((store) => store.home)

  const setImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const submit = async () => {
    const idToken = Math.round(new Date().getTime() / 1000);
    const formData = new FormData();
    formData.append("token_id", idToken.toString());
    formData.append("name", name);
    formData.append("description", des);
    formData.append("category_id", category);
    formData.append("owner", userAddress);
    formData.append("media", file);
    dispatch(mintNFT(formData));
  }
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

              <div className="creator-form">
                <Form.Group>
                  <Form.Label>NFT name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Item name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={10}
                    onChange={(e) => setDes(e.target.value)}
                    placeholder="Provide a detailed description of your item. (max 300 characters)"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Category *</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>Select category</option>
                    <option value="1">Dictamen</option>
                    <option value="2">Constancia</option>
                    <option value="3">Complemento</option>
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
                    placeholder="Ammount"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </InputGroup>

                <div className="creator-btn-area">
                  <Row>
                    <Col lg="6">
                      <h1>Fees when sale</h1>
                      <ul>
                        <li>
                          Service Fee: <span>2.5%</span>
                        </li>
                        <li>
                          You will receive:<span>$1.0000</span>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                  <Button
                    className="Creator-submit-btn"
                    type="submit"
                    onClick={() => submit()}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default CreatorForm;
