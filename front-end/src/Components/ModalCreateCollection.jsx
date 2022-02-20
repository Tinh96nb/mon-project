import { useState } from "react";
import { Form } from "react-bootstrap";
import { FaRegImages } from "react-icons/fa";

const { Modal, Button } = require("react-bootstrap");

function ModalCreateCollection({
  show,
  onHide,
}) {
  const [cover, setCover] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit() {
    console.log("handleSubmit");
  }

  return (
    <Modal size="lg" show={ show } onHide={ onHide }>
      <Modal.Header closeButton>
        <Modal.Title>Create a collection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <form
            className="creator-form"
            onSubmit={ (e) => {
              e.preventDefault();
              handleSubmit();
            } }
          >
            <div className="d-flex flex-column">
              <label htmlFor="">
                Logo Image *
              </label>
              <div className="creator-media-upload w-100 mt-0">
                <div className="file w-100" style={{
                  maxHeight: "200px",

                  overflow: "hidden",
                  border: "1px solid #ccc",
                }}>
                  { cover ? (
                    <img
                      src={ URL.createObjectURL(cover) }
                      alt="cover"
                    />
                  ) : (
                    <label
                      style={ {
                        marginBottom: "0px",
                        height: "200px",
                        width: "100%",
                      } }
                    >
                      <FaRegImages />
                    </label>
                  )
                  }
                  
                  <input
                    name="cover"
                    accept="image/png,image/jpeg"
                    type="file"
                    onChange={ (e) => setCover(e.target.files[0]) }
                  />
                </div>
              </div>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="">
                Logo Image *
              </label>
              <div className="creator-media-upload w-100 mt-0">
                <div className="file" style={{
                  height: "150px",
                  width: "150px",
                  overflow: "hidden",
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                }}>
                  { avatar ? (
                    <img
                      src={ URL.createObjectURL(avatar) }
                      alt="avatar"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    <label
                      style={ {
                        marginBottom: "0px",
                        height: "150px",
                        width: "150px",
                      } }
                    >
                      <FaRegImages />
                    </label>
                  )
                  }
                  
                  <input
                    name="avatar"
                    accept="image/png,image/jpeg"
                    type="file"
                    onChange={ (e) => setAvatar(e.target.files[0]) }
                  />
                </div>
              </div>
            </div>
            <Form.Group>
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Collection name"
                onChange={ (e) => setName(e.target.value) }
                required={ true }
                maxLength={ 50 }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                required={ true }
                rows={ 5 }
                onChange={ (e) => setDescription(e.target.value) }
                placeholder="Provide a detailed description of your collection. (max 300 characters)"
                maxLength={ 300 }
              />
            </Form.Group>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={ handleSubmit }>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  )

}

export default ModalCreateCollection;