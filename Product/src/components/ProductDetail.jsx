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
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          setProduct(productData);

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

    fetchProduct();
  }, [id, navigate, currentUser]);


  if (loading) {
    return <div className="fullload"><div className="loader"></div></div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const { name, price, descriptions, imgUrl} = product;

  const descriptionListItems = descriptions.split('\n').map((description, index) => (
    <li key={index}>{description}</li>
  ));


  return (
    <>
      <section className="pt-0 product-details">
        <Container>
          <Row className="space">
            <Col className="padddd" lg="10" style={{marginLeft: 'auto', marginRight: 'auto'}}>
                <div className="context">
                <h1 className="recipe_title" style={{marginBottom: '20px'}}>{name}</h1>
                </div>
              <div className="image recipe-img">
                <img src={imgUrl} alt={name} />
              </div>
              <div className="context">
                <div className="categories">
                  <h3>$ {price}</h3>
                </div>
                <h1>Description : </h1>
                <ol className="ollo">{descriptionListItems}</ol>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ProductDetails;