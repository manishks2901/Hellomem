import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../contexts/AppContext";

import ProductCard from "../components/common/ProductCard";

import { Category, GET_ALL_PRODUCTS, GET_CATEGORY_LIST, Product } from "../services/apiConfig";

const Products: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  
  const [tempFilters, setTempFilters] = useState({
    categoryId: parseInt(searchParams.get("categoryId") || "0") || null,
    priceRange: [0, 10000] as [number, number],
    rating: 0,
    searchQuery: "",
    sortBy: "popularity",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });


        const [productsRes, categoriesRes] = await Promise.all([
          GET_ALL_PRODUCTS(),
          GET_CATEGORY_LIST()
        ])

        setProducts(productsRes);
        setCategories(categoriesRes);
        dispatch({ type: "SET_CATEGORIES", payload: categoriesRes });
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const categoryId = parseInt(searchParams.get("categoryId") || "0") || null;
    setTempFilters((prev) => ({ ...prev, categoryId }));
    dispatch({ type: "SET_FILTERS", payload: { categoryId } });
  }, [searchParams, dispatch]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (state.filters.searchQuery) {
      const q = state.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.ProductName?.toLowerCase().includes(q) ||
          p.CategoryName?.toLowerCase().includes(q)
      );
    }

    if (state.filters.categoryId) {
      filtered = filtered.filter((p) => p.CategoryID === state.filters.categoryId);
    }

    filtered = filtered.filter(
      (p) =>
        p.Price >= state.filters.priceRange[0] &&
        p.Price <= state.filters.priceRange[1]
    );

    if (state.filters.rating > 0) {
      filtered = filtered.filter((p) => p.Rating >= state.filters.rating);
    }

    switch (state.filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.Price - b.Price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.Price - a.Price);
        break;
      case "rating":
        filtered.sort((a, b) => b.Rating - a.Rating);
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.CreatedOn).getTime() - new Date(a.CreatedOn).getTime()
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [products, state.filters]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  const applyFilters = () => {
    dispatch({ type: "SET_FILTERS", payload: tempFilters });
    setShowFilters(false);
  };

  const clearFilters = () => {
    const resetFilters = {
      categoryId: null,
      priceRange: [0, 10000] as [number, number],
      rating: 0,
      searchQuery: "",
      sortBy: "popularity",
    };
    setTempFilters(resetFilters);
    dispatch({ type: "SET_FILTERS", payload: resetFilters });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Products
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {filteredProducts.length} products found
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              aria-label="Sort products"
              value={state.filters.sortBy}
              onChange={(e) =>
                dispatch({ type: "SET_FILTERS", payload: { sortBy: e.target.value } })
              }
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
            <div className="flex bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
              <button
                type="button"
                title="Grid view"
                aria-label="Grid view"
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="List view"
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex items-center space-x-2 text-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-80 flex-shrink-0`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                <button
                  type="button"
                  title="Clear all filters"
                  onClick={clearFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Categories</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={tempFilters.categoryId === null}
                        onChange={() =>
                          setTempFilters((prev) => ({ ...prev, categoryId: null }))
                        }
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">All Categories</span>
                    </label>
                    {categories.map((cat) => (
                      <label key={cat.CategoryID} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          checked={tempFilters.categoryId === cat.CategoryID}
                          onChange={() =>
                            setTempFilters((prev) => ({ ...prev, categoryId: cat.CategoryID }))
                          }
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {cat.Name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Price Range</h3>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={tempFilters.priceRange[1]}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        priceRange: [0, parseInt(e.target.value)],
                      }))
                    }
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                    title="Select maximum price"
                  />
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>₹0</span>
                    <span>₹{tempFilters.priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Minimum Rating
                  </h3>
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={tempFilters.rating === rating}
                        onChange={() =>
                          setTempFilters((prev) => ({ ...prev, rating }))
                        }
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {rating === 0 ? "All Ratings" : `${rating}+ Stars`}
                      </span>
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  title="Apply Filters"
                  onClick={applyFilters}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid + Pagination */}
          <div className="flex-1">
            <AnimatePresence>
              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Filter className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-gray-400">Try adjusting your filters or search terms</p>
                  <button
                    onClick={clearFilters}
                    className="bg-blue-500 text-white px-6 py-2 mt-4 rounded-lg hover:bg-blue-600"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              ) : (
                <>
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {paginatedProducts.map((product, index) => (
                      <ProductCard key={product.ProductId} product={product} index={index} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-8 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from(
                      { length: Math.ceil(filteredProducts.length / productsPerPage) },
                      (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-3 py-1 rounded text-sm ${
                            currentPage === i + 1
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {i + 1}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, Math.ceil(filteredProducts.length / productsPerPage))
                        )
                      }
                      disabled={
                        currentPage === Math.ceil(filteredProducts.length / productsPerPage)
                      }
                      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;