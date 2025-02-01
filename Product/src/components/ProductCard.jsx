import React from 'react';
import { Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { favActions } from '../redux/slices/favSlice';
import meat from "../assets/images/non-veg.png";

const RecipeCard = ({ item = {} }) => {

  const categories = item.categories || [];

  return (
    <Col lg="3" md="1" className="mb-2 grey product-card-hover pointer">
      <div className="product__item">
        <Link to={`/recipes/${item.id}`}>
          <div className="recipe__img">
            <img
              src={item.imgUrl}
              alt=""
              style={{ height: 200, objectFit: 'contain' }}
            />
          </div>
        </Link>
        <div className="p-2 product__info">
          <Link to={`/recipes/${item.id}`}>
            <h3 className="product__name">{item.title}</h3>
          </Link>
          <div className="categories">
            {Array.isArray(categories) &&
              categories.map((category, index) => (
                <p key={index}>$ {category}</p>
              ))}
          </div>
        </div>
      </div>
    </Col>
  );
};

export default RecipeCard;