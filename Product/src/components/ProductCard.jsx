import React from 'react';
import { Col } from 'reactstrap';
import { Link } from 'react-router-dom';

const ProductCard = ({ item = {} }) => {

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
            <h3 className="product__name">{item.name}</h3>
          </Link>
          <div className="categories">
            <p>$ {item.price}</p>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;