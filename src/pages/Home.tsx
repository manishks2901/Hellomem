import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight,  Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../contexts/AppContext";

import Config from "../../config";

import {
  GET_BANNER,
  GET_ALL_PRODUCTS,
  POPULAR_CATEGORY,
  PopularCategory,
  Product,
  Banner,
  GET_RECENTS_PRODUCTS_LIST,
} from "../services/apiConfig";
import MobileProductList from "../components/layout/MobileProductView";
import Products from "./Products";



const Home: React.FC = () => {
  const { state,dispatch } = useApp();
  const navigate = useNavigate();
  
  const [currentBanner, setCurrentBanner] = useState(0);
  const [banner, setBanner] = useState<Banner[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [popularCategories, setPopularCategories] = useState<PopularCategory[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState('');
  
  const isMobile = window.innerWidth < 768;
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch({ type: 'SET_FILTERS', payload: { searchQuery: searchQuery.trim() } });
      navigate('/products');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const [bannerRes, categoryRes, popularRes, recentRes] =
          await Promise.all([
            GET_BANNER(),
            POPULAR_CATEGORY(),
            GET_ALL_PRODUCTS(),
            GET_RECENTS_PRODUCTS_LIST()
          ]);
        console.log("Banners",bannerRes)
        setBanner(bannerRes);
        setPopularCategories(categoryRes);
        setPopularProducts(popularRes);
        setRecentProducts(recentRes);
      } catch (err) {
        console.error("Failed to load home data", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!banner.length) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banner.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banner.length]);

  const nextBanner = () =>
    setCurrentBanner((prev) => (prev + 1) % banner.length);
  const prevBanner = () =>
    setCurrentBanner((prev) => (prev - 1 + banner.length) % banner.length);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="md:hidden pb-4 px-4 mt-3">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for products..."
          className="w-full pl-12 pr-12 py-3 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white transition-all"
          autoComplete="off"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
            aria-label="Clear search"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.415L11.414 10l4.95 4.95a1 1 0 01-1.414 1.415L10 11.414l-4.95 4.95a1 1 0 01-1.415-1.415L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
          </div>
        </form>
      </div>
      {/* Categories */}
      <section className="py-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          {/* Horizontal Scroll Container */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {popularCategories.map((category: PopularCategory, index) => (
              <motion.div
                key={category.CategoryID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                className="flex-shrink-0 flex flex-col items-center min-w-[72px]"
              >
                <Link
                  to={`/products?categoryId=${category.CategoryID}`}
                  className="flex flex-col items-center group"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600 group-hover:border-pink-500 transition-all">
                    {category.AttachmentURL ? (
                      <img
                        src={`${Config.ADMIN_BASE_URL}${category.AttachmentURL}`}
                        alt={
                          category.AttachmentName || category.Name || "Category"
                        }
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-2xl">No Image</span>
                    )}
                  </div>
                  <span className="mt-2 text-xs font-medium text-gray-900 dark:text-white max-w-[72px] truncate text-center">
                    {category.AttachmentName}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Banner */}
       <section className="relative h-80 p-4 sm:h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl">
       <AnimatePresence mode="wait">
          {banner && banner[currentBanner] && ( // Add this check
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img
                src={`${Config.ADMIN_BASE_URL}${banner[currentBanner].BannerImgUrl}`}
                alt={banner[currentBanner].BottomTitle}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )} {/* Close the conditional rendering */}
        </AnimatePresence>

        {/* <button
          type="button"
          title="Previous banner"
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white text-black rounded-full p-1 sm:p-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          title="Next banner"
          aria-label="Next banner"
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white text-black rounded-full p-1 sm:p-2"
        >
          <ChevronRight className="h-5 w-5" />
        </button> */}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1">
          {banner.map((_, index) => (
            <button
              key={index}
              type="button"
              title={`Go to banner ${index + 1}`}
              aria-label={`Go to banner ${index + 1}`}
              onClick={() => setCurrentBanner(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentBanner ? "bg-purple-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </section>
      {
        isMobile ? <MobileProductList/> : <Products/>
      }

      {/* Popular Products */}
      {/* <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Popular Products
            </h2>
            <Link
              to="/products"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              View All <ArrowRight className="inline-block ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularProducts.map((product, index) => (
              <ProductCard
                key={product.ProductId}
                product={product}
                index={index}
              />
            ))}
          </div>
        </div>
      </section> */}

      {/* Recent Products */}
      {/* <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Recent Products
            </h2>
            <Link
              to="/products?recent=true"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              View All <ArrowRight className="inline-block ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentProducts.map((product, index) => (
              <ProductCard
                key={product.ProductId}
                product={product}
                index={index}
              />
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
