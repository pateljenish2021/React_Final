import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { doc, getDoc} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import useAuth from "../redux/useAuth";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0); 

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeRef = doc(db, "recipes", id);
        const recipeSnap = await getDoc(recipeRef);

        if (recipeSnap.exists()) {
          const recipeData = recipeSnap.data();
          setRecipe(recipeData);

        } else {
          toast.error("Product not found");
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("An error occurred while fetching the product");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate, currentUser]);


  if (loading) {
    return <div className="fullload"><div className="loader"></div></div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const { title, categories, instructions, ingredients, imgUrl, youtubeLink } = recipe;

  const instructionListItems = instructions.split('\n').map((instruction, index) => (
    <li key={index}>{instruction}</li>
  ));


  return (
    <>
      <section className="pt-0 product-details">
        <Container>
          <Row className="space">
            <Col className="padddd" lg="10" style={{marginLeft: 'auto', marginRight: 'auto'}}>
              <div className="image recipe-img">
                <img src={imgUrl} alt={title} />
              </div>
              <div className="context">
                <h1 className="recipe_title">{title}</h1>
                <div className="categories">
                  {categories.map((cat, index) => (
                    <h3 key={index}>$ {cat}</h3>
                  ))}
                </div>
                <ol className="ollo">{instructionListItems}</ol>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ProductDetails;