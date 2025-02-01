import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'; 

const RecipeUploadForm = () => {
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const recipesRef = collection(db, "recipes");
      const snapshot = await getDocs(recipesRef);
      const recipesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(recipesList);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleCategoryChange = (e) => {
    setCategories(e.target.value.split(",").map((category) => category.trim()));
  };

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "recipe"); 
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
      const recipe = {
        title,
        categories,
        instructions,
        ingredients: ingredients.split(",").map((ingredient) => ingredient.trim()),
        imgUrl: imageUrl, 
      };

      if (isEditing) {
        await updateDoc(doc(db, "recipes", currentRecipeId), recipe);
        toast.success("product updated successfully!");
        setIsEditing(false);
      } else {
        await addDoc(collection(db, "recipes"), recipe);
        toast.success("product uploaded successfully!");
      }

      resetForm();
      fetchRecipes();
    } catch (error) {
      console.error("Error uploading product:", error);
      toast.error("An error occurred while uploading the product.");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (recipe) => {
    setIsEditing(true);
    setCurrentRecipeId(recipe.id);
    setTitle(recipe.title);
    setCategories(recipe.categories);
    setInstructions(recipe.instructions);
    setIngredients(recipe.ingredients.join(", "));
    window.scrollTo(0, 0);
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    if (itemToDelete) {
      try {
        await deleteDoc(doc(db, "recipes", itemToDelete));
        toast.success("product deleted successfully!");
        fetchRecipes();
      } catch (error) {
        console.error("Error deleting recipe:", error);
        toast.error("An error occurred while deleting the product.");
      } finally {
        setDeleteModalOpen(false);
        setItemToDelete(null);
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategories([]);
    setInstructions("");
    setIngredients("");
    setCurrentRecipeId("");
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
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="categories">Price</Label>
              <Input
                type="text"
                name="categories"
                id="categories"
                value={categories}
                onChange={handleCategoryChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="instructions">Description</Label>
              <Input
                type="textarea"
                name="instructions"
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
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
            {recipes.map((recipe, index) => (
              <Col key={recipe.id} md={12} className="mb-3">
                <div className="recipe-card">
                  <h2>{index + 1}.</h2>
                  <img
                    src={recipe.imgUrl}
                    alt={recipe.title}
                    className="recipe-image"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                  <div className="name-edit">
                    <h5>{recipe.title}</h5>
                    <Button
                      color="warning"
                      size="sm"
                      onClick={() => handleEdit(recipe)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(recipe.id)}
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

export default RecipeUploadForm;