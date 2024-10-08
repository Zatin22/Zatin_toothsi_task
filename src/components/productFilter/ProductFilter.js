import React, { useState, useEffect } from "react";
import styles from "./ProductFilter.module.css";
import { IoIosRefresh } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi"; // Import hamburger icon

import { useProducts } from "../../store/ProductContext";
import { Link } from "react-router-dom";

export const ProductFilter = ({ filterProducts }) => {
  const { currentProducts, categories, loading } = useProducts();

  const [filters, setFilters] = useState({
    category: "",
    price: "",
    search: "",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFilters({ ...filters, [name]: value });
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      price: "",
      search: "",
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle mobile menu visibility
  };

  useEffect(() => {
    filterProducts(currentProducts);
  }, [loading, currentProducts, filterProducts]);

  useEffect(() => {
    let filteredItems = currentProducts;
    if (filters.category !== "") {
      filteredItems = filteredItems.filter(
        (product) => product.category === filters.category
      );
    }
    if (filters.price !== "") {
      filteredItems = filteredItems.filter(
        (product) => product.price <= Number(filters.price)
      );
    }
    if (filters.search !== "" && filters.search.length > 0) {
      filteredItems = filteredItems.filter((product) =>
        product.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    filterProducts([...filteredItems]);
  }, [filters, currentProducts, filterProducts]);

  return (
    <section className={styles.container}>
      {/* Hamburger button for mobile */}
      <button className={styles.hamburger} onClick={toggleMobileMenu}>
        <GiHamburgerMenu />
      </button>

      {/* Filter form - toggle visibility based on state */}
      <form className={`${styles.filterForm} ${isMobileMenuOpen ? styles.show : ''}`}>
        <div className={styles.left}>
          <div className={styles.selectWrapper}>
            <select
              name="category"
              onChange={handleChange}
              value={filters.category}
            >
              <option value="">Category</option>
              {categories.map((category) => {
                return (
                  <option key={category} value={category}>
                    {category}
                  </option>
                );
              })}
            </select>
            <select name="price" onChange={handleChange} value={filters.price}>
              <option value="">Price</option>
              <option value="1000">less than $1000</option>
              <option value="100">less than $100</option>
              <option value="10">less than $10</option>
            </select>
          </div>
          <button
            className={styles.resetBtn}
            type="button"
            onClick={resetFilters}
          >
            <IoIosRefresh className={styles.icon} />
            Reset
          </button>
        </div>

        <div className={styles.right}>
          <label>
            Search:
            <input
              type="text"
              name="search"
              onChange={handleChange}
              value={filters.search}
            />
          </label>
          <Link to="/cart">
            <button type="button" className={styles.button}>Add To Cart</button>
          </Link>
        </div>
      </form>
    </section>
  );
};
