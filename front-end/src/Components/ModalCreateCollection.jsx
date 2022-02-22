import { useEffect } from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { FaRegImages } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { getCollections, postCollection, putCollection } from "redux/nftReducer";
import isEmpty from "lodash.isempty";

import "./modal.scss";
import { getFile } from "utils/hepler";

const { Modal, Button } = require("react-bootstrap");

const rules = {
  name: [
    v => !!v.trim() || "Name is required",
    v => v.length <= 50 || "Name must be less than 50 characters",
    v => v.length >= 10 || "Name must be at least 10 characters",
    // v => /^[a-zA-Z0-9_]+$/.test(v) || "Name must be alphanumeric",
  ],
  description: [
    v => !!v.trim() || "Description is required",
    v => v.length <= 300 || "Description must be less than 300 characters",
  ],
  img_cover_url: [
    v => !!v || "Banner image is required",
    function (v) {
      return v.type.includes("image") || "Banner image must be an image";
    },
    function (v) {
      return v.size <= 30000000 || "Banner image must be less than 30MB";
    }
  ],
  img_avatar_url: [
    v => !!v || "Avatar image is required",
    function (v) {
      return v.type.includes("image") || "Avatar image must be an image";
    },
    function (v) {
      return v.size <= 30000000 || "Avatar image must be less than 30MB";
    }
  ],
};


function ModalCreateCollection({
  show,
  onHide,
  collection = null,
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: collection?.name || "",
    description: collection?.description || "",
    img_cover_url: collection?.img_cover_url || "",
    img_avatar_url: collection?.img_avatar_url || "",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const avatar = form.img_avatar_url;
  const cover = form.img_cover_url;
  const name = form.name;
  const description = form.description;

  function createCollection() {
    const errors = {};
    Object.keys(rules).forEach(field => {
      const ruleFns = rules[field];
      for (let i = 0; i < ruleFns.length; i += 1) {
        const ruleFn = ruleFns[i];
        const error = ruleFn(form[field]);
        if (error && error !== true) {
          errors[field] = error;
          break;
        }
      }
    });
    if (!isEmpty(errors)) {
      return setErrors(errors);
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("img_cover_url", cover);
    formData.append("img_avatar_url", avatar);
    // validate
    setLoading(true);
    dispatch(postCollection(formData, (success) => {
      setLoading(false);
      if (success) {
        onHide();
        dispatch(getCollections());
      }
    }));
  }

  function updateCollection() {
    const isUpdateCover = cover !== collection.img_cover_url;
    const isUpdateAvatar = avatar !== collection.img_avatar_url;
    const errors = {};
    Object.keys(rules).forEach(field => {
      const ruleFns = rules[field];
      for (let i = 0; i < ruleFns.length; i += 1) {
        if (!isUpdateCover && field === "img_cover_url") {
          break;
        }
        if (!isUpdateAvatar && field === "img_avatar_url") {
          break;
        }
        const ruleFn = ruleFns[i];
        const error = ruleFn(form[field]);
        if (error && error !== true) {
          errors[field] = error;
          break;
        }
      }
    });
    if (!isEmpty(errors)) {
      return setErrors(errors);
    }
    const formData = new FormData();
    formData.append("id", collection.id);
    formData.append("name", name);
    formData.append("description", description);
    if (isUpdateCover) {
      formData.append("img_cover_url", cover);
    }
    if (isUpdateAvatar) {
      formData.append("img_avatar_url", avatar);
    }
    // validate
    setLoading(true);
    dispatch(putCollection({data: formData, id: collection.id}, (success) => {
      setLoading(false);
      if (success) {
        onHide();
        dispatch(getCollections());
      }
    }));
  }

  function handleSubmit() {
    if (!collection) {
      createCollection();
    } else {
      updateCollection();
    }
  }

  useEffect(() => {
    if (collection) {
      setForm({
        name: collection.name,
        description: collection.description,
        img_cover_url: collection.img_cover_url,
        img_avatar_url: collection.img_avatar_url,
      });
    }
    return () => {
      setForm({
        name: "",
        description: "",
        img_cover_url: "",
        img_avatar_url: "",
      });
      setLoading(false)
    };
  }, [collection]);

  return (
    <Modal size="lg" show={ show } onHide={ () => {
      onHide();
      setErrors({});
      setLoading(false);
      setForm({
        name: "",
        description: "",
        img_cover_url: "",
        img_avatar_url: "",
      });
    } }>
      <Modal.Header closeButton>
        <Modal.Title>
          { collection ? "Edit a Collection" : "Create a Collection" }
        </Modal.Title>
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
                <div className="file" style={ {
                  height: "150px",
                  width: "150px",
                  overflow: "hidden",
                  borderRadius: "50%",
                  border: `1px solid ${ !errors.img_avatar_url ? "#ccc" : "#dc3545" }`,
                } }>
                  { avatar ? (
                    <img
                      src={ typeof avatar === "object" ? URL.createObjectURL(avatar) : getFile(avatar) }
                      alt="avatar"
                      style={ {
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      } }
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
                    onChange={ (e) => {
                      setForm(prev => {
                        return {
                          ...prev,
                          img_avatar_url: e.target.files[0]
                        };
                      })

                      setErrors(prev => {
                        return { ...prev, img_avatar_url: null };
                      });
                    }
                    }
                    required
                  />
                </div>
              </div>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="">
                Banner Image *
              </label>
              <div className="creator-media-upload w-100 mt-0">
                <div className="file w-100" style={ {
                  maxHeight: "200px",

                  overflow: "hidden",
                  border: `1px solid ${ !errors.img_cover_url ? "#ccc" : "#dc3545" }`,
                } }>
                  { cover ? (
                    <img
                      src={ typeof cover === "object" ? URL.createObjectURL(cover) : getFile(cover) }
                      style={ {
                        minHeight: "200px",
                      } }
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
                    onChange={ (e) => {
                      setForm(prev => {
                        return { ...prev, img_cover_url: e.target.files[0] };
                      })
                      setErrors(prev => {
                        return { ...prev, img_cover_url: null };
                        });
                    } }
                    required={ true }
                  />
                </div>
              </div>
            </div>
            <Form.Group>
              <Form.Label>Name *</Form.Label>
              <Form.Text className="text-muted">
                  10 ~ 50 characters
              </Form.Text>
              <Form.Control
                type="text"
                placeholder="Collection name"
                onChange={ (e) => setForm(prev => {
                  return { ...prev, name: e.target.value };
                }) }
                required={ true }
                maxLength={ 50 }
                minLength={ 10 }
                value={ name }
                isInvalid={ !!errors.name }
                onKeyDown={ (e) => {
                  setErrors(prev => {
                    return { ...prev, name: "" };
                  });
                } }
              />
              <Form.Control.Feedback tooltip>{errors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description *</Form.Label>
              <Form.Text className="text-muted">
                  max 300 characters
              </Form.Text>
              <Form.Control
                as="textarea"
                required={ true }
                rows={ 5 }
                onChange={ (e) => setForm(prev => {
                  return { ...prev, description: e.target.value };
                }) }
                placeholder="Provide a detailed description of your collection. (max 300 characters)"
                maxLength={ 300 }
                value={ description }
                isInvalid={ !!errors.description }
                onKeyDown={ (e) => {
                  setErrors(prev => {
                    return { ...prev, description: "" };
                  });
                } }
              />
              <Form.Control.Feedback tooltip>{errors.description}</Form.Control.Feedback>
            </Form.Group>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={ loading }
          variant="primary"
          className="btn-submit"
          onClick={ handleSubmit }
        >
          { collection ? "Update" : "Create" }
        </Button>
      </Modal.Footer>
    </Modal>
  )

}

export default ModalCreateCollection;