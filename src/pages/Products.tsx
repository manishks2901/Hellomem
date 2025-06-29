import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';

const Products: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState([]);

  // Filter states
  const [tempFilters, setTempFilters] = useState({
    categoryId: parseInt(searchParams.get('categoryId') || '0') || null,
    priceRange: [0, 10000] as [number, number],
    rating: 0,
    searchQuery: '',
    sortBy: 'popularity',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getAll(),
          categoriesAPI.getAll()
        ]);

        setProducts(productsRes.data);
        dispatch({ type: 'SET_CATEGORIES', payload: categoriesRes.data });
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchData();
  }, [dispatch]);

  // Update filters from URL params
  useEffect(() => {
    const categoryId = parseInt(searchParams.get('categoryId') || '0') || null;
    const newFilters = searchParams.get('new') === 'true';
    setTempFilters(prev => ({ ...prev, categoryId }));
    dispatch({ type: 'SET_FILTERS', payload: { categoryId } });
  }, [searchParams, dispatch]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply search query
    if (state.filters.searchQuery) {
      filtered = filtered.filter((product: any) =>
        product.name.toLowerCase().includes(state.filters.searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(state.filters.searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (state.filters.categoryId) {
      filtered = filtered.filter((product: any) => product.categoryId === state.filters.categoryId);
    }

    // Apply price range filter
    filtered = filtered.filter((product: any) =>
      product.price >= state.filters.priceRange[0] &&
      product.price <= state.filters.priceRange[1]
    );

    // Apply rating filter
    if (state.filters.rating > 0) {
      filtered = filtered.filter((product: any) => product.rating >= state.filters.rating);
    }

    // Apply sorting
    switch (state.filters.sortBy) {
      case 'price-low':
        filtered.sort((a: any, b: any) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a: any, b: any) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a: any, b: any) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a: any, b: any) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // popularity (default order)
        break;
    }

    return filtered;
  }, [products, state.filters]);

  const applyFilters = () => {
    dispatch({ type: 'SET_FILTERS', payload: tempFilters });
    setShowFilters(false);
  };

  const clearFilters = () => {
    const resetFilters = {
      categoryId: null,
      priceRange: [0, 10000] as [number, number],
      rating: 0,
      searchQuery: '',
      sortBy: 'popularity',
    };
    setTempFilters(resetFilters);
    dispatch({ type: 'SET_FILTERS', payload: resetFilters });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
            {/* Sort Dropdown */}
            <select
              value={state.filters.sortBy}
              onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { sortBy: e.target.value } })}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Toggle */}
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
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 flex-shrink-0`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={tempFilters.categoryId === null}
                        onChange={() => setTempFilters(prev => ({ ...prev, categoryId: null }))}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        All Categories
                      </span>
                    </label>
                    {state.categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          checked={tempFilters.categoryId === category.id}
                          onChange={() => setTempFilters(prev => ({ ...prev, categoryId: category.id }))}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={tempFilters.priceRange[1]}
                      onChange={(e) => setTempFilters(prev => ({
                        ...prev,
                        priceRange: [0, parseInt(e.target.value)]
                      }))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>₹0</span>
                      <span>₹{tempFilters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Minimum Rating
                  </h3>
                  <div className="space-y-2">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          checked={tempFilters.rating === rating}
                          onChange={() => setTempFilters(prev => ({ ...prev, rating }))}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {rating === 0 ? 'All Ratings' : `${rating}+ Stars`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apply Filters Button */}
                <button
                  onClick={applyFilters}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <AnimatePresence>
              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <Filter className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredProducts.map((product: any, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;