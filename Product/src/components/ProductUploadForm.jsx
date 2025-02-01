import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'; 

const ProductUploadForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [products, setProducts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, "products");
      const snapshot = await getDocs(productsRef);
      const productsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "product"); 
      formData.append("cloud_name", "dzh5ynj3i"); 

      const response = await axios.post('https://api.cloudinary.com/v1_1/dzh5ynj3i/image/upload', formData);
      const uploadedImageUrl = response.data.secure_url; 
      setImageUrl(uploadedImageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred while uploading the image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const product = {
        name,
        price,
        descriptions,
        imgUrl: imageUrl, 
      };

      if (isEditing) {
        await updateDoc(doc(db, "products", currentProductId), product);
        toast.success("product updated successfully!");
        setIsEditing(false);
      } else {
        await addDoc(collection(db, "products"), product);
        toast.success("product uploaded successfully!");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error uploading product:", error);
      toast.error("An error occurred while uploading the product.");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProductId(product.id);
    setName(product.name);
    setPrice(product.price);
    setImageUrl(product.imgUrl);
    setDescriptions(product.descriptions);
    window.scrollTo(0, 0);
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    if (itemToDelete) {
      try {
        await deleteDoc(doc(db, "products", itemToDelete));
        toast.success("product deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("An error occurred while deleting the product.");
      } finally {
        setDeleteModalOpen(false);
        setItemToDelete(null);
      }
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescriptions("");
    setCurrentProductId("");
    setImageUrl("");
  };

  return (
    <Container>
      <ToastContainer />
      <Row>
        <Col md={6} style={{ paddingLeft: "30px" }}>
          <h2 className="mt-5 mb-4">{isEditing ? "Edit Product" : "Upload Product"}</h2>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="title">Product Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="price">Price</Label>
              <Input
                type="text"
                name="price"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="descriptions">Description</Label>
              <Input
                type="textarea"
                name="descriptions"
                id="descriptions"
                value={descriptions}
                onChange={(e) => setDescriptions(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="imageUrl">Image Upload</Label>
              <Input
                type="file"
                name="imageUrl"
                id="imageUrl"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                required={!imageUrl}
              />
            </FormGroup>
            <Button type="submit" color="primary" disabled={uploading} className="upload-edit-btn">
              {uploading ? "Uploading..." : isEditing ? "Update Product" : "Upload Product"}
            </Button>
            {isEditing && (
              <Button
                type="button"
                color="secondary"
                onClick={() => {
                  resetForm();
                  setIsEditing(false);
                }}
                className="ml-2"
              >
                Cancel
              </Button>
            )}
          </Form>
        </Col>
        <Col md={6}>
          <h2 className="mt-5 mb-4">All Products</h2>
          <Row className="recipe-list">
            {products.map((product, index) => (
              <Col key={product.id} md={12} className="mb-3">
                <div className="recipe-card">
                  <h2>{index + 1}.</h2>
                  <img
                    src={product.imgUrl}
                    alt={product.name}
                    className="recipe-image"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                  <div className="name-edit">
                    <h5>{product.name}</h5>
                    <Button
                      color="warning"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {itemToDelete && (
        <Modal isOpen={isDeleteModalOpen} toggle={() => setDeleteModalOpen(false)}>
          <ModalHeader toggle={() => setDeleteModalOpen(false)}>Confirm Removal</ModalHeader>
          <ModalBody>Are you sure you want to remove this product?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleDeleteConfirmation}>
              Yes, Remove
            </Button>
            <Button color="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </Container>
  );
};

export default ProductUploadForm;