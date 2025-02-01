import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ProductsList from "./ProductList";

const Shop = () => {
  const [productsData, setProductsData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductsData(products);
      setFilteredProducts(products);

      const uniqueCategories = [
        ...new Set(products.flatMap((product) => product.categories || [])),
      ];
      setCategories(uniqueCategories);
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
      applyFilters(selectedCategory, selectedType, term);
      setIsLoading(false);
    }, 500);
  };


  const handleSortChange = (order) => {
    setSortOrder(order);
    sortProducts(order);
  };

  const applyFilters = (category, type, term) => {
    let filtered = productsData;

    if (category) {
      filtered = filtered.filter((product) =>
        product.categories?.includes(category)
      );
    }

    if (term) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(filtered);
    sortProducts(sortOrder, filtered);
  };

  const sortProducts = (order, products = filteredProducts) => {
    const sorted = products.sort((a, b) => {
      const nameA = a.title.toLowerCase();
      const nameB = b.title.toLowerCase();
      if (order === "asc") {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
      }
    });
    setFilteredProducts([...sorted]); 
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <>

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
                <select onChange={(e) => handleSortChange(e.target.value)} value={sortOrder}>
                  <option value="asc">Sort by Name (A-Z)</option>
                  <option value="desc">Sort by Name (Z-A)</option>
                </select>
              </div>
            </div>
          </Row>
        </Container>

        <Container>
          <Row className="dffdd">
            {isLoading ? (
              <div className="fullload">
                <div className="loader"></div>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="text-center">
                <h5 className="no-products">No products found</h5>
              </div>
            ) : (
              <ProductsList data={currentProducts} />
            )}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Shop;
