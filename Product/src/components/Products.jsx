import React, { useState, useEffect } from "react"; 
import { Container, Row } from "reactstrap";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ProductsList from "./ProductList";

const Products = () => {
  const [productsData, setProductsData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductsData(products);
      setFilteredProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setIsLoading(true);
    setTimeout(() => {
      applyFilters(term, sortOrder);
      setIsLoading(false);
    }, 500); 
  };

  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    setIsLoading(true);
    setTimeout(() => {
      applyFilters(searchTerm, order);
      setIsLoading(false);
    }, 500); 
  };

  const applyFilters = (term, order) => {
    let filtered = productsData;

    if (term) {
      filtered = filtered.filter((product) =>
        product.name?.toLowerCase().includes(term)
      );
    }

    sortProducts(filtered, order);
  };

  const sortProducts = (products, order) => {
    const sorted = [...products].sort((a, b) => {
      if (order.includes("name")) {
        const nameA = a.name?.toLowerCase() || "";
        const nameB = b.name?.toLowerCase() || "";
        return order === "name-asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (order.includes("price")) {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return order === "price-asc" ? priceA - priceB : priceB - priceA;
      }
      return 0;
    });

    setFilteredProducts(sorted);
  };

  return (
    <section className="stick-section">
      <Container>
        <Row className="justify-content-center">
          <div className="filters__container">
            {/* Search Box */}
            <div className="search__box">
              <input
                type="text"
                placeholder="Search Product ..."
                onChange={handleSearch}
                value={searchTerm}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="sort__box">
              <select onChange={handleSortChange} value={sortOrder}>
                <option value="name-asc">Sort by Name (A-Z)</option>
                <option value="name-desc">Sort by Name (Z-A)</option>
                <option value="price-asc">Sort by Price (Low to High)</option>
                <option value="price-desc">Sort by Price (High to Low)</option>
              </select>
            </div>
          </div>
        </Row>
      </Container>

      <Container>
        <Row>
          {isLoading ? (
            <div className="fullload">
              <div className="loader"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center">
              <h5 className="no-products">No products found</h5>
            </div>
          ) : (
            <ProductsList data={filteredProducts} />
          )}
        </Row>
      </Container>
    </section>
  );
};

export default Products;