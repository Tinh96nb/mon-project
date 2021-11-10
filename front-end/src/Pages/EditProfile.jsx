import toast from "Components/Toast";
import { Fragment, useEffect, useState } from "react";
import {
  Col,
  Container,
  Form,
  Row,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import {
  FaRegImages,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "redux/userReducer";
import { getFile } from "utils/hepler";

export default function EditProfile() {

  const dispatch = useDispatch();

  const [avatar, setAvatar] = useState("");
  const [cover, setCover] = useState("");
  const [username, setUsername] = useState("");
  const [des, setDes] = useState("");
  const [face, setFace] = useState("");
  const [tw, setTw] = useState("");
  const [ins, setIns] = useState("");
  const [mail, setMail] = useState("");
  const [loading, setLoading] = useState(false);

  const { me } = useSelector((store) => store.user);
  const avt =
    me && me.avatar ? getFile(me.avatar) : "/assets/img/user/avatar.jpg";
  const coverImg = me?.cover
    ? getFile(me.cover)
    : "/assets/img/user/cover.jpeg";
  
  const setImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      const [type] = event.target.files[0].type.split("/");
      if (!type || type !== "image") {
        toast.error({ message: "Only support file type image!" });
        return;
      }
      if (event.target.files[0].size >= 1024 * 1024 * 20) {
        toast.error({ message: "Image too big!" });
        return;
      }
      setAvatar(event.target.files[0]);
    }
  };

  const setCoverImg = (event) => {
    if (event.target.files && event.target.files[0]) {
      const [type] = event.target.files[0].type.split("/");
      if (!type || type !== "image") {
        toast.error({ message: "Only support file type image!" });
        return;
      }
      if (event.target.files[0].size >= 1024 * 1024 * 20) {
        toast.error({ message: "Image too big!" });
        return;
      }
      setCover(event.target.files[0]);
    }
  };

  const submit = async () => {
    setLoading(true);
    const formData = new FormData();
    username && formData.append("username", username);
    des && formData.append("bio", des);
    mail && formData.append("email", mail);
    formData.append("facebook", face);
    formData.append("twitter", tw);
    formData.append("instagram", ins);
    formData.append("avatar", avatar);
    formData.append("cover", cover);

    const cb = (res) => {
      if (res) toast.success("Update successfully!")
      else toast.error({message: "Error"})
      setAvatar("");
      setCover("");
      setLoading(false);
    }
    dispatch(updateProfile(formData, cb));
  };

  useEffect(() => {
    if (me) {
      setUsername(me.username || '');
      setDes(me.bio|| '');
      setFace(me.facebook|| '');
      setTw(me.twitter|| '');
      setIns(me.instagram|| '');
      setMail(me.email|| '');
    }
  }, [me]);
  return (
    <Fragment>
      <div className="edit-form-area">
        <Container>
          <Row>
            <div className="col-lg-4 col-sm-6 m-auto">
            <img className="demo-cover" src={coverImg} />
            <img className="demo-avt" src={avt} />
            </div>
            </Row>
          <Row className="mt-4 justify-content-center">
            <div className="col-md-8 col-sm-12">
              <div className="row">
              <div className="col-6">
                <div className="upload_logo text-center">
                  <p>Set Avatar<br></br>(recommend size 200x200)</p>
                </div>

                <div className="upload_btn">
                  <div className="file">
                    <label>
                      Choose file <FaRegImages />
                    </label>
                    <input
                      className="file-input"
                      type="file"
                      onChange={setImage}
                    />
                  </div>
                  <span className="filename">
                    {avatar
                      ? `${avatar.name} (${(
                          avatar.size /
                          (1024 * 1024)
                        ).toFixed(2)} MB)`
                      : ""}
                  </span>
                </div>
              </div>
              <div className="col-6">
                <div className="upload_logo text-center">
                <p>Set Cover<br></br>(recommend size 450x300)</p>
                </div>
                <div className="upload_btn">
                  <div className="file">
                    <label>
                      Choose file <FaRegImages />
                    </label>
                    <input
                      className="file-input"
                      type="file"
                      onChange={setCoverImg}
                    />
                  </div>
                  <span className="filename">
                    {cover
                      ? `${cover.name} (${(
                          cover.size /
                          (1024 * 1024)
                        ).toFixed(2)} MB)`
                      : ""}
                  </span>
                </div>
              </div>
              </div>
              <div className="edit_form">
                <Form onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Form.Control
                    as="textarea"
                    rows={7}
                    value={des}
                    onChange={(e) => setDes(e.target.value)}
                    placeholder="Provide a detailed description of your item. (max 300 characters)"
                  />
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <FaEnvelope />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      type="email"
                      value={mail}
                      placeholder="Enter mail"
                      onChange={(e) => setMail(e.target.value)}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <FaFacebook />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      value={face}
                      type="text"
                      placeholder="Enter link facebook"
                      onChange={(e) => setFace(e.target.value)}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <FaTwitter />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      value={tw}
                      type="text"
                      placeholder="Enter link twitter"
                      onChange={(e) => setTw(e.target.value)}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <FaInstagram />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      value={ins}
                      type="text"
                      placeholder="Enter link instagram"
                      onChange={(e) => setIns(e.target.value)}
                    />
                  </InputGroup>
                  <div className="text-center">
                    <Button disabled={loading} variant="primary" type="submit">
                    {loading && <div className="loader"></div>}
                      Update profile
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
}
